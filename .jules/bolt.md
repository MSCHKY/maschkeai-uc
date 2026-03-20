
## 2024-03-21 - escapeHtml optimization
**Learning:** Moving constant map allocations out of functions avoids recreating objects on every execution, a simple but effective technique.
**Action:** Always verify if object or array declarations inside functions can be extracted to the module scope to improve performance.
