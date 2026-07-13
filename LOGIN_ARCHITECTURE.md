# Authentication Module Architecture

A production-ready authentication module built with React.js, React Router DOM, Context API, the Fetch API, and Emotion (CSS-in-JS). This document describes how it is structured, how data flows through it, and how to extend it.

---

## Folder Structure

```text
src/
│
├── assets/
│   ├── logos/                     # gfl.png, gfcl.png, inoxgfl.png
│   ├── images/
│   └── icons/                     # user-lock.png
│
├── components/
│   └── common/                     # Shared, reusable, page-agnostic components
│       ├── Header/
│       │   └── Header.jsx          # App header: logo, greeting, logout
│       ├── Button/
│       │   └── Button.jsx          # Reusable button (secondary / gradient, loading state)
│       ├── Loader/
│       │   └── Loader.jsx          # Small inline spinner used inside Button
│       ├── Modal/
│       │   └── Modal.jsx           # Reusable modal shell (pre-existing, not auth-specific)
│       └── Validator/
│           ├── Validator.jsx       # Reusable labeled input: validation, error text,
│           │                       # email/password/select/autocomplete/number support
│           └── NumberField.jsx     # Internal helper used only by Validator
│
├── pages/
│   ├── Login/
│   │   └── Login.jsx               # Login screen (uses Validator + Button)
│   └── Dashboard/
│       └── Dashboard.jsx           # Post-login landing page
│
├── layouts/
│   └── MainLayout/
│       └── MainLayout.jsx          # Header + page content shell
│
├── routes/
│   ├── AppRoutes.jsx                # /login, /dashboard route table
│   └── ProtectedRoute.jsx           # Route guard for authenticated-only pages
│
├── hooks/
│   └── useAuth.js                   # Consumes AuthContext
│
├── context/
│   └── AuthContext.jsx              # user, accessToken, login(), logout()
│
├── services/
│   ├── apiService.js                # fetch wrapper: base URL, headers, error normalization
│   └── authService.js               # login() — the only place that knows the auth endpoint
│
├── utils/
│   ├── storage.js                    # localStorage get/set/remove wrappers
│   ├── token.js                       # token save/get/remove/isAuthenticated helpers
│   ├── constants.js                   # API_BASE_URL, storage keys, ROUTES
│   └── helpers.js                      # isValidEmail, getErrorMessage
│
├── styles/
│   └── theme.js                       # JS design tokens (color, spacing, radii, shadow) + `mq()` breakpoint helper
│
├── App.jsx                            # BrowserRouter > AuthProvider > AppRoutes
└── main.jsx
```

All pages live under `pages/`; only genuinely reusable, page-agnostic pieces live under `components/common/`. Route-specific concerns (`AppRoutes`, `ProtectedRoute`) live together under `routes/`.

---

## Styling Approach: Emotion (CSS-in-JS)

No `.css` files exist for components. Every component defines its own styles with `@emotion/styled`, importing shared tokens from `src/styles/theme.js`:

```js
import styled from '@emotion/styled'
import { theme, mq } from '../../../styles/theme'

const Card = styled.div`
  padding: ${theme.spacing.lg};
  border-radius: ${theme.radii.lg};

  ${mq('tablet')} {
    padding: ${theme.spacing.xl};
  }
`
```

`theme.js` is a plain JS object (not a React context/`ThemeProvider`) — this is intentional. The project also uses MUI's `Validator`/`NumberField` components internally, which read MUI's own theme shape; wrapping the app in an unrelated Emotion `ThemeProvider` risks colliding with MUI's internal theme context. Importing `theme`/`mq` directly avoids that entirely while still centralizing tokens.

`src/index.css` is kept to a minimal global reset only (box-sizing, margin, base font) — it is not a per-component stylesheet.

---

## Reusing the Existing `Validator` Component

Per project convention, no new `Input` component was created. The Login page reuses the existing `components/common/Validator/Validator.jsx` (a MUI `TextField` wrapper that already supports required/email/password validation, error display, and a show/hide password toggle).

Two small, scoped improvements were made directly to `Validator.jsx` (not a fork/duplicate) to support the design:

