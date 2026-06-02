# Auth & FSD Audit — Quiz App Client

**Scope:** Login/register flow, session handling, routing guards, and Feature-Sliced Design alignment.  
**Date:** 2026-06-01

---

## Executive summary

The project has a sensible starting point: shared UI, a reusable `AuthForm` feature, OpenAPI-generated client, Zustand session state, and a split between public/private routes. Several issues are **blocking correct auth behavior** (token storage key mismatch), and the FSD layout is only **partially** applied—auth domain logic is spread across `pages`, `features`, and `shared` without clear boundaries.

**Priority:** Fix the token key bug first, then routing for unauthenticated users, then restructure auth into proper FSD slices.

---

## What works well

| Area | Notes |
|------|--------|
| **Shared `AuthForm`** | Single form for login/register with Yup + react-hook-form; good DRY choice. |
| **OpenAPI client** | Typed API in `shared/api/generated`; pages stay thin for HTTP calls. |
| **Path aliases** | `@shared`, `@features`, `@pages` keep imports readable. |
| **Lazy routes** | Code-splitting per page in `app/router/routes.ts`. |
| **Refresh interceptor** | 401 → refresh → retry pattern is the right direction (needs polish). |
| **`withCredentials: true`** | Aligns with cookie-based refresh on the server. |

---

## Critical bugs (fix immediately)

### 1. Access token localStorage key mismatch

`AuthForm` saves the token under `ACCESS_TOKEN_KEY` (`"access_token"`):

```72:72:src/features/auth/AuthForm/AuthForm.tsx
			localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
```

The Axios interceptor reads and writes **`"token"`** (hardcoded, not the constant):

```13:17:src/shared/api/index.ts
	const token = localStorage.getItem("token");

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
```

**Effect:** After login/register, `Authorization` is never sent; `userMeGet` and protected APIs fail unless the backend relies only on cookies.

**Fix:** Use `ACCESS_TOKEN_KEY` everywhere (request interceptor, refresh handler, logout). Remove the `"token"` string.

---

### 2. Wrong Axios error status check

```78:78:src/features/auth/AuthForm/AuthForm.tsx
			if (err instanceof AxiosError && err.status < 500) {
```

`AxiosError` has no reliable top-level `status`. Use `err.response?.status` (e.g. treat 4xx as user-facing errors, 5xx/network as generic).

---

### 3. Register may send `repeatPassword` to the API

`RegisterPage` passes the full form object:

```9:10:src/pages/Register/RegisterPage.tsx
	const callback = async (data: UserLoginRequestBody) => {
		const response = await api.authRegisterPost(data);
```

The form type includes `repeatPassword`, but `UserLoginRequestBody` does not. TypeScript may not catch excess fields at runtime—strip to `{ email, password }` like `LoginPage` does.

---

### 4. Unauthenticated visit to `/` renders nothing

`Router` only mounts **private** routes when `isAuthed` is true. Public routes are `login`, `register`, and `*`. There is no public route for `/`, so a logged-out user on `/` gets an empty `<Routes>` (no redirect to login).

**Fix:** Add a redirect route (e.g. `/` → `/login` when guest) or a dedicated `GuestOnly` / `ProtectedRoute` wrapper.

---

### 5. Authenticated users can still open `/login` and `/register`

Public routes are always registered. After login, users should be redirected away from auth pages (e.g. to `/`).

---

## Routing & session lifecycle

| Gap | Recommendation |
|-----|----------------|
| No logout flow | Wire `api.authLogoutPost`, clear `ACCESS_TOKEN_KEY`, `clearUser()`, navigate to `/login`. |
| `clearUser` unused | Call on logout and on failed refresh / 401 after retry. |
| `useGetAuthedUser` silent failure | On 401, clear token and user; optionally surface “session expired”. |
| Missing `setUser` in effect deps | Add to `useEffect` deps or document intentional omission; stale closure risk is low here but ESLint will complain. |
| Loading UX | Router renders nothing while `isLoading`; use a global loader in `app` layer. |
| Refresh uses raw `axios.post` | Prefer `api.authRefreshPost()` for consistency; still update storage with `ACCESS_TOKEN_KEY`. |

---

## FSD compliance review

FSD layers (bottom → top): **shared → entities → features → widgets → pages → app**. Imports must only go downward.

### Current layout (auth-related)

```
src/
  app/          router, App
  pages/        Login, Register, Main
  features/     auth/AuthForm
  shared/       api, store, hooks, ui, constant
```

Missing: **`entities`**, **`widgets`**, and often **`@app`** alias. No `features/auth/model`, `api`, or `ui` segments.

### Violations & smells

1. **Auth session in `shared/store`**  
   User/session is domain state, not generic infrastructure. Prefer `entities/user/model` (or `features/auth/model` if you treat auth as one feature).

