/**
 * ORDER SERVICE - PRODUCER
 * 
 * This service simulates a customer placing orders in an e-commerce system.
 * When an order is placed, it publishes an event to the 'orders' topic.
 * 
 * Flow:
 * 1. Customer places order → Order Service creates order
 * 2. Order Service publishes event to Kafka 'orders' topic
 * 3. Multiple services consume this event (payment, inventory, notifications)
 * 
 * Run: node services/order-service/index.js
 */

import { kafka } from '../../config/kafka-client.js';

// Sample product catalog
const PRODUCTS = [
    { id: 'P001', name: 'Laptop', price: 999, stock: 50 },
    { id: 'P002', name: 'Mouse', price: 29, stock: 100 },
    { id: 'P003', name: 'Keyboard', price: 79, stock: 75 },
    { id: 'P004', name: 'Monitor', price: 299, stock: 30 },
    { id: 'P005', name: 'Headphones', price: 149, stock: 60 },
];

// Sample users
const USERS = ['user-101', 'user-102', 'user-103', 'user-104'];

/**
 * Generate a random order
 */
function generateOrder() {
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const userId = USERS[Math.floor(Math.random() * USERS.length)];
    
    // Random 1-3 items
    const itemCount = Math.floor(Math.random() * 3) + 1;
    const items = [];
    let totalAmount = 0;

    for (let i = 0; i < itemCount; i++) {
        const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const itemTotal = product.price * quantity;
        
        items.push({
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity: quantity,
            subtotal: itemTotal,
        });
        
        totalAmount += itemTotal;
    }

    return {
        orderId,
        userId,
        items,
        totalAmount,
        status: 'PENDING',
        timestamp: new Date().toISOString(),
    };
}

/**
 * Main order service function
 */
async function startOrderService() {
    const producer = kafka.producer();

    try {
        console.log('🛒 ORDER SERVICE STARTING...\n');
        
        // Connect producer
        console.log('🔌 Connecting to Kafka...');
        await producer.connect();
        console.log('✓ Producer connected\n');

        console.log('📦 Generating orders every 5 seconds...');
        console.log('Press Ctrl+C to stop\n');
        console.log('─'.repeat(80));

        // Generate orders every 5 seconds
        let orderCount = 0;
        setInterval(async () => {
            try {
                const order = generateOrder();
                orderCount++;

                // Publish to Kafka
                await producer.send({
                    topic: 'orders',
                    messages: [
                        {
                            key: order.orderId,  // Key for partitioning
                            value: JSON.stringify(order), // Message payload
                            headers: {
                                'event-type': 'order.created',
                                'source': 'order-service',
                            },
                        },
                    ],
                });

                // Log order details
                console.log(`\n📝 Order #${orderCount} Published:`);
                console.log(`   Order ID: ${order.orderId}`);
                console.log(`   User: ${order.userId}`);
                console.log(`   Items: ${order.items.length}`);
                console.log(`   Total: $${order.totalAmount}`);
                console.log(`   Products: ${order.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}`);
                console.log('─'.repeat(80));

            } catch (error) {
                console.error('❌ Error sending order:', error.message);
            }
        }, 5000); // Every 5 seconds

    } catch (error) {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    }

    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('\n\n🛑 Shutting down Order Service...');
        await producer.disconnect();
        console.log('✓ Disconnected from Kafka');
        process.exit(0);
    });
}

// Start the service
startOrderService();
