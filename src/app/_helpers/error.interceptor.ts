import { HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AccountService } from '@app/_services';

export function errorInterceptor(request: HttpRequest<any>, next: HttpHandlerFn) {
  const accountService = inject(AccountService);

  return next(request).pipe(catchError((err: HttpErrorResponse) => {
    if ([401, 403].includes(err.status) && accountService.accountValue) {
      // auto logout on 401/403
      accountService.logout();
    }
    const error = err.error?.message || err.statusText;
    return throwError(() => error);
  }));
}
