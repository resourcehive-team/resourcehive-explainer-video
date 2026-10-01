# Capture guide

Record the **real running application** at 1920×1080, 30 fps, 16:9, one consistent browser zoom, visible cursor, no microphone/system audio, no personal tabs or notifications. Keep 2 seconds still before and after each action. Use one approved member account, one organization, and one named resource across all clips. Do not show credentials. Ensure the resource has a future published slot and enough member points before recording; a zero-cost resource is acceptable, but narration about a visible deduction must then be omitted during final edit.

If the demo seed is used, its default member is `demo@example.edu` in `Demo Organization` (`services/identity-service/scripts/seed-demo.ts`). The seed alone does not provide a reliable future slot. Pick a clean, non-sensitive resource name such as **Media Room A** and use it consistently. Never reset a real user database merely for filming.

## 01 — Catalogue

- File: `public/recordings/demo-01-catalogue.mp4` (15–25 s).
- Start: signed in as an approved member at `/dashboard/resources`, catalogue fully loaded.
- Action: hold still; move deliberately to the chosen resource card; open it; pause on the loaded detail page.
- Show: resource name and catalogue context. Avoid unrelated cards with private data.

## 02 — Resource detail

- File: `public/recordings/demo-02-resource-detail.mp4` (12–20 s).
- Start: chosen resource detail page, top of page visible, no dialog open.
- Action: hold 2 s; briefly scroll enough to show owner and point cost; return to the Create booking button; hold 2 s.
- Show: same resource as clip 01.

## 03 — Booking and confirmation

- File: `public/recordings/demo-03-booking.mp4` (20–35 s).
- Start: chosen resource detail page; member has access and sufficient balance; at least one future published slot exists.
- Action: click **Create booking**; wait until available slots finish loading; select one; click the dialog's confirmation button once; wait for **Booking confirmed**; hold the complete confirmation and booking reference for 3 s.
- Important: record a successful reservation only once. Do not select a past or previously booked slot. Make sure the selected date/time and resource name remain consistent with clip 04.

## 04 — Bookings result

- File: `public/recordings/demo-04-bookings.mp4` (12–20 s).
- Start: same member account after clip 03.
- Action: open **Bookings** from sidebar; wait for the list; point at the new booking; hold 3 s. No cancellation.
- Show: the same resource and scheduled slot as clip 03.

## 05 — Secondary features

- File: `public/recordings/demo-05-admin-montage.mp4` (15–25 s).
- Start: an account with actual admin access, with non-sensitive demonstration data.
- Action: show the organization or resource management screen, then an admin bookings view. Pause 2 s on each.
- This clip is optional if admin access is unavailable; the corresponding visual will be a clearly labeled code-drawn feature list rather than fake UI.

After capture, place the files at the exact paths above and send a message. The final timing and captions will be rebuilt from the supplied media.
