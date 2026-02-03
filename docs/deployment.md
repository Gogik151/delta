# Деплой (Docker)

## docker-compose.yml (пример)

```yaml
version: "3.9"
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: dildogram
      POSTGRES_USER: dildogram
      POSTGRES_PASSWORD: dildogram
    ports: ["5432:5432"]

  redis:
    image: redis:7
    ports: ["6379:6379"]

  kafka:
    image: bitnami/kafka:3
    environment:
      KAFKA_CFG_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_CFG_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      ALLOW_PLAINTEXT_LISTENER: "yes"
    ports: ["9092:9092"]
    depends_on: [zookeeper]

  zookeeper:
    image: bitnami/zookeeper:3
    environment:
      ALLOW_ANONYMOUS_LOGIN: "yes"
    ports: ["2181:2181"]

  minio:
    image: minio/minio
    command: server /data
    environment:
      MINIO_ROOT_USER: minio
      MINIO_ROOT_PASSWORD: minio123
    ports: ["9000:9000"]

  opensearch:
    image: opensearchproject/opensearch:2
    environment:
      discovery.type: single-node
    ports: ["9200:9200"]
```

## Шаги
1. `docker compose up -d`
2. настроить сервисы и миграции
3. поднять API и WebSocket
