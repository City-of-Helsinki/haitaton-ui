# Draw Interaction Notification System

This document describes how constraint-related notifications are produced within the `DrawInteraction` module and how to extend them safely.

## Overview

`DrawInteraction` manages OpenLayers polygon drawing and modification. User feedback for geometry constraint violations is centralized via the helper `notifyConstraint` (file: `src/common/components/map/modules/draw/notifyConstraint.ts`). This replaces previous duplicated inline `setNotification` calls.

## Current Notification Kinds

| Kind               | Trigger Context                                                                                                                                                             | Translation Label Key                            | Translation Message Key                         | Notes                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ----------------------------------------------- | ----------------------------------------------------------------------- |
| `selfIntersecting` | Incremental point causes self-intersection; draw finish attempt with intersecting edges; modify end results in self-intersection; finalized polygon found self-intersecting | `map:notifications:selfIntersectingLabel`        | `map:notifications:selfIntersectingText`        | Modification reverts geometry to original before notifying.             |
| `outsideArea`      | Segment / point would fall outside selected sub-area; legacy segment guard violation; attempting to draw while multi-area selection pending                                 | `map:notifications:drawingOutsideHankeAreaLabel` | `map:notifications:drawingOutsideHankeAreaText` | Point is rejected; drawing continues without committing invalid vertex. |

Surface area below threshold (< 1 m²) blocks finishing silently to preserve legacy user experience (no notification).

## Helper Signature

```
notifyConstraint(setNotification, t, kind, opts?)
```

Parameters:

- `setNotification(open, options)` from `GlobalNotificationContext`.
- `t`: i18n translation function.
- `kind`: `'selfIntersecting' | 'outsideArea'`.
- `opts` (optional): `{ autoCloseDuration?, labelKeyOverride?, messageKeyOverride?, typeOverride? }`.

Default notification behavior:

- Position: top-right
- Dismissible, autoClose = true, autoCloseDuration = 5000 ms
- Type: `alert`
- Close button label translation key: `common:components:notification:closeButtonLabelText`

## Example Usage

Inside drawing change handler:

```ts
const showConstraintNotification = (kind: 'selfIntersecting' | 'outsideArea') =>
  notifyConstraint(setNotification, t, kind);

if (selfIntersectionDetected(ring)) {
  lastCoordinateCount.current = rejectLastPoint(
    drawInstance,
    'selfIntersecting',
    showConstraintNotification,
    pointCount,
  );
  return;
}
```

On modification end:

```ts
if (isPolygonSelfIntersecting(modifiedPolygon)) {
  modifiedPolygon.setCoordinates(originalGeometry.getCoordinates());
  notifyConstraint(setNotification, t, 'selfIntersecting');
}
```

## Extending with a New Kind

1. Add a new union member (e.g. `'tooSmall'`) to `ConstraintNotificationKind`.
2. Add label & message translation keys to `LABEL_KEYS` and `MESSAGE_KEYS` maps in `notifyConstraint.ts`.
3. Use the new kind where appropriate. For silent conditions prefer leaving notification absence documented.
4. Update this document table & add tests in `notifyConstraint.test.ts`.

## Edge Cases & Design Decisions

- Multi-area selection: drawing is blocked until user confirms a sub-area; attempts to add further points produce `outsideArea` notifications.
- Legacy guard integration: If `allowLegacyDrawSegmentGuard` is true, guard failure after area containment reuses `outsideArea` notification.
- Self-intersection during drawing vs finalize: incremental failures reject only the latest point; finalize failure (on `drawend`) notifies but does not alter geometry beyond OpenLayers default closure.
- Modify revert: On self-intersection after vertex drag, geometry reverts entirely to its original coordinates then notifies.
- Performance: Notification display is debounced implicitly by point rejection logic (a rejected point will not immediately retrigger until user adds another). No explicit rate limiting currently required.

## Testing Strategy

- Unit tests: Validate helper outputs correct translation keys and options for each kind and override scenario (`notifyConstraint.test.ts`).
- Potential integration tests: Simulate interactions to assert that constraint violation leads to a notification without persisting invalid point. (Requires OL event mocking.)

## Future Improvements

- Introduce optional telemetry hook for constraint violations.
- Provide accessibility audit ensuring focus management for frequent alerts.
- Consider adding a non-intrusive toast for surface-too-small if user confusion reported.

## Quick Reference

```ts
notifyConstraint(setNotification, t, 'outsideArea');
notifyConstraint(setNotification, t, 'selfIntersecting', { autoCloseDuration: 8000 });
```

---

Last updated: 2025-10-10.
