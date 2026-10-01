# Implementation audit

Source inspected: `C:/Users/malindu/repos/resourcehive`, working tree on 2026-10-01. This document records code evidence, not proof that production services are presently healthy. The application repository has uncommitted work; recheck these references before final narration is locked.

| Finding | Status | Evidence |
| --- | --- | --- |
| Next.js dashboard has resources, organizations, memberships, bookings, disputes, analytics, notifications and account routes | Implemented | `apps/web/src/app/dashboard/**/page.tsx`, `apps/web/src/components/app-sidebar.tsx` |
| Member can browse a resource, open a booking dialog, select a future published slot, and see a confirmation | Implemented | `apps/web/src/components/resource-details.tsx`, `resource-booking-dialog.tsx`, `booking-confirmation.tsx` |
| Booking uses authenticated `POST /bookings` with a slot ID | Implemented | `apps/web/src/lib/booking-service/booking-api.ts`, `services/booking-service/src/bookings/bookings.controller.ts` |
| Server validates tenant membership, resource access, active resource, future unbooked slot and points | Implemented | `services/booking-service/src/bookings/booking.service.ts`, `authorization/booking-authorization.service.ts`, `slots/slot.repository.ts` |
| Booking and points deduction are committed in one serializable Prisma transaction; concurrent slot use is constrained | Implemented | `booking.service.ts` (`createBooking`, `createWithinTransaction`), `db/schema/migrations/20260724000000_initial/migration.sql` (`bookings_active_slot_unique`), `services/booking-service/test/concurrency/booking-creation.concurrency-spec.ts` |
| Points are part of Booking Service, not a fifth service | Implemented | `services/booking-service/src/points/`, `docker-compose.prod.yml` |
| Booking confirmation triggers notification publishing after the transaction | Implemented | `services/booking-service/src/notifications/booking-notification.service.ts`, `packages/notification-client/src/` |
| Notification Service handles booking events and emits Socket.IO updates | Implemented | `services/notification-service/src/events/booking-event.service.ts`, `realtime/realtime.gateway.ts`; client: `apps/web/src/hooks/use-booking-realtime.ts` |
| Four NestJS services sit behind a Caddy API gateway on one Linode VM | Configured | `README.md`, `docker-compose.prod.yml`, `services/api-gateway/Caddyfile`, `deploy/linode/README.md` |
| Frontend on Vercel; database on Neon; Kafka on Aiven; Firebase for push | Configured | `README.md`, `docker-compose.prod.yml`, `apps/web/src/app/layout.tsx`; describe as configured deployment, not independently observed runtime |
| GitHub Actions publishes four GHCR images, runs migration container and updates Linode | Configured | `.github/workflows/deploy.yml` |
| Static screenshot capture can run unattended in this environment | Not established | App requires running services, tenant data and authentication. No screenshot is represented as captured. |

## Chosen story

Follow one member from resource catalogue to a booking confirmation, then trace that same `POST /bookings` through Caddy, Booking Service, Prisma and PostgreSQL. Show notification delivery as an asynchronous follow-on. Briefly show organization administration and bookings as secondary features.

## Accuracy notes

- PostgreSQL is configured on Neon, outside the Linode VM.
- Kafka is configured on Aiven, outside the Linode VM.
- A booking notification is attempted after the database transaction. Do not imply that notification delivery is part of the atomic booking transaction.
- Realtime event handling exists, but network conditions and user permissions affect what a specific recording shows.
- The demo seed creates a user and organization; it does not by itself guarantee an attractive bookable resource and future slot. Arrange these before capture.
