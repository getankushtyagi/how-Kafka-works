# 🛒 E-Commerce Kafka Demo Project

A complete, production-ready example of building a microservices-based e-commerce system using Apache Kafka for event-driven architecture.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Services](#services)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Demo](#running-the-demo)
- [Understanding the Flow](#understanding-the-flow)
- [Key Concepts](#key-concepts)
- [Real-World Applications](#real-world-applications)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This project demonstrates how to build a scalable, event-driven e-commerce system using Kafka. When a customer places an order, multiple services react independently:

- **Payment Service** processes the payment
- **Inventory Service** updates stock levels
- **Notification Service** sends emails/SMS
- **Analytics Service** tracks business metrics

All services are **decoupled** - they don't know about each other, only about Kafka topics.

## 🏗 Architecture

```
┌─────────────────┐
│  Order Service  │ (Producer)
│   Place Order   │
└────────┬────────┘
         │ publishes to 'orders' topic
         ▼
    ┌─────────┐
    │  KAFKA  │
    └────┬────┘
         │ distributes to consumers
         ▼
    ┌────┴────┬──────────┬──────────┬───────────┐
    │         │          │          │           │
    ▼         ▼          ▼          ▼           ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐
│Payment │ │Inventory│ │Notif   │ │Analytics │ │More...   │
│Service │ │Service │ │Service │ │Service   │ │Services  │
└────────┘ └────────┘ └────────┘ └──────────┘ └──────────┘
(Consumer)  (Consumer)  (Consumer)  (Consumer)   (Future)
```

## 🔧 Services

### 1. **Order Service** (Producer)
- **File**: `services/order-service/index.js`
- **Role**: Simulates customers placing orders
- **Functionality**: 
  - Generates random orders every 5 seconds
  - Publishes to `orders` topic
  - Includes order details, items, prices

### 2. **Payment Service** (Consumer)
- **File**: `services/payment-service/index.js`
- **Role**: Processes payments for orders
- **Functionality**:
  - Listens to `orders` topic
  - Simulates payment processing (90% success rate)
  - Publishes results to `payments` topic

### 3. **Inventory Service** (Consumer)
- **File**: `services/inventory-service/index.js`
- **Role**: Manages product stock levels
- **Functionality**:
  - Listens to `orders` topic
  - Checks stock availability
  - Updates inventory (reduces stock)
  - Publishes updates to `inventory` topic

### 4. **Notification Service** (Consumer)
- **File**: `services/notification-service/index.js`
- **Role**: Sends customer notifications
- **Functionality**:
  - Listens to `orders`, `payments`, `inventory` topics
  - Sends email/SMS notifications (simulated)
  - Alerts on payment failures or stock issues

### 5. **Analytics Service** (Consumer)
- **File**: `services/analytics-service/index.js`
- **Role**: Business intelligence and reporting
- **Functionality**:
  - Listens to `orders` and `payments` topics
  - Tracks total revenue, popular products, top customers
  - Displays live dashboard every 3 seconds

## ✅ Prerequisites

1. **Kafka Running**: You need Kafka broker running (locally or remote)
2. **Node.js**: Version 14+ installed
3. **kafkajs**: Already in package.json

## 🚀 Installation

No additional installation needed! The kafkajs package is already installed in the parent directory.

**Update Kafka Broker Address:**

Edit `config/kafka-client.js` and update the broker address:

```javascript
brokers: ['YOUR_KAFKA_BROKER:9092']
```

Replace `YOUR_KAFKA_BROKER` with:
- `localhost` if Kafka is on your machine
- Your Kafka server IP address

## ▶️ Running the Demo

### Step 1: Create Topics

First, create all required Kafka topics:

```bash
node setup/create-topics.js
```

**Expected Output:**
```
✓ Connected to Kafka admin
📝 Creating 4 new topic(s)...
✓ Topics created successfully:
  - orders (3 partitions)
  - payments (2 partitions)
  - inventory (2 partitions)
  - notifications (2 partitions)
```

### Step 2: Start Services

Open **5 separate terminal windows** and run each service:

**Terminal 1 - Order Service:**
```bash
cd ecommerce-kafka-demo
node services/order-service/index.js
```

**Terminal 2 - Payment Service:**
```bash
cd ecommerce-kafka-demo
node services/payment-service/index.js
```

**Terminal 3 - Inventory Service:**
```bash
cd ecommerce-kafka-demo
node services/inventory-service/index.js
```

**Terminal 4 - Notification Service:**
```bash
cd ecommerce-kafka-demo
node services/notification-service/index.js
```

**Terminal 5 - Analytics Service:**
```bash
cd ecommerce-kafka-demo
node services/analytics-service/index.js
```

### Step 3: Watch the Magic! ✨

- **Order Service**: Creates orders every 5 seconds
- **Payment/Inventory/Notification**: Process each order in real-time
- **Analytics**: Shows live dashboard with metrics

**To stop**: Press `Ctrl+C` in each terminal

## 📊 Understanding the Flow

### Complete Order Journey

```
1. ORDER PLACED
   Order Service generates order → publishes to 'orders' topic
   
2. PARALLEL PROCESSING (happens simultaneously!)
   ├─ Payment Service: Processes payment → publishes to 'payments'
   ├─ Inventory Service: Updates stock → publishes to 'inventory'
   ├─ Notification Service: Sends confirmation email
   └─ Analytics Service: Updates metrics

3. SECONDARY NOTIFICATIONS
   Notification Service listens to 'payments' & 'inventory'
   └─ Sends payment confirmation or failure notice
   └─ Alerts on stock issues
```

**Key Point**: All services work **independently**. If Payment Service crashes, Inventory and Notifications keep working!

## 🔑 Key Concepts

### Topics
Think of topics as **channels** or **categories**:
- `orders` - All order placement events
- `payments` - Payment processing results
- `inventory` - Stock updates
- `notifications` - Notification requests

### Producers
**Send** messages to topics:
- Order Service is a producer (creates order events)
- Payment Service is both consumer (reads orders) and producer (writes payment results)

### Consumers
**Read** messages from topics:
- Each service is a consumer
- **Consumer Groups**: Multiple instances can share workload

### Partitions
Topics are split into **partitions** for parallel processing:
- `orders` has 3 partitions → 3 consumers can read in parallel
- Enables horizontal scaling!

### Messages
Each message contains:
- **Key**: For partitioning (e.g., `orderId`)
- **Value**: The actual data (JSON)
- **Headers**: Metadata (event type, source)

## 🌍 Real-World Applications

### When to Use This Pattern

✅ **Perfect For:**
- Microservices architecture
- Event-driven systems
- Real-time data processing
- High-throughput applications (millions of events)
- Systems requiring message replay
- Decoupled services

### Production Use Cases

**E-commerce (This Demo):**
- Order processing
- Payment handling
- Inventory management
- Customer notifications

**Ride-Sharing (Uber/Lyft):**
- Real-time location tracking
- Ride matching
- Pricing updates
- Driver notifications

**Social Media:**
- Activity feeds
- Notifications
- Analytics
- Content moderation

**IoT/Sensors:**
- Device telemetry
- Real-time monitoring
- Alert systems

**Banking:**
- Transaction processing
- Fraud detection
- Account updates
- Compliance logging

## 🔧 Customization Ideas

### Add More Services

**Shipping Service:**
```javascript
// Listen to 'payments' topic
// When payment succeeds → Create shipping label
```

**Fraud Detection Service:**
```javascript
// Listen to 'orders' topic
// Check for suspicious patterns
// Block fraudulent orders
```

**Loyalty Points Service:**
```javascript
// Listen to 'payments' topic
// Award points on successful payment
```

### Modify Behavior

**Change Order Frequency:**
Edit `services/order-service/index.js`:
```javascript
setInterval(async () => {
    // ...
}, 2000); // Change from 5000 to 2000 (2 seconds)
```

**Adjust Payment Success Rate:**
Edit `services/payment-service/index.js`:
```javascript
const isSuccess = Math.random() > 0.2; // 80% success (was 90%)
```

## 🐛 Troubleshooting

### Connection Refused
**Error**: `ECONNREFUSED localhost:9092`

**Solution**: 
- Make sure Kafka is running
- Check broker address in `config/kafka-client.js`
- Test connection: `telnet localhost 9092`

### Topic Already Exists
**Error**: `Topic 'orders' already exists`

**Solution**: This is normal! The script detects existing topics.

### Consumer Not Receiving Messages
**Solution**:
- Make sure Order Service is running
- Check consumer started AFTER topics were created
- Try `fromBeginning: true` in subscribe options

### Module Not Found
**Error**: `Cannot find module 'kafkajs'`

**Solution**:
```bash
cd .. # Go to parent kafka-app directory
npm install kafkajs
```

## 📚 Learning Resources

- **KafkaJS Documentation**: https://kafka.js.org/
- **Apache Kafka**: https://kafka.apache.org/
- **Event-Driven Architecture**: Martin Fowler's articles

## 🎓 What You Learned

After running this demo, you now understand:

✅ How to build microservices with Kafka  
✅ Producer-Consumer pattern  
✅ Event-driven architecture  
✅ How to handle multiple topics  
✅ Consumer groups and scaling  
✅ Real-world e-commerce flow  
✅ Asynchronous processing benefits  

## 🚀 Next Steps

1. **Add a database**: Store orders in MongoDB/PostgreSQL
2. **Add REST APIs**: Expose HTTP endpoints with Express.js
3. **Add authentication**: Secure with JWT tokens
4. **Deploy to cloud**: AWS MSK, Confluent Cloud
5. **Add monitoring**: Prometheus + Grafana
6. **Scale services**: Run multiple consumer instances

---

**Built with ❤️ using Node.js and KafkaJS**

Happy Coding! 🎉
