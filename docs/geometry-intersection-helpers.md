## Geometry & Intersection Helper Guide

This document describes the geometry helper functions in `src/common/components/map/utils.ts` that support polygon drawing validation. The goals of the helpers are:

- Prevent self-intersecting polygons during interactive drawing (incremental validation + final closure validation).
- Provide composable primitives for future geometry rules (e.g. snapping, hole creation checks, area boundary constraints).
- Keep draw interaction logic lightweight by delegating geometric reasoning to tested utilities.

### Design Principles

1. Single Responsibility: Each helper performs one narrow task (conversion, classification, validation).
2. Data Shape Clarity: Use tuples of `[number, number]` for numeric endpoints; OpenLayers `Coordinate` only at API boundaries.
3. Early Exit: Validation functions stop as soon as an invalid intersection is found.
4. Endpoint Tolerance: Shared endpoints are not treated as interior intersections; supports continuous drawing without false positives.
5. Incremental vs Closed Separation: Different logic paths for the segment being drawn vs a fully closed polygon.

### Helper Overview

| Helper                                                                         | Responsibility                                                                         | When to Extend                                                                   |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `numericEdge(edge)`                                                            | Converts an edge `[Coordinate, Coordinate]` to numeric endpoints `[[x1,y1],[x2,y2]]`.  | If coordinates gain Z/M dimensions—update conversion logic.                      |
| `isIntersectionAtAnyEndpoint(intersection,endpoints)`                          | Returns true if intersection matches any endpoint exactly.                             | If fuzzy matching needed—wrap with tolerance comparison.                         |
| `getLineIntersection(aStart,aEnd,bStart,bEnd)`                                 | Returns intersection point or `null` for two segments (exclusive of colinear overlap). | If colinear overlapping segments must be flagged—add explicit overlap detection. |
| `hasInvalidInteriorIntersection(aStart,aEnd,bStart,bEnd,allowSharedEndpoints)` | Classifies whether segments cross in their interiors.                                  | If near-endpoint tolerance required—adjust logic prior to endpoint test.         |
| `getCandidateSegmentForValidation(coordinates,lines)`                          | Determines current segment for validation and whether polygon is closed.               | If supporting multi-ring polygons—extend to handle additional rings.             |
| `validateClosedPolygon(lines)`                                                 | Scans all non-adjacent edge pairs for interior intersections after closure.            | Optimize with spatial index (sweep line or R-tree) for very large polygons.      |
| `validateIncrementalSegment(lines,segStart,segEnd)`                            | Checks the latest segment against all prior non-adjacent edges.                        | Same spatial optimization opportunities as above.                                |
| `areLinesInPolygonIntersecting(coordinates)`                                   | Orchestrates segment selection and calls appropriate validator.                        | Extend if adding hole support or multi-ring logic.                               |
| `isPolygonSelfIntersectingByCoordinates(coordinates)`                          | Fallback heavy check using Turf `kinks` for already constructed polygons.              | Replace or augment if performance becomes an issue.                              |
| `isSegmentWithinHankeArea(map,latestLine,hankeLayerFilter)`                    | Ensures a segment lies entirely within a boundary polygon (allows endpoint touches).   | Extend for multi-layer union or handling holes/exclusions.                       |

### Extension Pattern

When adding new geometric rules (e.g. min edge length, non-convex warning, hole containment):

1. Identify Stage: Is rule incremental (per new segment) or post-closure? Add parallel validator if needed (e.g. `validateIncrementalMinEdge`).
2. Reuse Primitives: Prefer composing `numericEdge`, `getLineIntersection`, and endpoint classification instead of duplicating math.
3. Integrate Orchestrator: Update `areLinesInPolygonIntersecting` only if the rule affects intersection validity; otherwise keep a separate orchestrator for non-intersection constraints to avoid bloating responsibility.
4. Testing First: Create focused unit tests for the new helper (happy path + 1–2 edge cases) before wiring it into draw interaction.
5. Performance Guard: For any O(n^2) scan added, document expected typical vertex counts; consider short-circuit conditions (e.g. bail if polygon < required vertices for rule relevance).

### Example: Adding Minimum Edge Length Validation

1. Create `isEdgeTooShort(start:[number,number], end:[number,number], min:number)`.
2. Add unit tests (short edge, acceptable edge, borderline value).
3. In draw interaction, after segment creation but before acceptance, call the helper.
4. If failing, block finish or point addition similar to current intersection pattern.
5. Keep intersection logic unchanged; do not merge unrelated rules into `areLinesInPolygonIntersecting`.

### Testing Strategy

- Unit Tests: Each helper has isolated tests in `utils.test.ts`. Add new blocks grouped by helper name.
- Scenario Tests: Higher-level draw interaction tests simulate user inputs (valid polygon, bow-tie rejection, etc.).
- Regression Safety: When refactoring, run full suite to ensure interplay between helpers remains stable.

### Performance Notes

- Current approach is O(n^2) for closed polygon validation and O(n) per incremental segment—acceptable for typical user-driven vertex counts (usually < 100).
- If high vertex counts emerge, introduce spatial partitioning (sweep line, segment tree, or R-tree) behind `validateClosedPolygon` / `validateIncrementalSegment` without changing their external contract.
- Avoid premature optimization: keep code readable; optimize only with evidence (profiling + test case stress).

### Error Handling

- Turf failure in `isPolygonSelfIntersectingByCoordinates` logs a warning and treats geometry as non-intersecting to preserve UX flow.
- Helpers themselves avoid throwing; they return booleans or `null` for graceful composition.

### Adding New Helpers Checklist

1. Define clear input/output types (tuple endpoints preferred).
2. Write unit tests before integration.
3. Update docs table with responsibility + extension notes.
4. Ensure no duplication of existing numeric conversion or intersection logic.
5. Run lint + tests.

### Future Opportunities

- Introduce fuzzy endpoint matching wrapper for high DPI or projection rounding variations.
- Add convexity check helper for optional warnings (not a blocking rule).
- Provide geometry debug overlay (visualize candidate segment, intersections) in dev mode.

### Quick Reference (Function Contracts)

- `numericEdge(edge)` => `[[x1,y1],[x2,y2]]`
- `getLineIntersection(aStart,aEnd,bStart,bEnd)` => `[x,y] | null`
- `hasInvalidInteriorIntersection(aStart,aEnd,bStart,bEnd,allowSharedEndpoints)` => `boolean`
- `getCandidateSegmentForValidation(coordinates,lines)` => `{ segment:[[x1,y1],[x2,y2]], isClosed:boolean, latestIndex:number }`
- `areLinesInPolygonIntersecting(coordinates)` => `boolean`
- `isSegmentWithinHankeArea(map,latestLine,filter)` => `boolean`

Maintain this document as geometry logic evolves; concise accuracy beats exhaustive detail—remove outdated sections proactively.
