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

## 🚀 Getting Started

### Prerequisites
1. **Kafka broker running** (local or remote)
2. **Node.js** installed (v18+)
3. **kafkajs** package installed ✅ (already done)

### Update Broker Address

**For basic examples**, edit [`client.js`](client.js):
```javascript
brokers: ['YOUR_KAFKA_BROKER:9092']
```

**For e-commerce demo**, edit [`ecommerce-kafka-demo/config/kafka-client.js`](ecommerce-kafka-demo/config/kafka-client.js):
```javascript
brokers: ['YOUR_KAFKA_BROKER:9092']
```

Replace `YOUR_KAFKA_BROKER` with:
- `localhost` - if Kafka is running locally
- Your server IP - if Kafka is remote

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
