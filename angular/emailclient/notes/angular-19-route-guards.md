# Angular 19 Route Guards – Types and Uses

This document provides a quick reference for **Angular 19 route guards**, what they do, and when to use them.

| Guard Type        | Runs **Before** Route Match? | Runs **After** Route Match? | Prevents Module Download? | Typical Use Case |
|-------------------|-----------------------------|-----------------------------|---------------------------|------------------|
| **`canMatch`**    | ✅ Yes                       | ✅ Yes                       | ✅ Yes                    | Decide if a route should even be considered for matching (e.g., role-based access for lazy-loaded routes). Replacement for deprecated `canLoad`. |
| **`canActivate`** | ❌ No                        | ✅ Yes                       | ❌ No                     | Block navigation to a route after it matches (e.g., only allow logged-in users). |
| **`canDeactivate`** | ❌ No                     | ✅ Yes (before leaving)      | ❌ No                     | Ask for confirmation before leaving a page (e.g., unsaved form changes). |
| **`canActivateChild`** | ❌ No                  | ✅ Yes                       | ❌ No                     | Apply `canActivate` logic to all child routes of a parent route. |
| **`resolve`**     | ❌ No                        | ✅ Yes (before activation)  | ❌ No                     | Fetch and provide data to a route before it's activated (e.g., preload user details). |

---

## Notes

- **`canMatch`** (Angular 15+): Works like `canLoad`, but also runs on every navigation attempt, not just the first time.
- **`canLoad`**: Deprecated — only prevented lazy module load but didn’t re-run on subsequent navigations.
- Guards return:
  - `true` → allow navigation
  - `false` → cancel navigation
  - `UrlTree` → redirect

---

## Typical Guard Return Types

```ts
type GuardReturn = boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>;
```

---

## Recommended Usage Patterns

- **Security**: Use `canMatch` + `canActivate` together to prevent both module loading and route activation.
- **Data Preloading**: Use `resolve` for pre-fetching route data before entering the page.
- **User Experience**: Use `canDeactivate` to prevent losing unsaved work.
