/**
 * Kafka Topics Setup Script
 * 
 * This script creates all the topics needed for the e-commerce application.
 * Run this ONCE before starting the services.
 * 
 * Usage: node setup/create-topics.js
 * 
 * Topics created:
 * - orders: Order placement events
 * - payments: Payment processing events
 * - inventory: Stock update events
 * - notifications: Notification events
 */

import { kafka } from '../config/kafka-client.js';

async function createTopics() {
    const admin = kafka.admin();
    
    try {
        console.log('🔌 Connecting to Kafka admin...');
        await admin.connect();
        console.log('✓ Connected to Kafka admin\n');

        // Get existing topics
        const existingTopics = await admin.listTopics();
        console.log('📋 Existing topics:', existingTopics.join(', ') || 'None\n');

        // Define topics to create
        const topicsToCreate = [
            {
                topic: 'orders',
                numPartitions: 3,  // 3 partitions for parallel processing
                replicationFactor: 1, // Change to 2+ in production with multiple brokers
            },
            {
                topic: 'payments',
                numPartitions: 2,
                replicationFactor: 1,
            },
            {
                topic: 'inventory',
                numPartitions: 2,
                replicationFactor: 1,
            },
            {
                topic: 'notifications',
                numPartitions: 2,
                replicationFactor: 1,
            },
        ];

        // Create topics that don't exist
        const newTopics = topicsToCreate.filter(
            t => !existingTopics.includes(t.topic)
        );

        if (newTopics.length === 0) {
            console.log('✓ All topics already exist!');
        } else {
            console.log(`📝 Creating ${newTopics.length} new topic(s)...`);
            
            await admin.createTopics({
                topics: newTopics,
                waitForLeaders: true, // Wait for partition leaders to be elected
            });

            console.log('✓ Topics created successfully:');
            newTopics.forEach(t => {
                console.log(`  - ${t.topic} (${t.numPartitions} partitions)`);
            });
        }

        // List all topics after creation
        const allTopics = await admin.listTopics();
        console.log('\n📊 All topics:', allTopics.join(', '));

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await admin.disconnect();
        console.log('\n👋 Disconnected from Kafka admin');
    }
}

// Run the setup
createTopics();
