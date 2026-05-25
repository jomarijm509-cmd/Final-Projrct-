# Testing Guide

## Stage A — Fake Backend (Default)

The app runs entirely in the browser with a fake backend that stores data in **localStorage**.

### Quick Start Test
```
1. npm install && ng serve
2. Open http://localhost:4200
3. You'll be redirected to /account/login
```

### Test 1: Registration + Email Verification
```
① Go to /account/register
② Fill: Mr | Jane | Doe | jane@test.com | password123 | ✓ Accept terms
③ Submit → redirected to /account/login
④ Look for the blue INFO box at the top of the page (the fake "email")
⑤ Click "✅ Verify Email" link in the box
⑥ Redirected to login with "Email verified successfully!" message
```

### Test 2: Admin Login + Admin Panel
```
① Login with jane@test.com / password123
② ✓ You should see "👑 Admin" badge in the navbar (first account = Admin)
③ Click "🛡️ Admin" in the navbar → Admin Panel
④ Go to Accounts → see your own account listed
⑤ Try Add Account → create a second test user
```

### Test 3: Regular User Restrictions
```
① Register a SECOND account: john@test.com / password123
② Verify via on-screen "email"
③ Login as john@test.com
④ ✓ Navbar shows "👤 User" badge — no Admin link
⑤ Try navigating to /admin manually
⑥ ✓ Should redirect to / (home) — access denied
```

### Test 4: Forgot Password Reset
```
① Logout
② Go to /account/forgot-password
③ Enter jane@test.com → Submit
④ Check the on-screen "email" (red info box)
⑤ Click "🔑 Reset Password" link
⑥ Enter new password → Submit
⑦ Login with new password ✓
```

### Test 5: Profile Management
```
① Login and click Profile in navbar
② Update first/last name → Save ✓
③ Try updating with wrong confirm password → validation error ✓
④ (Optional) Test delete account — logs out automatically
```

---

## Stage B — Live Backend Integration

1. Remove `fakeBackendInterceptor` from `app.config.ts`
2. Update `environment.prod.ts` with real backend URL
3. Build: `ng build --configuration production`
4. Deploy to Render (Static Site)

### Browser DevTools Checks
- **Network tab:** JWT token in `Authorization: Bearer <token>` header
- **Application → Cookies:** `refreshToken` cookie (HttpOnly, Secure in prod)
- **Console:** No CORS errors

### Integration Test Checklist
- [ ] Register → receive REAL email (check Mailtrap/Ethereal inbox)
- [ ] Click email link → verified
- [ ] Login → JWT in network requests
- [ ] Wait 15 min → auto refresh happens silently (watch Network tab)
- [ ] Refresh page → still logged in (refresh token cookie persists)
- [ ] Test /admin with Admin account
- [ ] Test /admin redirect with User account
