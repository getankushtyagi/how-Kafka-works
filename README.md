# 📚 Kafka Learning Projects

This repository contains Kafka examples progressing from basic to advanced.

## 📁 Project Structure

```
kafka-app/
├── Basic Examples (Current Directory)
│   ├── admin.js         - Create topics
│   ├── client.js        - Kafka client config
│   ├── producer.js      - Basic producer example
│   ├── consumer.js      - Basic consumer example
│   └── package.json
│
└── ecommerce-kafka-demo/ (Advanced Project)
    ├── README.md        - Complete documentation
    ├── ARCHITECTURE.md  - System architecture diagrams
    ├── EXPECTED-OUTPUT.md - What to expect when running
    ├── quick-start.js   - Quick start helper script
    │
    ├── config/
    │   └── kafka-client.js - Centralized Kafka config
    │
    ├── setup/
    │   └── create-topics.js - Create all topics
    │
    └── services/
        ├── order-service/       - Producer (creates orders)
        ├── payment-service/     - Consumer (processes payments)
        ├── inventory-service/   - Consumer (manages stock)
        ├── notification-service/ - Consumer (sends notifications)
        └── analytics-service/   - Consumer (business metrics)
```

## 🎓 Learning Path

### Level 1: Basic Examples (Current Directory)
**Files**: `admin.js`, `client.js`, `producer.js`, `consumer.js`

**What you'll learn:**
- ✅ How to connect to Kafka
- ✅ Create topics
- ✅ Send messages (producer)
- ✅ Receive messages (consumer)
- ✅ Basic Kafka operations

**Run the basics:**
```bash
# 1. Create a topic
node admin.js

# 2. Send a message
node producer.js

# 3. Receive messages (in another terminal)
node consumer.js
```

---

### Level 2: E-Commerce Demo (Advanced)
**Directory**: `ecommerce-kafka-demo/`

**What you'll learn:**
- ✅ Microservices architecture
- ✅ Event-driven design
- ✅ Multiple producers and consumers
- ✅ Consumer groups
- ✅ Real-world application patterns
- ✅ Handling multiple topics
- ✅ Service orchestration

**Quick Start:**
```bash
cd ecommerce-kafka-demo
node quick-start.js
```

**Full Documentation:**
See [`ecommerce-kafka-demo/README.md`](ecommerce-kafka-demo/README.md)

---

## 🚀 Getting Started From Scratch

### Option A: Docker (Easiest - Recommended for First Time)

**One command starts everything:**

```bash
docker compose up --build
```

That's it! This will:
1. Start a Kafka broker automatically 
2. Install dependencies
3. Create all topics
4. Launch the full e-commerce demo with all services
5. Show live analytics dashboard

When done:
```bash
docker compose down
```

---

### Option B: Manual Setup (Learn How It Works)

**Step 0: Install Dependencies**

