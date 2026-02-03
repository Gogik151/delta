# Примеры кода (псевдо)

## Отправка сообщения (Go)

```go
func SendMessage(ctx context.Context, chatID, userID, content string) (*Message, error) {
  msg := &Message{ChatID: chatID, SenderID: userID, Content: content}
  if err := repo.SaveMessage(ctx, msg); err != nil {
    return nil, err
  }
  events.Publish("message.created", msg)
  return msg, nil
}
```

## WebSocket подписка (TypeScript)

```ts
const ws = new WebSocket("wss://api.dildogram.io/ws");
ws.onmessage = (event) => {
  const payload = JSON.parse(event.data);
  if (payload.type === "message.created") {
    store.addMessage(payload.message);
  }
};
```

## Секретный чат (упрощённо)

```ts
const key = await deriveKey(sharedSecret);
const encrypted = await encryptAESGCM(key, message);
```
