# ResourceHive video production

<!-- impeccable:product-schema 1 -->

## Platform

Remotion video, 1920×1080 at 30 fps. This is an academic implementation explainer assembled from the actual web application and supplied narration.

## Product truth

ResourceHive is a university resource-sharing application. Members discover resources, inspect published slots, and make reservations. Four NestJS microservices own Identity, Resource, Booking, and Notification. Points belongs to Booking. Caddy routes requests independently. PostgreSQL is external on Neon; Kafka is external on Aiven. Caddy and four service containers share a Linode VM; the frontend runs on Vercel.

## Confirmed constraints

The user's October 1 revision directs the motion design: actual ResourceHive typography, accurate topology, readable YouTube-style subtitles, animated diagrams and meaningful highlights, original recording quality, 1080p H.264 without a file-size target. No music or sound effects in this draft. Existing narration is preserved. One new feature is planned with capture and narration requests; new media must not be fabricated.

## Evidence

Original recordings and nine narration files in public/. Product implementation in ../resourcehive; source files are cited in docs/IMPLEMENTATION_AUDIT.md. User screenshots are anti-references for typography, overlaps and static slide treatment. The supplied subtitle screenshot is the caption reference.
