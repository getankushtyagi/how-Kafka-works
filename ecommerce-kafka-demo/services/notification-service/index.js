/**
 * NOTIFICATION SERVICE - CONSUMER
 * 
 * This service sends notifications to customers about their orders and payments.
 * It listens to multiple topics: orders, payments, inventory
 * 
 * Flow:
 * 1. Listens to 'orders', 'payments', and 'inventory' topics
 * 2. Receives events from these topics
 * 3. Sends appropriate notifications (email, SMS, push - simulated)
 * 
 * Real implementation would integrate with:
 * - SendGrid/AWS SES for emails
 * - Twilio for SMS
 * - Firebase for push notifications
 * 
 * Run: node services/notification-service/index.js
 */

import { kafka } from '../../config/kafka-client.js';

/**
 * Simulate sending email
 */
async function sendEmail(to, subject, body) {
    // In production: integrate with SendGrid, AWS SES, etc.
    console.log(`   📧 Email sent to ${to}`);
    console.log(`      Subject: ${subject}`);
}

/**
 * Simulate sending SMS
 */
async function sendSMS(to, message) {
    // In production: integrate with Twilio, AWS SNS, etc.
    console.log(`   📱 SMS sent to ${to}: ${message}`);
}

/**
 * Handle order notifications
 */
async function handleOrderNotification(order) {
    const itemsList = order.items.map(i => 
        `${i.productName} (x${i.quantity})`
    ).join(', ');

    await sendEmail(
        `${order.userId}@example.com`,
        `Order Confirmation - ${order.orderId}`,
        `Your order for ${itemsList} has been placed. Total: $${order.totalAmount}`
    );

    await sendSMS(
        order.userId,
        `Order ${order.orderId} confirmed! Total: $${order.totalAmount}`
    );
}

/**
 * Handle payment notifications
 */
async function handlePaymentNotification(payment) {
    if (payment.status === 'SUCCESS') {
        await sendEmail(
            `${payment.userId}@example.com`,
            `Payment Successful - ${payment.orderId}`,
            `Payment of $${payment.amount} processed successfully.`
        );
    } else {
        await sendEmail(
            `${payment.userId}@example.com`,
            `Payment Failed - ${payment.orderId}`,
            `Payment failed: ${payment.reason}. Please try again.`
        );
    }
}

/**
 * Handle inventory notifications
 */
async function handleInventoryNotification(inventoryUpdate) {
    const hasIssues = !inventoryUpdate.allAvailable;
    
    if (hasIssues) {
        // Notify customer about stock issues
        const unavailableItems = inventoryUpdate.updates
            .filter(u => u.status !== 'UPDATED')
            .map(u => u.productName)
            .join(', ');

        console.log(`   ⚠️ Alert: Stock issues for order ${inventoryUpdate.orderId}`);
        console.log(`      Unavailable: ${unavailableItems}`);
    }
}

/**
 * Main notification service function
 */
async function startNotificationService() {
    const consumer = kafka.consumer({ groupId: 'notification-service-group' });

    try {
        console.log('🔔 NOTIFICATION SERVICE STARTING...\n');

        // Connect
        console.log('🔌 Connecting to Kafka...');
        await consumer.connect();
        console.log('✓ Connected to Kafka\n');

        // Subscribe to multiple topics
        await consumer.subscribe({ 
            topics: ['orders', 'payments', 'inventory'],
            fromBeginning: false 
        });
        console.log('✓ Subscribed to: orders, payments, inventory');
        console.log('🔔 Sending notifications...\n');
        console.log('─'.repeat(80));

        // Process messages from all topics
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const data = JSON.parse(message.value.toString());

                    console.log(`\n🔔 Notification for: ${topic.toUpperCase()}`);

                    // Route to appropriate handler based on topic
                    switch (topic) {
                        case 'orders':
                            await handleOrderNotification(data);
                            break;
                        case 'payments':
                            await handlePaymentNotification(data);
                            break;
                        case 'inventory':
                            await handleInventoryNotification(data);
                            break;
                        default:
                            console.log('   Unknown topic');
                    }

                    console.log('─'.repeat(80));

                } catch (error) {
                    console.error('❌ Error sending notification:', error.message);
                }
            },
        });

    } catch (error) {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    }

    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('\n\n🛑 Shutting down Notification Service...');
        await consumer.disconnect();
        console.log('✓ Disconnected from Kafka');
        process.exit(0);
    });
}

// Start the service
startNotificationService();
