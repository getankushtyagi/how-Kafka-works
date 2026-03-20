# 🎬 Expected Output Guide

This document shows what you should see when running each service.

## 1. Creating Topics (`node setup/create-topics.js`)

```
🔌 Connecting to Kafka admin...
✓ Connected to Kafka admin

📋 Existing topics: 

📝 Creating 4 new topic(s)...
✓ Topics created successfully:
  - orders (3 partitions)
  - payments (2 partitions)
  - inventory (2 partitions)
  - notifications (2 partitions)

📊 All topics: orders, payments, inventory, notifications

👋 Disconnected from Kafka admin
```

## 2. Order Service Output

```
🛒 ORDER SERVICE STARTING...

🔌 Connecting to Kafka...
✓ Producer connected

📦 Generating orders every 5 seconds...
Press Ctrl+C to stop

────────────────────────────────────────────────────────────────────────────────

📝 Order #1 Published:
   Order ID: ORD-1710929450123-456
   User: user-101
   Items: 2
   Total: $1078
   Products: Laptop (x1), Mouse (x1)
────────────────────────────────────────────────────────────────────────────────

📝 Order #2 Published:
   Order ID: ORD-1710929455234-789
   User: user-103
   Items: 1
   Total: $299
   Products: Monitor (x1)
────────────────────────────────────────────────────────────────────────────────
```

## 3. Payment Service Output

```
💳 PAYMENT SERVICE STARTING...

🔌 Connecting to Kafka...
✓ Connected to Kafka

✓ Subscribed to "orders" topic
💰 Processing payments...

────────────────────────────────────────────────────────────────────────────────

💳 Processing Payment:
   Order ID: ORD-1710929450123-456
   Amount: $1078
   ✓ Payment PAY-1710929450500: SUCCESS
────────────────────────────────────────────────────────────────────────────────

💳 Processing Payment:
   Order ID: ORD-1710929455234-789
   Amount: $299
   ✗ Payment PAY-1710929455600: FAILED (Insufficient funds)
────────────────────────────────────────────────────────────────────────────────
```

## 4. Inventory Service Output

```
📦 INVENTORY SERVICE STARTING...

🔌 Connecting to Kafka...
✓ Connected to Kafka

✓ Subscribed to "orders" topic
📊 Monitoring inventory...

📦 Current Stock Levels:
   Laptop: 50 units
   Mouse: 100 units
   Keyboard: 75 units
   Monitor: 30 units
   Headphones: 60 units
────────────────────────────────────────────────────────────────────────────────

📦 Updating Inventory:
   Order ID: ORD-1710929450123-456
   ✓ Laptop: 1 sold (49 remaining)
   ✓ Mouse: 1 sold (99 remaining)
   Status: ✓ All items in stock
────────────────────────────────────────────────────────────────────────────────

📦 Updating Inventory:
   Order ID: ORD-1710929455234-789
   ✓ Monitor: 1 sold (29 remaining)
   Status: ✓ All items in stock
────────────────────────────────────────────────────────────────────────────────
```

## 5. Notification Service Output

```
🔔 NOTIFICATION SERVICE STARTING...

🔌 Connecting to Kafka...
✓ Connected to Kafka

✓ Subscribed to: orders, payments, inventory
🔔 Sending notifications...

────────────────────────────────────────────────────────────────────────────────

🔔 Notification for: ORDERS
   📧 Email sent to user-101@example.com
      Subject: Order Confirmation - ORD-1710929450123-456
   📱 SMS sent to user-101: Order ORD-1710929450123-456 confirmed! Total: $1078
────────────────────────────────────────────────────────────────────────────────

🔔 Notification for: PAYMENTS
   📧 Email sent to user-101@example.com
      Subject: Payment Successful - ORD-1710929450123-456
────────────────────────────────────────────────────────────────────────────────

🔔 Notification for: PAYMENTS
   📧 Email sent to user-103@example.com
      Subject: Payment Failed - ORD-1710929455234-789
────────────────────────────────────────────────────────────────────────────────

🔔 Notification for: INVENTORY
   Status: ✓ All items in stock
────────────────────────────────────────────────────────────────────────────────
```

## 6. Analytics Service Output

```
📊 ANALYTICS SERVICE STARTING...

🔌 Connecting to Kafka...
✓ Connected to Kafka

✓ Subscribed to: orders, payments
📊 Collecting analytics data...

═══════════════════════════════════════════════════════════════════════════════
📊 E-COMMERCE ANALYTICS DASHBOARD
═══════════════════════════════════════════════════════════════════════════════

💰 ORDERS & REVENUE:
   Total Orders: 8
   Total Revenue: $3567.00
   Avg Order Value: $445.88

💳 PAYMENTS:
   Successful: 7
   Failed: 1
   Success Rate: 87.5%

🏆 TOP PRODUCTS:
   1. Laptop: 5 units ($4995.00)
   2. Monitor: 3 units ($897.00)
   3. Headphones: 2 units ($298.00)
   4. Mouse: 2 units ($58.00)
   5. Keyboard: 1 units ($79.00)

👥 TOP CUSTOMERS:
   1. user-101: 3 orders
   2. user-102: 2 orders
   3. user-103: 2 orders
   4. user-104: 1 orders

────────────────────────────────────────────────────────────────────────────────
Last Updated: 2026-03-20T10:30:45.123Z
────────────────────────────────────────────────────────────────────────────────
Press Ctrl+C to stop
```

## 7. Quick Start Helper Output

```
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

   [... rest of instructions ...]

✅ All required topics exist!

   Ready to start services! Follow Step 2 above.
```

## Tips for Viewing Multiple Services

### VS Code Split Terminal
1. Open integrated terminal
2. Click the split terminal icon (+)
3. Repeat 4 times to get 5 terminals
4. Run one service in each

### Using tmux (Linux/Mac)
```bash
# Create new session
tmux new -s kafka-demo

# Split horizontally
Ctrl+b "

# Split vertically
Ctrl+b %

# Navigate between panes
Ctrl+b [arrow keys]

# Run a service in each pane
```

### Using screen (Linux/Mac)
```bash
# Create new window
screen -S kafka-demo

# Create new window
Ctrl+a c

# Switch between windows
Ctrl+a n (next)
Ctrl+a p (previous)
```

---

**Note**: Colors and emojis may vary based on your terminal settings. If you see garbled characters, your terminal might not support Unicode emojis.
