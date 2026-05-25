# Angular 21 Auth Boilerplate

A complete, production-ready authentication system built with **Angular 21**, **JWT**, **Bootstrap 5**, and a fake backend for instant testing — no server required.

## 🚀 Live Demo
- **Frontend (Render):** `https://your-app.onrender.com` ← update after deploy
- **Backend API:** `https://your-backend.onrender.com`
- **Swagger Docs:** `https://your-backend.onrender.com/api-docs`

---

## ✨ Features

| Feature | Details |
|---|---|
| 📧 Email Sign-Up | Registration with email verification |
| 🔐 JWT Auth | 15-minute access tokens |
| 🔄 Refresh Tokens | 7-day refresh tokens stored in HttpOnly cookie |
| ⏱️ Auto Refresh | Silent token refresh 1 min before expiry |
| 👑 Role-Based Access | Admin & User roles; first account = Admin |
| 👤 Profile | View & update profile, change password, delete account |
| 🛡️ Admin Panel | Create, edit, delete all accounts |
| 🧪 Fake Backend | Full mock API runs in browser — no server needed |

---

## 🛠️ Local Setup

### Prerequisites
- Node.js 18+
- Angular CLI 21: `npm install -g @angular/cli@21`

### Install & Run
```bash
git clone https://github.com/YOUR_USERNAME/ng-auth-boilerplate.git
cd ng-auth-boilerplate
npm install
ng serve
```

Open `http://localhost:4200` — the fake backend is enabled by default.

---

## 🧪 Testing the Fake Backend (Stage A)

### Complete Registration → Login Flow:
1. Go to `/account/register`
2. Fill in details → Submit
3. **Look for the on-screen "email"** (blue info box at the top)
4. Click the **✅ Verify Email** link in that box
5. You'll be redirected to login with a success message
6. Login with your credentials

### Test Admin vs User Roles:
- **First account** registered = Admin (gets full `/admin` access)
- **Subsequent accounts** = User (redirected away from `/admin`)
- Register a second account to test user restrictions

### Password Reset Flow:
1. Go to `/account/forgot-password`
2. Enter your email → Submit
3. Click the **🔑 Reset Password** link in the on-screen "email"
4. Set a new password → Login

---

## 🌐 Deployment to Render

### Backend (Node.js + MySQL Web Service)
Set these environment variables in Render:
```env
NODE_ENV=production
JWT_SECRET=your-strong-secret-here
DB_HOST=your-mysql-host
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=auth_db
CORS_ORIGIN=https://your-frontend.onrender.com
COOKIE_SECURE=true
EMAIL_FROM=noreply@yourdomain.com
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your-mailtrap-user
SMTP_PASS=your-mailtrap-pass
```

### Frontend (Static Site on Render)
| Setting | Value |
|---|---|
| Build Command | `npm ci && npm run build` |
| Publish Directory | `dist/ng-auth-boilerplate` |

**⚠️ CRITICAL — SPA Rewrite Rule:**
```
Source:      /*
Destination: /index.html
Action:      Rewrite   ← NOT Redirect!
```

### Switch to Real Backend:
1. Update `src/environments/environment.prod.ts`:
   ```ts
   export const environment = {
     production: true,
     apiUrl: 'https://your-backend.onrender.com/api'
   };
   ```
2. Remove `fakeBackendInterceptor` from `src/app/app.config.ts`
3. Build & deploy: `ng build --configuration production`

---

## 📁 Project Structure

```
src/app/
├── _models/          ← Account, Alert, Role
├── _services/        ← AccountService, AlertService
├── _helpers/         ← Guards, Interceptors, Fake Backend, Validators
├── _components/      ← AlertComponent
├── account/          ← Login, Register, Forgot/Reset Password, Verify Email
├── admin/            ← Admin layout, Overview, Accounts (list + add/edit)
├── profile/          ← Profile details + update
└── home/             ← Home page (post-login)
```

---

## ⚠️ Common Pitfalls

| Problem | Fix |
|---|---|
| Verify links 404 | Add SPA **Rewrite** rule in Render (not Redirect) |
| CORS errors | Set exact `CORS_ORIGIN` in backend env vars |
| Cookies not sent | Ensure `withCredentials: true` in HTTP calls |
| Fake backend in production | Remove `fakeBackendInterceptor` from `app.config.ts` |
| Secrets committed | Add `.env` and `config.json` to `.gitignore` |

---

## 📦 Stack

- **Angular 21** — Standalone components, lazy loading, functional guards
- **Bootstrap 5.3** — UI components and layout
- **RxJS** — Reactive state management
- **TypeScript** — Full type safety
- **JWT** — Stateless authentication

---

## 📸 Demo Checklist

- [ ] Registration with on-screen verification "email"
- [ ] Email verification → auto redirect to login
- [ ] Login with JWT token (visible in DevTools → Network)
- [ ] Admin panel access (first account)
- [ ] User role restriction (second account → redirected from `/admin`)
- [ ] Refresh token cookie (DevTools → Application → Cookies)
- [ ] Forgot password → reset password flow
- [ ] Profile update & password change
- [ ] Account deletion
