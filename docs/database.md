# База данных (ER-диаграмма и таблицы)

## ER (Mermaid)

```mermaid
erDiagram
  USERS ||--o{ SESSIONS : has
  USERS ||--o{ CHATS : owns
  USERS ||--o{ MESSAGES : sends
  CHATS ||--o{ MESSAGES : contains
  CHATS ||--o{ CHAT_MEMBERS : has
  USERS ||--o{ CHAT_MEMBERS : joins
  MESSAGES ||--o{ REACTIONS : has
  USERS ||--o{ REACTIONS : reacts

  USERS {
    uuid id PK
    string phone
    string username
    string name
    string password_hash
    timestamp created_at
  }

  SESSIONS {
    uuid id PK
    uuid user_id FK
    string device
    timestamp last_seen
  }

  CHATS {
    uuid id PK
    string type
    string title
    uuid owner_id FK
    timestamp created_at
  }

  CHAT_MEMBERS {
    uuid chat_id FK
    uuid user_id FK
    string role
    timestamp joined_at
  }

  MESSAGES {
    uuid id PK
    uuid chat_id FK
    uuid sender_id FK
    string type
    text content
    timestamp created_at
  }

  REACTIONS {
    uuid id PK
    uuid message_id FK
    uuid user_id FK
    string emoji
  }
```

## Основные таблицы

- **users** — учётные записи
- **sessions** — активные устройства
- **chats** — чаты/каналы
- **chat_members** — участники
- **messages** — сообщения
- **reactions** — реакции

## Индексы

- `messages (chat_id, created_at)`
- `chat_members (chat_id, user_id)`
- `users (phone, username)`
