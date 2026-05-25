import { HttpRequest, HttpResponse, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';
import { AlertService } from '@app/_services';
import { Role } from '@app/_models';

const accountsKey = 'ng-auth-accounts';

function getAccounts(): any[] {
  const raw = localStorage.getItem(accountsKey);
  return raw ? JSON.parse(raw) : [];
}

function saveAccounts(accounts: any[]) {
  localStorage.setItem(accountsKey, JSON.stringify(accounts));
}

function idToken(account: any): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const exp = Math.round(new Date(Date.now() + 15 * 60 * 1000).getTime() / 1000);
  const payload = btoa(JSON.stringify({ sub: account.id, id: account.id, role: account.role, exp }));
  return `fake-${header}.${payload}.fake`;
}

function newRefreshToken(): string {
  return `${new Date().getTime()}`;
}

function randomId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function isAuthorized(request: HttpRequest<any>): any {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer fake-')) return null;
  const jwtToken = JSON.parse(atob(authHeader.split('.')[1]));
  const expired = Date.now() > jwtToken.exp * 1000;
  if (expired) return null;
  return getAccounts().find(x => x.id === jwtToken.id) ?? null;
}

export function fakeBackendInterceptor(request: HttpRequest<any>, next: HttpHandlerFn): Observable<any> {
  const alertService = inject(AlertService);
  const { url, method, body } = request;

  return handleRoute();

  function handleRoute(): Observable<any> {
    switch (true) {
      case url.endsWith('/accounts/authenticate') && method === 'POST': return authenticate();
      case url.endsWith('/accounts/refresh-token') && method === 'POST': return refreshToken();
      case url.endsWith('/accounts/revoke-token') && method === 'POST': return revokeToken();
      case url.endsWith('/accounts/register') && method === 'POST': return register();
      case url.endsWith('/accounts/verify-email') && method === 'POST': return verifyEmail();
      case url.endsWith('/accounts/forgot-password') && method === 'POST': return forgotPassword();
      case url.endsWith('/accounts/validate-reset-token') && method === 'POST': return validateResetToken();
      case url.endsWith('/accounts/reset-password') && method === 'POST': return resetPassword();
      case url.endsWith('/accounts') && method === 'GET': return getAccounts_();
      case url.endsWith('/accounts') && method === 'POST': return createAccount();
      case url.match(/\/accounts\/[\w-]+$/) !== null && method === 'GET': return getAccountById();
      case url.match(/\/accounts\/[\w-]+$/) !== null && method === 'PUT': return updateAccount();
      case url.match(/\/accounts\/[\w-]+$/) !== null && method === 'DELETE': return deleteAccount();
      default: return next(request);
    }
  }

  // ---------- route handlers ----------

  function authenticate(): Observable<any> {
    const { email, password } = body;
    const accounts = getAccounts();
    const account = accounts.find((x: any) => x.email === email && x.password === password && x.isVerified);
    if (!account) return error('Email or password is incorrect, or account is not verified');
    // add refresh token
    account.refreshTokens = account.refreshTokens || [];
    const rt = { token: newRefreshToken(), expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) };
    account.refreshTokens.push(rt);
    saveAccounts(accounts);
    return ok({ ...basicDetails(account), jwtToken: idToken(account) });
  }

  function refreshToken(): Observable<any> {
    const accounts = getAccounts();
    let account: any = null;
    let token: any = null;
    for (const acc of accounts) {
      const rt = (acc.refreshTokens || []).find((t: any) => new Date(t.expires) > new Date());
      if (rt) { account = acc; token = rt; break; }
    }
    if (!account) return error('Invalid token');
    const newRt = { token: newRefreshToken(), expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) };
    account.refreshTokens = account.refreshTokens.filter((t: any) => t.token !== token.token);
    account.refreshTokens.push(newRt);
    saveAccounts(accounts);
    return ok({ ...basicDetails(account), jwtToken: idToken(account) });
  }

  function revokeToken(): Observable<any> {
    return ok({});
  }

  function register(): Observable<any> {
    const account = { ...body };
    const accounts = getAccounts();

    if (accounts.find((x: any) => x.email === account.email)) {
      // display info "email" for duplicate
      alertService.info(`
        <h5>⚠️ Email Already Registered</h5>
        <p>The email <strong>${account.email}</strong> is already registered.</p>
        <p>If you forgot your password, <a href="/account/forgot-password">click here to reset it</a>.</p>
      `, { autoClose: false });
      return error(`Email "${account.email}" is already registered`);
    }

    account.id = randomId();
    account.role = accounts.length === 0 ? Role.Admin : Role.User;
    account.verificationToken = randomId();
    account.isVerified = false;
    account.refreshTokens = [];
    accounts.push(account);
    saveAccounts(accounts);

    // display fake email on screen
    const verifyUrl = `${window.location.origin}/account/verify-email?token=${account.verificationToken}`;
    alertService.info(`
      <div style="font-family:sans-serif">
        <h5>📧 Verification Email</h5>
        <hr/>
        <p>Hello <strong>${account.firstName}</strong>,</p>
        <p>Thanks for registering! Please verify your email to activate your account:</p>
        <p>
          <a href="${verifyUrl}" style="background:#0d6efd;color:white;padding:8px 16px;border-radius:4px;text-decoration:none;display:inline-block">
            ✅ Verify Email
          </a>
        </p>
        <p style="font-size:0.8em;color:#6c757d">
          Or copy this link: <code>${verifyUrl}</code>
        </p>
        <p style="font-size:0.75em;color:#aaa">
          <strong>NOTE:</strong> This is a <em>fake email</em> displayed by the fake backend for testing purposes.
          A real backend would send an actual email.
        </p>
      </div>
    `, { autoClose: false });

    return ok({ message: 'Registration successful — please check the on-screen "email" to verify your account.' });
  }

  function verifyEmail(): Observable<any> {
    const { token } = body;
    const accounts = getAccounts();
    const account = accounts.find((x: any) => x.verificationToken === token);
    if (!account) return error('Verification failed — invalid or expired token');
    account.isVerified = true;
    saveAccounts(accounts);
    return ok({ message: 'Verification successful — you can now login' });
  }

  function forgotPassword(): Observable<any> {
    const { email } = body;
    const accounts = getAccounts();
    const account = accounts.find((x: any) => x.email === email);

    // always return success regardless of whether email exists (security best practice)
    if (account) {
      account.resetToken = randomId();
      account.resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      saveAccounts(accounts);

      const resetUrl = `${window.location.origin}/account/reset-password?token=${account.resetToken}`;
      alertService.info(`
        <div style="font-family:sans-serif">
          <h5>📧 Password Reset Email</h5>
          <hr/>
          <p>Hello <strong>${account.firstName}</strong>,</p>
          <p>You requested a password reset. Click below to choose a new password:</p>
          <p>
            <a href="${resetUrl}" style="background:#dc3545;color:white;padding:8px 16px;border-radius:4px;text-decoration:none;display:inline-block">
              🔑 Reset Password
            </a>
          </p>
          <p style="font-size:0.8em;color:#6c757d">Or copy: <code>${resetUrl}</code></p>
          <p style="font-size:0.75em;color:#aaa">
            <strong>NOTE:</strong> This is a fake email for testing purposes.
          </p>
        </div>
      `, { autoClose: false });
    }

    return ok({ message: 'Please check your email for password reset instructions' });
  }

  function validateResetToken(): Observable<any> {
    const { token } = body;
    const account = getAccounts().find((x: any) =>
      x.resetToken === token && new Date() < new Date(x.resetTokenExpires)
    );
    if (!account) return error('Invalid or expired reset token');
    return ok({ message: 'Token is valid' });
  }

  function resetPassword(): Observable<any> {
    const { token, password } = body;
    const accounts = getAccounts();
    const account = accounts.find((x: any) =>
      x.resetToken === token && new Date() < new Date(x.resetTokenExpires)
    );
    if (!account) return error('Invalid or expired reset token');
    account.password = password;
    account.resetToken = undefined;
    account.resetTokenExpires = undefined;
    saveAccounts(accounts);
    return ok({ message: 'Password reset successful — you can now login with your new password' });
  }

  function getAccounts_(): Observable<any> {
    const auth = isAuthorized(request);
    if (!auth) return unauthorized();
    if (auth.role !== Role.Admin) return unauthorized();
    return ok(getAccounts().map(basicDetails));
  }

  function createAccount(): Observable<any> {
    const auth = isAuthorized(request);
    if (!auth) return unauthorized();
    if (auth.role !== Role.Admin) return unauthorized();
    const account = { ...body };
    const accounts = getAccounts();
    if (accounts.find((x: any) => x.email === account.email)) {
      return error(`Email "${account.email}" is already registered`);
    }
    account.id = randomId();
    account.isVerified = true;
    account.refreshTokens = [];
    accounts.push(account);
    saveAccounts(accounts);
    return ok({ message: 'Account created successfully' });
  }

  function getAccountById(): Observable<any> {
    const auth = isAuthorized(request);
    if (!auth) return unauthorized();
    const id = url.split('/').pop();
    if (auth.role !== Role.Admin && auth.id !== id) return unauthorized();
    const account = getAccounts().find((x: any) => x.id === id);
    if (!account) return error('Account not found');
    return ok(basicDetails(account));
  }

  function updateAccount(): Observable<any> {
    const auth = isAuthorized(request);
    if (!auth) return unauthorized();
    const id = url.split('/').pop();
    if (auth.role !== Role.Admin && auth.id !== id) return unauthorized();
    const accounts = getAccounts();
    const account = accounts.find((x: any) => x.id === id);
    if (!account) return error('Account not found');
    if (body.email && body.email !== account.email && accounts.find((x: any) => x.email === body.email)) {
      return error(`Email "${body.email}" is already taken`);
    }
    Object.assign(account, body);
    if (!body.password) delete account.password; // don't clear password if not provided
    saveAccounts(accounts);
    return ok(basicDetails(account));
  }

  function deleteAccount(): Observable<any> {
    const auth = isAuthorized(request);
    if (!auth) return unauthorized();
    const id = url.split('/').pop();
    if (auth.role !== Role.Admin && auth.id !== id) return unauthorized();
    const accounts = getAccounts();
    const idx = accounts.findIndex((x: any) => x.id === id);
    if (idx === -1) return error('Account not found');
    accounts.splice(idx, 1);
    saveAccounts(accounts);
    return ok({ message: 'Account deleted successfully' });
  }

  // ---------- helpers ----------

  function basicDetails(a: any) {
    const { id, title, firstName, lastName, email, role, isVerified } = a;
    return { id, title, firstName, lastName, email, role, isVerified };
  }

  function ok(responseBody?: any): Observable<any> {
    return of(new HttpResponse({ status: 200, body: responseBody }))
      .pipe(materialize(), delay(400), dematerialize());
  }

  function error(message: string): Observable<any> {
    return throwError(() => ({ error: { message } }))
      .pipe(materialize(), delay(400), dematerialize());
  }

  function unauthorized(): Observable<any> {
    return throwError(() => ({ status: 401, error: { message: 'Unauthorized' } }))
      .pipe(materialize(), delay(400), dematerialize());
  }
}
