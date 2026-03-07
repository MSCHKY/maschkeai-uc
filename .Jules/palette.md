## 2024-03-07 - Add Keyboard Navigation Focus States
**Learning:** Terminal-style UIs often remove default browser focus outlines for aesthetics, but this completely breaks keyboard accessibility. We need to implement custom focus states that match the terminal aesthetic while remaining visible.
**Action:** Implemented `focus-within` on the terminal input line container to provide a clear, glowing border when the input is focused, maintaining the terminal style while improving accessibility. Added generic `focus-visible` styles for all other interactive elements.
