# Easygen task React Authentication Module

## Getting Started

1. Make sure the backend server is running.
2. Set the environment variable `NEXT_PUBLIC_BACKEND_URL` in your `.env.local` file.
3. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Pages
1. Home Page → [/](http://localhost:3000/)
2. Login Page →  [/login](http://localhost:3000/login)
3. Signup Page → [/login](http://localhost:3000/signup)

## Tech Stack
This project uses:
1. Reactjs
2. Next.js (App Router)
3. TypeScript
4. Axios
5. Tailwind CSS
6. shadcn/ui

## Authentication Flow

This project uses **JWT (JSON Web Tokens)** for authentication with **access tokens** and **refresh tokens**.

### Access Token
- Short-lived (e.g. maximum 1 day)
- Stored in `localStorage`
- Sent in the `Authorization: Bearer <token>` header for each API request.

### Refresh Token
- Long-lived (e.g., 7 days).
- Sent from the backend as a Secure cookie
- Used only to request a new access token when the old one expires.

### Flow

1. **Login / Signup**
    - User logs in or signs up.
    - Backend returns:
        - `accessToken` → stored in localStorage.
        - `refreshToken` → stored as a cookie.

2. **Authenticated Requests**
    - The Axios interceptor attaches the access token in the request header:
      ```
      Authorization: Bearer <accessToken>
      ```

3. **Token Expiration**
    - When the access token expires, the request fails with `401 Unauthorized`.

4. **Token Refresh**
    - The Axios interceptor automatically calls `/auth/refresh`:
        - The browser sends the refresh token cookie automatically.
        - Backend validates the refresh token, issues a new access token, and sets a new refresh token cookie.
        - The old refresh token is invalidated.

5. **Logout**
    - Frontend clears the access token from `localStorage`.
    - Backend clears the refresh token `cookies`.