1. **Password visibility icons** — swapped the plain "Show"/"Hide" text toggle for MUI's `Visibility`/`VisibilityOff` icons.
2. **`slotProps` merging** — `Validator` hardcodes `slotProps.htmlInput`/`slotProps.input` internally (for text alignment and the password toggle adornment). It now merges any caller-supplied `slotProps` with those internal defaults instead of letting a caller's `slotProps` silently overwrite them. This lets the Login page pass `slotProps={{ inputLabel: { shrink: true } }}` (to keep the label permanently in the notched position, matching the design) without breaking the password toggle.

Everywhere else, `Validator` behaves exactly as it did before.

---

## Login Page Design

`pages/Login/Login.jsx` is a two-column layout:

- **Left panel** — the `user-lock.png` icon, "Login into account" heading, subtext, an email `Validator` field, a password `Validator` field (with the built-in eye-icon toggle), a gradient pill submit button (`Button` variant `gradient`, with an MUI `ArrowForward` icon), and a copyright footer. A softened version of `assets/background.png` washes the top-left corner.
- **Right panel** (hidden below the `laptop` breakpoint) — a dark navy gradient panel with a two-tone headline, supporting copy, and a white curved panel stacking the three brand logos (`gfl.png`, `gfcl.png`, `inoxgfl.png`).

All existing project assets are reused as-is; no placeholder icons or images were introduced.

---

## Authentication Flow

```text
Login page
    │  user submits email + password
    ▼
Validator.ref.validate() on both fields (required + email format)
    │  valid
    ▼
useAuth().login({ email, password })
    │
    ▼
AuthContext.login()  ──calls──▶  authService.login()
    │                                   │
    │                                   ▼
    │                          apiService.post('/login', body)
    │                                   │
    │                                   ▼
    │                          JSON Server (server.js) — POST /login
    │                          looks up user by email + password
    │                                   │
    │                     ┌─────────────┴─────────────┐
    │                 401 Invalid                  200 OK
    │                     │                             │
    │                     ▼                             ▼
    │           authService throws              { accessToken,
    │           Error('Invalid email             refreshToken, user }
    │           or password')                            │
    ▼                     │                              ▼
Login page catches ◀──────┘                  AuthContext:
error, shows it                              - saveAccessToken()
                                              - saveRefreshToken()
                                              - store user in localStorage
                                              - update React state
                                                          │
                                                          ▼
                                              navigate('/dashboard', { replace: true })
                                                          │
                                                          ▼
                                              ProtectedRoute sees isAuthenticated = true
                                                          │
                                                          ▼
                                              Dashboard renders "Welcome {user.name}"
```

---

## Routing Flow

Defined in `routes/AppRoutes.jsx`, mounted inside `BrowserRouter` in `App.jsx`.

| Path         | Element                          | Access        |
|--------------|-----------------------------------|---------------|
| `/login`     | `Login`                           | Public        |
| `/dashboard` | `ProtectedRoute > Dashboard`      | Authenticated |
| `/`          | redirect → `/dashboard`           | —             |
| `*`          | redirect → `/login`               | —             |

Navigating to `/` or any unknown path always resolves to either the dashboard (if authenticated) or the login page, because `/dashboard` itself redirects unauthenticated users to `/login`.

---

## Protected Route

`routes/ProtectedRoute.jsx` wraps any route element that requires a session:

