/**
 * INVENTORY SERVICE - CONSUMER
 * 
 * This service manages product inventory and stock levels.
 * It listens to the 'orders' topic and updates stock when orders are placed.
 * 
 * Flow:
 * 1. Listens to 'orders' topic
 * 2. Receives order event
 * 3. Checks stock availability
 * 4. Updates inventory (reduces stock)
 * 5. Publishes inventory update to 'inventory' topic
 * 
 * Run: node services/inventory-service/index.js
 */

import { kafka } from '../../config/kafka-client.js';

// In-memory inventory (in production: use a database)
const inventory = {
    'P001': { name: 'Laptop', stock: 50 },
    'P002': { name: 'Mouse', stock: 100 },
    'P003': { name: 'Keyboard', stock: 75 },
    'P004': { name: 'Monitor', stock: 30 },
    'P005': { name: 'Headphones', stock: 60 },
};

/**
 * Update inventory for an order
 */
function updateInventory(order) {
    const updates = [];
    let allAvailable = true;

    for (const item of order.items) {
        const product = inventory[item.productId];
        
        if (!product) {
            updates.push({
                productId: item.productId,
                productName: item.productName,
                requested: item.quantity,
                available: 0,
                status: 'UNAVAILABLE',
            });
            allAvailable = false;
            continue;
        }

        if (product.stock >= item.quantity) {
            product.stock -= item.quantity;
            updates.push({
                productId: item.productId,
                productName: item.productName,
                requested: item.quantity,
                newStock: product.stock,
                status: 'UPDATED',
            });
        } else {
            updates.push({
                productId: item.productId,
                productName: item.productName,
                requested: item.quantity,
                available: product.stock,
                status: 'INSUFFICIENT_STOCK',
            });
            allAvailable = false;
        }
    }

    return {
        orderId: order.orderId,
        updates,
        allAvailable,
        timestamp: new Date().toISOString(),
    };
}

/**
 * Main inventory service function
 */
async function startInventoryService() {
    const consumer = kafka.consumer({ groupId: 'inventory-service-group' });
    const producer = kafka.producer();

    try {
        console.log('📦 INVENTORY SERVICE STARTING...\n');

        // Connect
        console.log('🔌 Connecting to Kafka...');
        await consumer.connect();
        await producer.connect();
        console.log('✓ Connected to Kafka\n');

        // Subscribe to orders topic
        await consumer.subscribe({ 
            topic: 'orders', 
            fromBeginning: false 
        });
        console.log('✓ Subscribed to "orders" topic');
        console.log('📊 Monitoring inventory...\n');
        
        // Display initial stock
        console.log('📦 Current Stock Levels:');
        Object.entries(inventory).forEach(([id, prod]) => {
            console.log(`   ${prod.name}: ${prod.stock} units`);
        });
        console.log('─'.repeat(80));

        // Process messages
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const order = JSON.parse(message.value.toString());

                    console.log(`\n📦 Updating Inventory:`);
                    console.log(`   Order ID: ${order.orderId}`);

                    // Update inventory
                    const result = updateInventory(order);

                    // Log updates
                    result.updates.forEach(update => {
                        if (update.status === 'UPDATED') {
                            console.log(`   ✓ ${update.productName}: ${update.requested} sold (${update.newStock} remaining)`);
                        } else if (update.status === 'INSUFFICIENT_STOCK') {
                            console.log(`   ⚠ ${update.productName}: Insufficient stock (need ${update.requested}, have ${update.available})`);
                        } else {
                            console.log(`   ✗ ${update.productName}: Product not found`);
                        }
                    });

                    // Publish inventory update
                    await producer.send({
                        topic: 'inventory',
                        messages: [{
                            key: order.orderId,
                            value: JSON.stringify(result),
                            headers: {
                                'event-type': 'inventory.updated',
                                'source': 'inventory-service',
                            },
                        }],
                    });

                    if (result.allAvailable) {
                        console.log(`   Status: ✓ All items in stock`);
                    } else {
                        console.log(`   Status: ⚠ Some items unavailable`);
                    }
                    console.log('─'.repeat(80));

                } catch (error) {
                    console.error('❌ Error updating inventory:', error.message);
                }
            },
        });

    } catch (error) {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    }

    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('\n\n🛑 Shutting down Inventory Service...');
        await consumer.disconnect();
        await producer.disconnect();
        console.log('✓ Disconnected from Kafka');
        process.exit(0);
    });
}

// Start the service
startInventoryService();
