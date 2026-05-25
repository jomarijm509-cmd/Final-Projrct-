import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '@environments/environment';
import { AccountService } from '@app/_services';

export function jwtInterceptor(request: HttpRequest<any>, next: HttpHandlerFn) {
  const accountService = inject(AccountService);
  const account = accountService.accountValue;
  const isLoggedIn = account?.jwtToken;
  const isApiUrl = request.url.startsWith(environment.apiUrl);

  if (isLoggedIn && isApiUrl) {
    request = request.clone({
      setHeaders: { Authorization: `Bearer ${account.jwtToken}` }
    });
  }
  return next(request);
}