```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

It reads `isAuthenticated` from `useAuth()`. If `false`, it renders `<Navigate to="/login" replace />` instead of the children — the guarded page's code never runs for an unauthenticated visitor.

---

## Context Architecture

`context/AuthContext.jsx` exposes:

- `user` — the current user object (`{ id, name, email }`), hydrated from `localStorage` on first render.
- `accessToken` — the current dummy JWT-shaped token, also hydrated from storage.
- `isAuthenticated` — derived boolean (`Boolean(accessToken)`).
- `login({ email, password })` — calls `authService.login`, persists tokens + user, updates state.
- `logout()` — clears tokens, clears stored user, resets state.

`hooks/useAuth.js` is the only way components should touch the context — it throws if called outside `<AuthProvider>`, which catches integration mistakes early.

---

## Service Layer

Components **never** call `fetch` directly. Two layers:

- **`services/apiService.js`** — generic transport: builds the full URL from `API_BASE_URL`, attaches `Content-Type`/`Authorization` headers, parses JSON, and throws a typed `ApiError` (with `.status`) on non-2xx responses or network failures.
- **`services/authService.js`** — the only module that knows the `/login` endpoint shape. It maps `ApiError` statuses to user-facing messages (`401` → "Invalid email or password", network failure → "Unable to reach the server...").

Everything above the service layer (context, pages) only ever sees plain `Error` objects with a friendly `.message`.

---

## Token Management

`utils/token.js`:

| Function              | Purpose                                   |
|------------------------|--------------------------------------------|
| `saveAccessToken(t)`   | Persist access token to storage            |
| `getAccessToken()`     | Read access token                          |
| `saveRefreshToken(t)`  | Persist refresh token                      |
| `getRefreshToken()`    | Read refresh token                         |
| `removeTokens()`       | Clear both tokens (used on logout)         |
| `isAuthenticated()`    | `Boolean(getAccessToken())`                |

Built on top of `utils/storage.js`, a small `localStorage` wrapper with JSON serialization and error guards, so swapping storage strategy (e.g. to an httpOnly cookie flow) later only touches these two files.

---

## Login Sequence

1. User types email/password into the two `Validator` fields on `pages/Login/Login.jsx`.
2. On submit, each field's `ref.validate()` checks required + email format; errors render inline via `Validator`'s built-in error text.
3. If valid, `login()` from `useAuth()` is called and the gradient submit `Button` shows its loading spinner.
4. `AuthContext.login` delegates to `authService.login`, which POSTs to JSON Server.
5. On success, tokens + user are stored and React state updates; the page navigates to `/dashboard`.
6. On failure, the thrown `Error.message` is shown in a banner above the form.

## Logout Flow

1. User clicks **Logout** in `Header`.
2. `useAuth().logout()` runs: `removeTokens()` clears `accessToken`/`refreshToken` from `localStorage`, the stored `user` is removed, and context state resets to `null`.
3. `isAuthenticated` becomes `false` on the next render.
4. Since `Header`/`Dashboard` only render inside `ProtectedRoute`, the guard immediately redirects to `/login` on re-render (and any subsequent direct visit to `/dashboard` is redirected too).

---

## Component Responsibilities

| Component        | Location                              | Responsibility                                              |
|-------------------|----------------------------------------|-----------------------------------------------------------|
| `Login`           | `pages/Login/`                        | Form state, validation, calls `useAuth().login`            |
| `Dashboard`       | `pages/Dashboard/`                    | Reads `user` from `useAuth()`, renders welcome message      |
| `Header`          | `components/common/Header/`           | Logo, greeting, logout action — no auth logic of its own    |
| `MainLayout`      | `layouts/MainLayout/`                 | Composes `Header` + page content                            |
| `Button`          | `components/common/Button/`           | Presentational; `secondary`/`gradient` variants, `Loader`   |
| `Validator`       | `components/common/Validator/`        | Presentational + validation; label, error text, password toggle |
| `Loader`          | `components/common/Loader/`           | Presentational spinner                                      |
| `ProtectedRoute`  | `routes/`                             | Auth gate for a route subtree                               |

---

## Responsive Design Strategy

Mobile-first, implemented with Emotion + `mq()` breakpoint helper from `styles/theme.js` — no CSS framework:

- **Mobile (320–767px)** — base rules: single-column login form, hero marketing panel hidden, full-width fields/button.
- **Tablet (768–1023px)** — `mq('tablet')` widens the form panel's side padding.
- **Laptop (1024–1439px)** — `mq('laptop')` switches `Page` to a two-column row and reveals the dark hero panel with the logo showcase.
- **Desktop (1440px+)** — `mq('desktop')` bumps up the hero heading size; `MainLayout`'s content area caps at `1440px` and centers.

No fixed pixel widths beyond `max-width`; flexbox handles the login/header layout so nothing overflows horizontally at any width (verified with a headless-browser pass at 375px, 820px, and 1512px viewports — no horizontal scroll at any size).

---

## Naming Conventions

| Item              | Convention        | Example                     |
|--------------------|--------------------|-------------------------------|
| Folders (generic)  | lowercase          | `services`, `utils`, `hooks`  |
| Component folders  | PascalCase         | `Header/`, `Validator/`      |
| Component files    | PascalCase         | `Header.jsx`, `Login.jsx`     |
| Component functions| PascalCase         | `function Login() {}`         |
| Hooks              | camelCase, `use` prefix | `useAuth.js`             |
| Services           | camelCase          | `authService.js`              |
| Utils              | camelCase          | `token.js`, `helpers.js`       |
| Variables          | camelCase          | `accessToken`, `currentUser`   |
| Constants          | UPPER_SNAKE_CASE   | `API_BASE_URL`                 |

---

## Best Practices Followed

- Single Responsibility: pages own form/state, services own transport, context owns session state.
- No component calls `fetch` directly — everything routes through `apiService`/`authService`.
- No magic strings for storage keys or routes — centralized in `utils/constants.js`.
- Errors are normalized once (in `authService`) so UI code only ever handles a plain `.message`.
- Existing reusable components (`Validator`, `Button`, `Loader`, `Modal`) were reused and improved in place rather than duplicated.
- `styles/theme.js` keeps colors/spacing/breakpoints consistent across every Emotion-styled component.
- `PropTypes` on every component since the project doesn't use TypeScript.

---

## Future JWT Integration Steps

To replace JSON Server with a real backend, only the service layer changes:

1. In `utils/constants.js`, point `API_BASE_URL` at the real API.
2. In `services/authService.js`, change the endpoint path/payload if the real API differs (e.g. `/auth/login`), and adjust the error-status mapping to match the real API's error shape.
3. If the real backend issues actual JWTs, no changes are needed elsewhere — `utils/token.js` and `AuthContext` already treat tokens as opaque strings.
4. If token refresh is required, add a `refreshAccessToken()` function to `authService.js` and call it from `apiService.js` when a request returns `401`, using the existing `getRefreshToken()`/`saveAccessToken()` helpers.

No component, page, context, or route needs to change.

---

## JSON Server Setup

`db.json` (project root) seeds a single dummy user:

```json
{
  "users": [
    { "id": 1, "name": "Admin User", "email": "admin@inoxgfl.com", "password": "Admin@123" }
  ]
}
```

`server.js` (project root) wraps JSON Server's programmatic API (`jsonServer.create/router/defaults`) and adds one custom route:

- **POST `/login`** — looks up a user matching `{ email, password }` in `db.json`. Returns `401 { message }` if no match, otherwise `200` with:
  ```json
  {
    "accessToken": "dummy-access-token",
    "refreshToken": "dummy-refresh-token",
    "user": { "id": 1, "name": "Admin User", "email": "admin@inoxgfl.com" }
  }
  ```

## Dummy Credentials

```text
Email:    admin@inoxgfl.com
Password: Admin@123
```

## How to Run the Project

Two processes run side by side in development:

```bash
# Terminal 1 — fake auth backend (http://localhost:4000)
npm run server

# Terminal 2 — React app (http://localhost:5173, or next free port)
npm run dev
```

Visit the app, you'll be redirected to `/login`. Sign in with the dummy credentials above to reach `/dashboard`.

Other scripts:

```bash
npm run build     # production build
npm run preview   # preview the production build
npm run lint      # ESLint
```

## Security Recommendations

This module is **dev-only** as shipped — before going to production:

- Replace JSON Server with a real backend that hashes passwords (bcrypt/argon2) and never returns them in any response.
- Serve the app and API over HTTPS only.
- Store the access token in memory (or a short-lived cookie) rather than `localStorage` where practical — `localStorage` is readable by any script on the page (XSS risk). If `localStorage` must be used, keep the access token short-lived and pair it with a refresh flow.
- Prefer an `httpOnly`, `Secure`, `SameSite=Strict` cookie for the refresh token so it isn't reachable from JavaScript at all.
- Add CSRF protection if you move to cookie-based auth.
- Rate-limit the login endpoint and add account lockout/backoff after repeated failures.
- Never log credentials or tokens; the current dev server intentionally strips `password` from every response.