2. **`useGetAuthedUser` in `shared/hooks`**  
   Auth-specific bootstrap belongs in `features/auth` or `entities/user`, not shared.

3. **Pages own API orchestration**  
   `LoginPage` / `RegisterPage` call `api.authLoginPost` / `authRegisterPost` directly. In FSD, pages compose features; features (or entities) own use-cases:

   - `features/auth/login` → `useLogin` + UI hook-up  
   - `features/auth/register` → `useRegister`  
   - Page: layout + links + `<AuthForm />` with injected handlers from feature model

4. **`AuthForm` does too much for a “dumb” UI slice**  
   It handles token persistence, Zustand `setUser`, and `navigate("/")`. That’s **model/controller** work. Split:
   - **UI:** form fields, validation display, submit button  
   - **Model:** `login`, `register` thunks/hooks that return user + token; caller or feature wires navigation

5. **No Public API per slice**  
   `features/auth/index.ts` only re-exports `AuthForm`. Expose only what other layers need (`AuthForm`, types, maybe `useLogin`).

6. **`app` layer thin but correct**  
   Router in `app` is fine; add providers here (theme, error boundary, auth initializer) instead of side effects inside router.

### Suggested target structure (auth)

```
src/
  entities/
    user/
      model/
        store.ts          # useAuthedUser (or useUser)
        types.ts
      index.ts            # public API
  features/
    auth/
      ui/
        AuthForm/
      model/
        useLogin.ts
        useRegister.ts
        useSessionBootstrap.ts   # ex useGetAuthedUser
        validation.ts
      index.ts
  pages/
    login/
      ui/LoginPage.tsx
    register/
      ui/RegisterPage.tsx
  app/
    providers/
    router/
      ProtectedRoute.tsx
      GuestRoute.tsx
  shared/
    api/
    ui/
    lib/
```

### Import rules checklist

- [ ] `pages` → `features`, `entities`, `shared`, `widgets` — not other `pages`
- [ ] `features` → `entities`, `shared` — not `pages` or other features (use composition on page)
- [ ] `entities` → `shared` only
- [ ] `shared` → no imports from upper layers

Today: `features/auth` imports `@shared/store` and router — acceptable short-term; moving store to `entities/user` improves clarity.

---

## Security notes

| Topic | Current | Advice |
|-------|---------|--------|
| Access token storage | `localStorage` | Vulnerable to XSS. If refresh is httpOnly cookie, consider access token in memory only + refresh on load, or short-lived access token with strict CSP. |
| Mixed cookie + localStorage | Yes | Document the contract: refresh in cookie, access in storage (or unify). |
| Password field | `autoComplete="none"` | Prefer `current-password` / `new-password` for UX and password managers. |
| HTTPS | Env `VITE_API_URL` | Enforce HTTPS in production builds. |

---

## Code quality & typing

- **`TAuthFormProps.callback`:** `(...args: unknown[])` is too loose. Prefer `(data: UserLoginRequestBody) => Promise<UserAuthResponse>`.
- **`GetUserResponse` vs `UserAuthResponseUser`:** Both are `{ email }` today; session bootstrap sets user from `userMeGet` while login sets from `UserAuthResponse.user`—fine now, but unify a single `User` type in `entities/user`.
- **`repeatPassword` default:** `null` vs optional `string`—use `""` or `undefined` for react-hook-form consistency.
- **Tests:** No auth tests found—add at least model/hook tests for login error mapping and token persistence key.

---

## Recommended action plan (ordered)

1. **Unify token key** — `ACCESS_TOKEN_KEY` in `shared/api/index.ts` (request + refresh + logout).
2. **Fix `AxiosError` handling** — `err.response?.status`.
3. **Strip register payload** — only `email` + `password`.
4. **Routing** — `ProtectedRoute`, guest redirect from `/`, block `/login` when authed.
5. **Logout** — feature hook + clear storage/store.
6. **FSD refactor (incremental)** — move store → `entities/user`, hooks → `features/auth/model`, thin pages.
7. **Split `AuthForm`** — UI vs side effects (token, navigate, setUser).
8. **ESLint boundary rule** — e.g. `@feature-sliced/eslint-config` or custom import restrictions.

---

## Summary scorecard

| Criterion | Score | Comment |
|-----------|-------|---------|
| Login/register UX | Good | Shared form, validation, loading state |
| API integration | Good | Generated client, interceptors |
| Session persistence | **Broken** | Token key mismatch |
| Route protection | Partial | Split public/private but missing redirects |
| FSD structure | Partial | Layers started; domain logic misplaced |
| Security hygiene | Fair | Cookies + localStorage; no logout |

Overall: **fix storage/interceptor consistency and routing**, then refactor toward `entities/user` + `features/auth/model` for a maintainable FSD auth module.
