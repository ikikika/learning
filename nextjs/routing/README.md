## Create project

```
npx create-next-app@latest --ts
```

## File based routing

- filenames are route names
- dynamic routes indicated by square brackets [id].tsx

| Route             | Description                                 |
| ----------------- | ------------------------------------------- |
| `/`               | starting page                               |
| `/events`         | Events page (Show all events)               |
| `/events/:id`     | Event Detail Page (show selected event)     |
| `/events/...slug` | Filtered events page (show filtered events) |
