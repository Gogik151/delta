# API документация (черновик)

## Auth

### POST /v1/auth/send-code
Отправить код подтверждения.

**Request**
```json
{ "phone": "+79990001122" }
```

**Response**
```json
{ "status": "ok", "request_id": "abc123" }
```

### POST /v1/auth/verify
Подтвердить код.

**Request**
```json
{ "request_id": "abc123", "code": "12345" }
```

**Response**
```json
{ "token": "jwt", "refresh_token": "jwt" }
```

## Users

### GET /v1/users/me
**Response**
```json
{
  "id": "u1",
  "name": "Alice",
  "username": "alice",
  "phone": "+79990001122"
}
```

## Chats

### POST /v1/chats
Создать чат.

**Request**
```json
{ "type": "group", "title": "Dev Team" }
```

**Response**
```json
{ "id": "c1", "title": "Dev Team" }
```

## Messages

### POST /v1/messages
**Request**
```json
{
  "chat_id": "c1",
  "content": "Hello",
  "type": "text"
}
```

**Response**
```json
{ "id": "m1", "status": "sent" }
```

## Bots

### POST /v1/bots
**Request**
```json
{ "name": "echo", "callback_url": "https://bot.example.com" }
```

**Response**
```json
{ "id": "b1", "token": "bot_token" }
```

## Calls

### POST /v1/calls/start
**Request**
```json
{ "chat_id": "c1", "type": "video" }
```

**Response**
```json
{ "call_id": "call123", "webrtc_offer": "..." }
```
