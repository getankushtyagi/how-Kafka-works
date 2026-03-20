/**
 * ANALYTICS SERVICE - CONSUMER
 * 
 * This service collects and analyzes data from all topics for business intelligence.
 * It tracks metrics like:
 * - Total orders
 * - Total revenue
 * - Payment success rate
 * - Popular products
 * - Inventory levels
 * 
 * Flow:
 * 1. Listens to all topics (orders, payments, inventory)
 * 2. Aggregates data
 * 3. Generates real-time analytics
 * 4. Displays dashboard (console output)
 * 
 * In production: Send data to analytics platforms like:
 * - Elasticsearch + Kibana
 * - Google Analytics
 * - Custom dashboards
 * 
 * Run: node services/analytics-service/index.js
 */

import { kafka } from '../../config/kafka-client.js';

// Analytics data (in production: use a database)
const analytics = {
    totalOrders: 0,
    totalRevenue: 0,
    successfulPayments: 0,
    failedPayments: 0,
    productSales: {},
    ordersByUser: {},
    lastUpdated: null,
};

/**
 * Update analytics with order data
 */
function updateOrderAnalytics(order) {
    analytics.totalOrders++;
    analytics.totalRevenue += order.totalAmount;
    
    // Track orders by user
    analytics.ordersByUser[order.userId] = 
        (analytics.ordersByUser[order.userId] || 0) + 1;

    // Track product sales
    order.items.forEach(item => {
        if (!analytics.productSales[item.productId]) {
            analytics.productSales[item.productId] = {
                name: item.productName,
                unitsSold: 0,
                revenue: 0,
            };
        }
        analytics.productSales[item.productId].unitsSold += item.quantity;
        analytics.productSales[item.productId].revenue += item.subtotal;
    });

    analytics.lastUpdated = new Date().toISOString();
}

/**
 * Update analytics with payment data
 */
function updatePaymentAnalytics(payment) {
    if (payment.status === 'SUCCESS') {
        analytics.successfulPayments++;
    } else {
        analytics.failedPayments++;
    }
    analytics.lastUpdated = new Date().toISOString();
}

/**
 * Display analytics dashboard
 */
function displayDashboard() {
    console.clear();
    console.log('═'.repeat(80));
    console.log('📊 E-COMMERCE ANALYTICS DASHBOARD');
    console.log('═'.repeat(80));
    console.log();

    // Orders & Revenue
    console.log('💰 ORDERS & REVENUE:');
    console.log(`   Total Orders: ${analytics.totalOrders}`);
    console.log(`   Total Revenue: $${analytics.totalRevenue.toFixed(2)}`);
    console.log(`   Avg Order Value: $${analytics.totalOrders ? (analytics.totalRevenue / analytics.totalOrders).toFixed(2) : 0}`);
    console.log();

    // Payments
    const totalPayments = analytics.successfulPayments + analytics.failedPayments;
    const successRate = totalPayments ? ((analytics.successfulPayments / totalPayments) * 100).toFixed(1) : 0;
    console.log('💳 PAYMENTS:');
    console.log(`   Successful: ${analytics.successfulPayments}`);
    console.log(`   Failed: ${analytics.failedPayments}`);
    console.log(`   Success Rate: ${successRate}%`);
    console.log();

    // Top Products
    const topProducts = Object.values(analytics.productSales)
        .sort((a, b) => b.unitsSold - a.unitsSold)
        .slice(0, 5);
    
    if (topProducts.length > 0) {
        console.log('🏆 TOP PRODUCTS:');
        topProducts.forEach((product, index) => {
            console.log(`   ${index + 1}. ${product.name}: ${product.unitsSold} units ($${product.revenue.toFixed(2)})`);
        });
        console.log();
    }

    // Top Customers
    const topCustomers = Object.entries(analytics.ordersByUser)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    if (topCustomers.length > 0) {
        console.log('👥 TOP CUSTOMERS:');
        topCustomers.forEach(([userId, count], index) => {
            console.log(`   ${index + 1}. ${userId}: ${count} orders`);
        });
        console.log();
    }

    console.log('─'.repeat(80));
    console.log(`Last Updated: ${analytics.lastUpdated || 'Waiting for data...'}`);
    console.log('─'.repeat(80));
    console.log('Press Ctrl+C to stop');
    console.log();
}

/**
 * Main analytics service function
 */
async function startAnalyticsService() {
    const consumer = kafka.consumer({ groupId: 'analytics-service-group' });

    try {
        console.log('📊 ANALYTICS SERVICE STARTING...\n');

        // Connect
        console.log('🔌 Connecting to Kafka...');
        await consumer.connect();
        console.log('✓ Connected to Kafka\n');

        // Subscribe to all relevant topics
        await consumer.subscribe({ 
            topics: ['orders', 'payments'],
            fromBeginning: false 
        });
        console.log('✓ Subscribed to: orders, payments');
        console.log('📊 Collecting analytics data...\n');

        // Display dashboard every 3 seconds
        setInterval(displayDashboard, 3000);

        // Process messages
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const data = JSON.parse(message.value.toString());

                    // Update analytics based on topic
                    switch (topic) {
                        case 'orders':
                            updateOrderAnalytics(data);
                            break;
                        case 'payments':
                            updatePaymentAnalytics(data);
                            break;
                    }

                } catch (error) {
                    console.error('❌ Error processing analytics:', error.message);
                }
            },
        });

    } catch (error) {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    }

    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('\n\n🛑 Shutting down Analytics Service...');
        await consumer.disconnect();
        console.log('✓ Disconnected from Kafka');
        process.exit(0);
    });
}

// Start the service
startAnalyticsService();
