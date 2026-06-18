# Majestic Realities CRM - Week 1 API/Postman

Base URL: `http://localhost:8081`

## Auth

POST `/api/auth/login`

```json
{
  "email": "admin@majesticrealities.com",
  "password": "Admin@12345"
}
```

Copy `token` from response and set header:

`Authorization: Bearer <token>`

## Users

POST `/api/users` ADMIN only

```json
{
  "fullName": "Sales Executive",
  "email": "sales@majesticrealities.com",
  "password": "Sales@12345",
  "phone": "+912222222222",
  "role": "SALES"
}
```

GET `/api/users` ADMIN/MANAGER

GET `/api/users/{id}` ADMIN/MANAGER

## Leads

GET `/api/leads/search?keyword=rahul&status=NEW&assignedToId=2&page=0&size=10&sort=createdAt,desc`

POST `/api/leads`

```json
{
  "fullName": "Rahul Mehta",
  "phone": "+919876543210",
  "email": "rahul@example.com",
  "source": "Website",
  "status": "NEW",
  "assignedToId": 2,
  "notes": "Interested in 3BHK premium apartment."
}
```

PUT `/api/leads/{id}`

```json
{
  "fullName": "Rahul Mehta",
  "phone": "+919876543210",
  "email": "rahul@example.com",
  "source": "Website",
  "status": "CONTACTED",
  "assignedToId": 2,
  "notes": "Follow-up call completed."
}
```

GET `/api/leads`

GET `/api/leads/{id}`

DELETE `/api/leads/{id}`

PUT `/api/leads/{id}/assign`

```json
{
  "assignedToId": 2
}
```

PUT `/api/leads/{id}/status`

```json
{
  "status": "CONTACTED"
}
```

## Follow-Ups

POST `/api/follow-ups`

```json
{
  "leadId": 1,
  "followUpAt": "2026-06-10T11:30:00",
  "remarks": "Call customer and confirm site visit availability."
}
```

GET `/api/follow-ups?page=0&size=10&sort=followUpAt,asc`

GET `/api/follow-ups?leadId=1&page=0&size=10`

PUT `/api/follow-ups/{id}/complete`

DELETE `/api/follow-ups/{id}`

## Dashboard

GET `/api/dashboard/admin` ADMIN only

## Companies

GET `/api/v1/companies?keyword=majestic&page=0&size=10`

POST `/api/v1/companies`

```json
{
  "name": "Majestic Realities",
  "industry": "Real Estate",
  "website": "https://example.com",
  "phone": "+911234567890",
  "email": "sales@example.com"
}
```

## Contacts

GET `/api/v1/contacts?keyword=rahul&page=0&size=10`

POST `/api/v1/contacts`

```json
{
  "companyId": 1,
  "fullName": "Rahul Mehta",
  "email": "rahul@example.com",
  "phone": "+919876543210",
  "designation": "Buyer"
}
```

## Opportunities

GET `/api/v1/opportunities?keyword=apartment&page=0&size=10`

POST `/api/v1/opportunities`

```json
{
  "companyId": 1,
  "contactId": 1,
  "title": "3BHK Premium Apartment Deal",
  "amount": 15000000,
  "stage": "NEGOTIATION",
  "probability": 70,
  "expectedCloseDate": "2026-07-31",
  "ownerId": 2
}
```

## Tasks

GET `/api/v1/tasks?page=0&size=10`

POST `/api/v1/tasks`

```json
{
  "ownerId": 2,
  "title": "Call customer for site visit",
  "description": "Confirm timing and send location.",
  "dueAt": "2026-06-20T10:30:00+05:30",
  "status": "OPEN",
  "priority": "HIGH",
  "relatedType": "Lead",
  "relatedId": 1
}
```

## Audit Logs

GET `/api/v1/audit-logs?page=0&size=20` ADMIN only

## Postman Flow

1. Login as admin.
2. Set Bearer token globally in Postman.
3. Create MANAGER/SALES users.
4. Create lead assigned to SALES user id.
5. Login as SALES user.
6. Verify SALES can see only assigned leads.

Do not test POST APIs from browser URL bar. Browser sends GET.
