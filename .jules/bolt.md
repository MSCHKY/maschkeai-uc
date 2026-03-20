
## 2026-03-20 - DOM Reflow Optimization
**Learning:** Calling `scrollToBottom()` which triggers `scrollHeight` calculation inside a loop inserting DOM elements causes severe synchronous DOM reflows. Batching the inserts via a `DocumentFragment` and calling `scrollToBottom()` once significantly improves performance (e.g., 1.4x speedup).
**Action:** When adding multiple elements to the DOM at once, use a `DocumentFragment` or append them in an array before updating the scroll position or requesting element layout metrics.
