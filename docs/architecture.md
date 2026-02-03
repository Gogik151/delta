# Архитектура Dildogram

## 1. Общая схема (Mermaid)

```mermaid
flowchart LR
  ClientMobile[Mobile Apps] -->|HTTPS| APIGW
  ClientWeb[Web App] -->|HTTPS| APIGW
  ClientDesktop[Desktop App] -->|HTTPS| APIGW

  APIGW[API Gateway] --> Auth[Auth Service]
  APIGW --> User[User Service]
  APIGW --> Chat[Chat Service]
  APIGW --> Msg[Message Service]
  APIGW --> Media[Media Service]
  APIGW --> Bot[Bot Service]
  APIGW --> Search[Search Service]

  APIGW --> WS[WebSocket Gateway]
  WS --> Msg
  WS --> Presence[Presence Service]

  Msg --> Kafka[(Kafka)]
  Chat --> Kafka
  Presence --> Redis[(Redis)]
  Msg --> Postgres[(PostgreSQL)]
  Media --> S3[(S3 Storage)]
  Search --> Elastic[(OpenSearch/Elastic)]

  Call[Call Service] --> SFU[SFU/Media Server]
  ClientWeb -->|WebRTC| Call
  ClientMobile -->|WebRTC| Call
  ClientDesktop -->|WebRTC| Call
```

## 2. Основные сервисы

| Сервис | Ответственность | Технологии |
|--------|----------------|------------|
| API Gateway | роутинг, auth middleware, rate limiting | Go + Envoy/Nginx |
| Auth Service | логин, сессии, 2FA | Go + Redis |
| User Service | профиль, контакты | Go + Postgres |
| Chat Service | чаты/каналы/роли | Go + Postgres |
| Message Service | сообщения, реакции | Go + Postgres + Kafka |
| Media Service | хранение файлов | Go + S3 |
| Call Service | звонки | Go + WebRTC/SFU |
| Bot Service | API ботов | Go + Webhooks |
| Search Service | поиск | Go + OpenSearch |
| Presence Service | онлайн/печатает | Go + Redis |

## 3. Потоки данных

### 3.1 Отправка сообщения
1. Клиент → API Gateway
2. Gateway → Message Service
3. Message Service → Postgres
4. Event `message.created` → Kafka
5. WebSocket Gateway → рассылает обновления

### 3.2 Синхронизация
- Клиент поднимает WebSocket
- Presence обновляется в Redis
- Сервер отправляет новые события

## 4. Масштабирование

- горизонтальное scaling всех stateless сервисов
- sticky sessions для WebSocket
- Media и Search — в отдельных кластерах
- Kafka и Redis в высокодоступном режиме

## 5. Best Practices

- Circuit breaker + retry policies
- Observability: Prometheus + Grafana
- Трассировка: OpenTelemetry
- Secure secrets: Vault / KMS
