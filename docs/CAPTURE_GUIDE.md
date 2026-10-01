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

## 06–08 — Membership approval (recordings supplied)

These three original recordings have been supplied at 1920×1040, 60 fps. They are used directly, without a resized intermediate, and muted in the composition. They show one Engineering Faculty membership moving from request to approval. Section 10 appears after deployment and before the closing narration.

### demo-06-membership-pending.mp4 — 16.8 seconds

`public/recordings/demo-06-membership-pending.mp4` shows the member requesting membership in the Engineering Faculty and seeing the resulting Pending status.

### demo-07-membership-approval.mp4 — 35.7 seconds

`public/recordings/demo-07-membership-approval.mp4` shows the Engineering Faculty administrator's member list, the same member under Pending requests, and the administrator approving the request.

### demo-08-membership-result.mp4 — 13.1 seconds

`public/recordings/demo-08-membership-result.mp4` returns to the member account. After a refresh, My memberships changes from Pending to Approved. The narration stays on this visible status change and does not claim that the recording opens the resource catalogue.

### Supplied narration and edit mapping

| Voice file | Exact text file | Visual |
|---|---|---|
| `public/audio/voice/10.1.mp3` | `voiceover-text/10.1.txt` | Request and Pending result in demo-06 |
| `public/audio/voice/10.2.mp3` | `voiceover-text/10.2.txt` | Administrator list, Approve, confirmation in demo-07 |
| `public/audio/voice/10.3.mp3` | `voiceover-text/10.3.txt` | Member refresh and Approved result in demo-08 |
| `public/audio/voice/10.4.mp3` | `voiceover-text/10.4.txt` | Animated membership record, checks, atomic status and audit update |

The full section is also preserved in `voiceover-text/10-membership-approval.txt`. Existing narration 01–09 is unchanged.

Implementation evidence: `services/resource-service/src/memberships/memberships.service.ts` (`assertDirectOrganizationAdmin`, `updateMembershipStatus`, transaction + audit + notification); `apps/web/src/components/organization-member-list.tsx` (exact labels); `apps/web/src/components/resource-catalogue.tsx` (`No approved memberships`).
