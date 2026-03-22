
## 2024-03-22 - O(N^2) Typewriter Bottleneck
**Learning:** Appending characters to `div.textContent` inside a loop forces a DOM read (re-serialization) followed by a DOM write (reflow computation), leading to an $O(N^2)$ operation when building a string character-by-character.
**Action:** Use a local Javascript string buffer (`let currentText = ''`) to accumulate the text string, and only write to the `.textContent` property setter to avoid expensive DOM reads.
