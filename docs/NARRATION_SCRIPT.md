# Narration script

Read the numbered paragraphs as separate ElevenLabs files. The words below are the authoritative voiceover text. The scene durations in the storyboard are provisional.

## 01 — Intro

ResourceHive is a platform for university communities to share resources. In this video, I will show a member booking a resource, then follow that same action through the code and deployment behind it.

## 02 — Problem

A department or club may own equipment, rooms, or other useful items, while students elsewhere do not know what is available or who can use it. Availability also changes. A simple list is not enough when two people can try to reserve the same time. ResourceHive brings discovery, access rules, published time slots, and bookings into one workflow.

## 03 — Overview

The dashboard gives members a resource catalogue, organization information, their bookings, and notifications. Administrators can manage resources and review bookings for the organizations they administer. I will focus on one small task that connects the interface to the implementation: reserving a published slot.

## 04 — Product workflow

Here is the resource catalogue. A member can browse the items shared with their organization and open a resource for more detail. The detail page identifies its owner, shows its booking cost in points, and explains that access, availability, and balance will be checked before a reservation is confirmed.

I open Create booking. The dialog loads future published slots for this specific resource. These times are displayed in the viewer's local timezone. I choose one available time and confirm. The interface sends the selected slot identifier to the booking API; it does not decide on its own whether the slot is safe to reserve.

The confirmation gives a booking reference, the scheduled time, and any points deducted. There is also a receipt download action. From the Bookings page, the member can review upcoming and past reservations and keep the reference available. This is the complete user action we will now trace behind the screen.

The application also has organization membership, notifications, disputes, and analytics views. They are useful context, but this booking gives us a clearer way to explain how the pieces work together.

## 05 — Bridge

So that is what the member sees. But what has to happen between clicking Confirm and showing this result? The important thing is that the booking service, rather than the browser, makes the final decision about access, slot availability, and points.

## 06 — Architecture

The interface is a Next.js application. The backend is split into four NestJS services: Identity, Resource, Booking, and Notification. There is no separate Points service in this repository. Points logic lives in Booking Service.

Public API requests first meet Caddy, which routes each path to the appropriate private service. Identity handles accounts and authentication. Resource handles organizations, memberships, and the resource catalogue. Booking owns slots, reservations, points, disputes, and analytics. Notification processes messages and realtime events.

The services use Prisma with PostgreSQL. The configured production database is hosted by Neon. Kafka, configured through Aiven, carries notification related events. This diagram shows logical responsibilities and the actual configured connections; the four service boxes do not mean four separate machines.

## 07 — Booking request

Now follow the selected slot. The browser posts it to the bookings endpoint. Caddy sends that path to Booking Service, where a guard requires an authenticated user.

The service checks the member's tenant context, finds the slot, and checks that its resource is active and accessible. It rejects a slot that has already started or has an existing booking. If the resource has a point cost, it also checks the member's balance.

The booking record and any point deduction are written within one serializable database transaction. That means the reservation and its point entry succeed together or fail together. The database also has a constraint allowing only one active booking per slot. A concurrency test sends two requests for the same slot and expects exactly one to succeed.

After the transaction commits, Booking Service attempts to publish booking notifications. Notification Service can turn the booking event into an in-app or push notification and emit a realtime update. This part is separate from the atomic database write, so we should not describe notification delivery as part of the booking transaction.

## 08 — Deployment

In the configured production setup, the Next.js frontend is on Vercel. Caddy and the four backend services run as containers on one Linode virtual machine. Only Caddy exposes the public backend ports; it forwards traffic to the services on the private Docker network. PostgreSQL is hosted separately on Neon, and Kafka is managed separately on Aiven.

The deployment workflow builds four service images, publishes them to GitHub Container Registry, runs Prisma migrations, and updates the containers on Linode. The services are separated in code and containers, while the current deployment keeps them together on one VM.

## 10.1 — Membership request

Booking is one part of sharing a resource. The other is deciding who belongs to the organization that owns it.

First, from the member's account, I request membership in the Engineering Faculty. After I submit the request, its status shows as Pending. The request is now waiting for an administrator to review it.

## 10.2 — Administrator review

Next, I switch to the Engineering Faculty administrator's member list. The same member appears under Pending requests. I choose Approve and confirm the decision.

## 10.3 — Member result

Finally, I return to the member's account and refresh My memberships. The Engineering Faculty status changes from Pending to Approved. We have now seen the complete membership flow: the member requests access, the administrator approves it, and the member sees the updated result.

## 10.4 — Membership record

The screen actions map to one membership record. The request starts as Pending for this member and the Engineering Faculty. Before changing it to Approved, Resource Service checks that the administrator has permission to review this organization's requests and that this request is still eligible.

The approval and its audit record are saved together. When the member refreshes, the application reads the new status from that same membership. One record carries the request from the member, through the administrator's decision, to the Approved result.

## 12.1 — Resource creation

Beyond member bookings and organization approvals, ResourceHive provides dedicated operational tools for administrators and community managers.

First, creating and publishing a resource. An administrator configures the item, uploads details, and defines availability rules, booking capacity, and points cost before publishing future reservation slots to the catalogue.

## 12.2 — Analytics

Next, the analytics dashboard gives organizations visibility into community usage. It tracks reservation volume, active members, high-demand equipment, and point velocity over time.

## 12.3 — Disputes

When disagreements arise, such as scheduling conflicts or return condition issues, users can open a dispute. A member selects the affected reservation, explains the problem, and submits the claim with relevant details directly from their account.

## 12.4 — Notifications

Finally, the notification center keeps everyone aligned in real time. In-app alerts and push updates announce booking confirmations, membership decisions, and dispute resolutions as soon as they happen.

## 09 — Close

ResourceHive connects a practical member workflow to explicit backend rules. A user sees a straightforward reservation, while the implementation checks organization access, prevents competing bookings, records points consistently, and sends updates through a separate notification path. That is the central design of the project: make shared resources easier to use, with booking rules enforced where they matter.

After the spoken closing line, hold the ResourceHive mark with the visual text “Thank you for watching.” for four seconds. This text has no narration.

