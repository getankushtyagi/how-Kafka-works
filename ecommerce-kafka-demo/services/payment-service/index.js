/**
 * PAYMENT SERVICE - CONSUMER
 * 
 * This service processes payments for orders placed through the Order Service.
 * It listens to the 'orders' topic and processes payment for each order.
 * 
 * Flow:
 * 1. Listens to 'orders' topic
 * 2. Receives order event
 * 3. Processes payment (simulated)
 * 4. Publishes payment result to 'payments' topic
 * 
 * Run: node services/payment-service/index.js
 */

import { kafka } from '../../config/kafka-client.js';

/**
 * Simulate payment processing
 * In real application: integrate with Stripe, PayPal, etc.
 */
async function processPayment(order) {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate 90% success rate
    const isSuccess = Math.random() > 0.1;

    return {
        paymentId: `PAY-${Date.now()}`,
        orderId: order.orderId,
        userId: order.userId,
        amount: order.totalAmount,
        status: isSuccess ? 'SUCCESS' : 'FAILED',
        reason: isSuccess ? 'Payment processed successfully' : 'Insufficient funds',
        timestamp: new Date().toISOString(),
    };
}

/**
 * Main payment service function
 */
async function startPaymentService() {
    const consumer = kafka.consumer({ groupId: 'payment-service-group' });
    const producer = kafka.producer(); // To publish payment results

    try {
        console.log('💳 PAYMENT SERVICE STARTING...\n');

        // Connect consumer and producer
        console.log('🔌 Connecting to Kafka...');
        await consumer.connect();
        await producer.connect();
        console.log('✓ Connected to Kafka\n');

        // Subscribe to orders topic
        await consumer.subscribe({ 
            topic: 'orders', 
            fromBeginning: false  // Only new orders
        });
        console.log('✓ Subscribed to "orders" topic');
        console.log('💰 Processing payments...\n');
        console.log('─'.repeat(80));

        // Process messages
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    // Parse order
                    const order = JSON.parse(message.value.toString());

                    console.log(`\n💳 Processing Payment:`);
                    console.log(`   Order ID: ${order.orderId}`);
                    console.log(`   Amount: $${order.totalAmount}`);

                    // Process payment
                    const payment = await processPayment(order);

                    // Publish payment result
                    await producer.send({
                        topic: 'payments',
                        messages: [{
                            key: order.orderId,
                            value: JSON.stringify(payment),
                            headers: {
                                'event-type': 'payment.processed',
                                'source': 'payment-service',
                            },
                        }],
                    });

                    // Log result
                    if (payment.status === 'SUCCESS') {
                        console.log(`   ✓ Payment ${payment.paymentId}: SUCCESS`);
                    } else {
                        console.log(`   ✗ Payment ${payment.paymentId}: FAILED (${payment.reason})`);
                    }
                    console.log('─'.repeat(80));

                } catch (error) {
                    console.error('❌ Error processing payment:', error.message);
                }
            },
        });

    } catch (error) {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    }

    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('\n\n🛑 Shutting down Payment Service...');
        await consumer.disconnect();
        await producer.disconnect();
        console.log('✓ Disconnected from Kafka');
        process.exit(0);
    });
}

// Start the service
startPaymentService();
