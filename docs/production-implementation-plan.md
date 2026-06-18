# Majestic CRM Production Implementation Plan

## Implemented in this upgrade

- Environment-based configuration in `application.yml`.
- Flyway migration structure under `src/main/resources/db/migration`.
- Enterprise schema foundation for tenants, branches, teams, permissions, companies, contacts, opportunities, tasks, and audit logs.
- Audit log backend API at `/api/v1/audit-logs`.
- Company API at `/api/v1/companies`.
- Contact API at `/api/v1/contacts`.
- Opportunity API at `/api/v1/opportunities`.
- Task API at `/api/v1/tasks`.
- OpenAPI/Swagger dependency.
- Actuator health/metrics dependency.
- Docker and Docker Compose starter files.
- `.gitignore` for generated files, secrets, and IDE metadata.

## Still required before production use

1. Add Maven Wrapper files or install Maven on the build machine.
2. Add unit, integration, and security tests.
3. Replace role-only authorization with permission checks.
4. Add refresh tokens, logout, password reset, account lockout, and 2FA.
5. Build frontend application.
6. Add Redis for rate limiting, cache, and token revocation.
7. Add queue system for notifications, import/export, email, and WhatsApp jobs.
8. Add file storage integration with antivirus scanning.
9. Add monitoring stack and centralized logs.
10. Add CI/CD pipeline.

## Recommended frontend structure

```text
frontend/
  src/
    app/
      routes/
      providers/
      store/
    features/
      auth/
      dashboard/
      leads/
      companies/
      contacts/
      opportunities/
      tasks/
      calendar/
      reports/
      settings/
      audit/
    shared/
      api/
      components/
      hooks/
      validation/
      utils/
```

## Required APIs by module

```text
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password

GET    /api/v1/companies
POST   /api/v1/companies
GET    /api/v1/companies/{id}
PUT    /api/v1/companies/{id}

GET    /api/v1/contacts
POST   /api/v1/contacts
GET    /api/v1/contacts/{id}
PUT    /api/v1/contacts/{id}

GET    /api/v1/opportunities
POST   /api/v1/opportunities
GET    /api/v1/opportunities/{id}
PUT    /api/v1/opportunities/{id}

GET    /api/v1/tasks
POST   /api/v1/tasks
PUT    /api/v1/tasks/{id}

GET    /api/v1/audit-logs
```

## Production readiness checkpoints

- No secrets in source code.
- All list endpoints paginated.
- All mutating endpoints audited.
- All critical endpoints covered by tests.
- All database changes handled by migrations.
- All services observable through logs, metrics, and health checks.
- All deployment environments configured through environment variables.
