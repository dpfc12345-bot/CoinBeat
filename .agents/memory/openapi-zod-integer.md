---
name: OpenAPI Zod integer compatibility
description: A generator compatibility constraint for numeric score fields in this workspace.
---

OpenAPI numeric score fields should use `type: number`, not `type: integer`, in this workspace.

**Why:** The installed Orval/Zod combination generates `zod.int()` for OpenAPI integers, but the installed Zod runtime does not expose that helper, causing the generated library typecheck to fail.

**How to apply:** Use `number` for score-like fields in API contracts unless integer-only validation is implemented outside this generated path.