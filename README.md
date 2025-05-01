<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" alt="NestJS" height="40"/>
  <img src="https://www.mongodb.com/assets/images/global/favicon.ico" alt="MongoDB" height="40"/>
  <img src="https://www.rabbitmq.com/img/rabbitmq-logo.svg" alt="RabbitMQ" height="40"/>
  <img src="https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png" alt="Docker" height="40"/>
</p>

# Invoice Microservices Project

This is a minimal microservices-based project that demonstrates the integration of several backend technologies including **NestJS**, **MongoDB**, **RabbitMQ**, and **Docker**. It includes both unit and end-to-end tests and simulates a real-world scenario where users can create invoices and receive daily reports via email.

---

## 🧱 Tech Stack

- **NestJS Microservices**
- **MongoDB**
- **RabbitMQ**
- **Docker Compose**
- **MailHog (SMTP Mock Server)**

---

## 🧠 How It Works

- Invoices are stored in MongoDB.
- A **cron job** runs daily at **12:00 PM** to generate a report and send it via **RabbitMQ**.
- The `email-sender` microservice listens to the RabbitMQ queue and sends the email.
- If offline, it processes messages as soon as it comes online.
- **MailHog** captures and displays all outgoing emails at `http://localhost:8025`.

---

## 🚀 Getting Started

Clone the repo and run the following command to start all services:

```bash
docker compose up
```

> **Note:** If you encounter port conflicts (e.g. ports 3000, 15672, 8025), you can change the exposed ports in the `docker-compose.yml` file.

Once all containers are up and running:

- API will be available at: `http://localhost:3000`
- RabbitMQ Dashboard: `http://localhost:15672` (user: `guest`, password: `guest`)
- MailHog UI: `http://localhost:8025`

---

## 📬 API Endpoints

### 1. Create an Invoice

**POST** `/invoices`

```json
{
  "customer": "John",
  "amount": 100,
  "reference": "RF10",
  "items": [
    { "sku": "SKU101", "qt": 2 },
    { "sku": "SKU102", "qt": 1 }
  ]
}
```

**Curl Example:**

```bash
curl --location 'http://localhost:3000/invoices' --header 'Content-Type: application/json' --data '{
  "customer": "John",
  "amount": 100,
  "reference": "RF10",
  "items": [
    {"sku": "SKU101", "qt": 2},
    {"sku": "SKU102", "qt": 1}
  ]
}'
```

### 2. Get All Invoices

**GET** `/invoices`

### 3. Get Invoice by ID

**GET** `/invoices/{id}`  
Example:  
`http://localhost:3000/invoices/680d593a4a15210039c59825`

---

## 📊 Daily Reports

### 1. View Today's Report

**GET** `/report`

### 2. View Report by Date

**GET** `/report?date=YYYY-MM-DD`  
Example:  
`http://localhost:3000/report?date=2025-04-30`

### 3. Send Today's Report (to RabbitMQ)

**GET** `/report/send`

### 4. Send Report by Date

**GET** `/report/send?date=YYYY-MM-DD`  
Example:  
`http://localhost:3000/report/send?date=2025-04-30`

---

## 🧪 Running Tests

Make sure containers are running, then:

```bash
docker compose exec email-sender npm run test
docker compose exec invoice-service npm run test
docker compose exec invoice-service npm run test:e2e
```

> Note: For e2e tests, MongoDB and RabbitMQ must be up and running.

---

## 📥 Postman Collection

You can find the Postman collection for testing the APIs here:  
[Postman Link](https://marketgang.postman.co/workspace/market-gang's-Workspace~3f1b8542-0b59-49f8-862d-9c27317b3ec9/collection/44460458-afaaa2db-3f2c-4654-a598-b404fcb19e7c?action=share&creator=44460458)

---

## 🪵 Logs

All logs for `invoice-service` and `email-sender` will be generated in the root directory beside `docker-compose.yml`.

---

## 📧 Contact

For any questions or feedback:  
**Email:** reza.toosi@gmail.com
