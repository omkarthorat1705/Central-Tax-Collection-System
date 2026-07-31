# API Standards

## Response Format

```json
{
  "success": true,
  "data": {},
  "message": ""
}
```

## HTTP Methods

GET

Fetch Data

POST

Create

PUT

Update

PATCH

Partial Update

DELETE

Soft Delete

---

## Folder Structure

Controller

↓

Service

↓

Repository

↓

Database

---

## Error Handling

Always

try/catch

Proper HTTP Status Codes

Consistent JSON Responses