Make sure you have:
- Node.js v18+ installed ([download here](https://nodejs.org))
- npm (comes with Node.js)
- A running Kafka broker (see "Start Kafka" below)

Check installation:
```bash
node --version   # Should show v18+
npm --version    # Should show 8+
```

---

#### **Step 1: Start Kafka Broker**

Choose one:

**Option 1A: Using Docker (Recommended)**
```bash
docker run -d --name kafka \
  -p 9092:9092 \
  docker.redpanda.com/redpandadata/redpanda:v24.3.5 \
  redpanda start --mode dev-container
```

**Option 1B: Using Local Kafka Installation**

If you have Kafka installed locally:
```bash
# Start broker (macOS/Linux)
$KAFKA_HOME/bin/kafka-server-start.sh $KAFKA_HOME/config/server.properties
```

**Option 1C: Using Confluent Cloud (Cloud)**

Sign up at https://confluent.cloud and use the broker address from your cluster

---

#### **Step 2: Install NPM Packages**

From the project root:
```bash
npm install
```

This installs `kafkajs` and all dependencies.

---

#### **Step 3: Run Basic Examples (Learning)**

Now test with simple producer/consumer examples:

**Terminal 1 - Create a topic:**
```bash
npm run admin
```

Expected output:
```
admin connecting ....
admin connected successfully......
Existing topics: []
Topic "rider-updates" created successfully
```

**Terminal 2 - Send a message:**
```bash
npm run producer
```

Expected output:
```
connecting producer
producer is connected
message sent successfully
producer disconnected
```

**Terminal 3 - Receive messages:**
```bash
npm run consumer
```

Expected output:
```
consumer connected successfully
consumer subscribed to topic 'rider-updates'
waiting for messages...
{
  partition: 0,
  offset: '0',
  key: 'location-update',
  value: '{"riderId":"rider-123","location":{"lat":37.7749,"lng":-122.4194},...}'
}
```

✅ **Congratulations!** You've successfully sent and received your first Kafka message!

---

#### **Step 4: Run E-Commerce Demo (Advanced)**

Once you're comfortable with basics, run the full microservices demo:

**Terminal 1 - Create topics for the demo:**
```bash
npm run ecommerce:topics
```

Expected output:
```
[bootstrap] ✓ Connected to Kafka admin
📝 Creating 4 new topic(s)...
✓ Topics created successfully:
  - orders (3 partitions)
  - payments (2 partitions)
  - inventory (2 partitions)
  - notifications (2 partitions)
```

**Terminal 2 - Start all services together:**
```bash
npm run ecommerce:start
```

What you'll see (live, in one terminal):
```
[bootstrap] Waiting for Kafka (1/30)
[bootstrap] Kafka is reachable
[bootstrap] Starting e-commerce services

[order-service] 🛒 ORDER SERVICE STARTING...
[order-service] ✓ Producer connected
[order-service] 📝 Order #1 Published: ORD-1234567-890 (User: user-101, Total: $899)

[payment-service] 💳 PAYMENT SERVICE STARTING...
[payment-service] ✓ Payment PAY-1111: SUCCESS

[inventory-service] 📦 INVENTORY SERVICE STARTING...
[inventory-service] ✓ Laptop: 1 sold (49 remaining)

[notification-service] 🔔 NOTIFICATION SERVICE STARTING...
[notification-service] 📧 Email sent to user-101@example.com

[analytics-service] 📊 E-COMMERCE ANALYTICS DASHBOARD
[analytics-service] Total Orders: 1, Total Revenue: $899
```

The system will:
- Create orders every 5 seconds
- Process payments (90% success rate)
- Update inventory
- Send notifications
- Show live analytics dashboard

Press `Ctrl+C` to stop all services.

---

### Quick Reference

| Task | Command |
|------|---------|
| **First time: Everything in Docker** | `docker compose up --build` |
| **Start Kafka only** | `docker run -d -p 9092:9092 docker.redpanda.com/redpandadata/redpanda:v24.3.5 redpanda start --mode dev-container` |
| **Install packages** | `npm install` |
| **Create basic topic** | `npm run admin` |
| **Send test message** | `npm run producer` |
| **Receive test message** | `npm run consumer` |
| **Create demo topics** | `npm run ecommerce:topics` |
| **Start demo services** | `npm run ecommerce:start` |
| **Stop Docker containers** | `docker compose down` |

---

### Prerequisites

Already covered above ✅

---

### Advanced: Custom Broker Address

By default, the project connects to `localhost:9092`. If your Kafka broker is running elsewhere:

```bash
# Set environment variable before running commands
export KAFKA_BROKERS=your-broker-ip:9092
```

Or for a specific service:
```bash
KAFKA_BROKERS=your-broker-ip:9092 npm run producer
```

---

## 📖 Which Project Should I Start With?

### Start with Basic Examples if:
- ✓ You're new to Kafka
- ✓ You want quick, simple demonstrations
- ✓ You want to understand core concepts first
- ✓ You prefer minimal code

### Move to E-Commerce Demo when:
- ✓ You understand basic producer/consumer
- ✓ You want to see real-world architecture
- ✓ You're building microservices
- ✓ You need to understand event-driven systems
- ✓ You want a complete, production-like example

---

## 🎯 Key Concepts Covered

### Basic Examples
| Concept | File | Description |
|---------|------|-------------|
| Admin Operations | `admin.js` | Create/manage topics |
| Configuration | `client.js` | Kafka connection setup |
| Publishing | `producer.js` | Send messages to topics |
| Subscribing | `consumer.js` | Read messages from topics |

### E-Commerce Demo
| Concept | Service | Description |
|---------|---------|-------------|
| Event Publishing | Order Service | Emit events when actions occur |
| Event Processing | Payment Service | React to events, process logic |
| State Management | Inventory Service | Maintain state across events |
| Fan-out Pattern | Notification Service | One event → multiple actions |
| Data Aggregation | Analytics Service | Collect and analyze events |
| Multiple Topics | All Services | Inter-service communication |
| Consumer Groups | All Consumers | Parallel processing & scaling |

---

## 🔧 Common Issues & Solutions

### "ECONNREFUSED localhost:9092"
**Problem**: Can't connect to Kafka broker

**Solutions**:
1. Make sure Kafka is running
2. Check broker address in config files
3. Test connection: `telnet localhost 9092`

### "Module not found: Cannot find module 'kafkajs'"
**Problem**: kafkajs not installed

**Solution**:
```bash
npm install kafkajs
```

### "Topic already exists"
**Problem**: Trying to create existing topic

**Solution**: This is normal! The error is handled gracefully in the code.

### Consumer receives no messages
**Solutions**:
1. Make sure producer is running and sending messages
2. Try setting `fromBeginning: true` in consumer.subscribe()
3. Verify topic name matches between producer and consumer
4. Check consumer started after topic was created

---

## 📚 Additional Resources

- **KafkaJS Docs**: https://kafka.js.org/
- **Apache Kafka**: https://kafka.apache.org/
- **Event-Driven Architecture**: https://martinfowler.com/articles/201701-event-driven.html

---

## 🏆 What's Next?

After mastering both projects, consider:

1. **Add persistence**: Integrate MongoDB or PostgreSQL
2. **Add REST APIs**: Use Express.js to create HTTP endpoints
3. **Add authentication**: Implement JWT-based security
4. **Deploy to cloud**: Try AWS MSK or Confluent Cloud
5. **Add monitoring**: Implement Prometheus + Grafana
6. **Add testing**: Write unit and integration tests
7. **Scale services**: Run multiple consumer instances

---

## 🎉 Happy Learning!

Start with the basic examples, then progress to the e-commerce demo when ready!

**Questions?** Check the documentation in each project folder.

**Need help?** Review the EXPECTED-OUTPUT.md file in the e-commerce demo to see what output should look like.
