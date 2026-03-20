/**
 * Quick Start Script
 * 
 * This helper script provides information on how to run the demo.
 * It's designed to guide users rather than running everything automatically,
 * as each service should be visible in separate terminals for learning purposes.
 * 
 * Run: node quick-start.js
 */

console.log(`
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║               🛒  E-COMMERCE KAFKA DEMO - QUICK START GUIDE                  ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝

📚 STEP 1: Create Kafka Topics
   Run this command first (only needed once):
   
   $ node setup/create-topics.js

   This creates: orders, payments, inventory, notifications topics

─────────────────────────────────────────────────────────────────────────────────

🚀 STEP 2: Start Services in Separate Terminals

   Open 5 terminal windows and run these commands:

   Terminal 1 - Order Service (Producer):
   $ node services/order-service/index.js

   Terminal 2 - Payment Service:
   $ node services/payment-service/index.js

   Terminal 3 - Inventory Service:
   $ node services/inventory-service/index.js

   Terminal 4 - Notification Service:
   $ node services/notification-service/index.js

   Terminal 5 - Analytics Dashboard:
   $ node services/analytics-service/index.js

─────────────────────────────────────────────────────────────────────────────────

📊 WHAT YOU'LL SEE:

   • Order Service: Creates new orders every 5 seconds
   • Payment Service: Processes payments (90% success rate)
   • Inventory Service: Updates stock levels
   • Notification Service: Sends emails/SMS (simulated)
   • Analytics Service: Live dashboard with metrics

─────────────────────────────────────────────────────────────────────────────────

⚡ QUICK TIP:

   Use terminal multiplexers like tmux or screen, or use VS Code's split terminal
   feature to view all services at once!

   To stop any service: Press Ctrl+C

─────────────────────────────────────────────────────────────────────────────────

📖 For detailed documentation, read: README.md

╔═══════════════════════════════════════════════════════════════════════════════╗
║                           Happy Learning! 🎉                                  ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`);

// Optional: Check if topics are created
import { kafka } from './config/kafka-client.js';

async function checkSetup() {
    const admin = kafka.admin();
    
    try {
        await admin.connect();
        const topics = await admin.listTopics();
        
        const requiredTopics = ['orders', 'payments', 'inventory', 'notifications'];
        const missingTopics = requiredTopics.filter(t => !topics.includes(t));
        
        if (missingTopics.length > 0) {
            console.log('⚠️  WARNING: Missing topics:', missingTopics.join(', '));
            console.log('   Please run: node setup/create-topics.js\n');
        } else {
            console.log('✅ All required topics exist!\n');
            console.log('   Ready to start services! Follow Step 2 above.\n');
        }
        
        await admin.disconnect();
    } catch (error) {
        console.log('⚠️  Could not connect to Kafka.');
        console.log('   Make sure Kafka is running and broker address is correct.');
        console.log('   Edit config/kafka-client.js to update broker settings.\n');
    }
}

checkSetup();
