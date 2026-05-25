import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AccountService } from '@app/_services';

export function authGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  const router = inject(Router);
  const accountService = inject(AccountService);
  const account = accountService.accountValue;

  if (account) {
    // check role restrictions
    if (route.data['roles'] && !route.data['roles'].includes(account.role)) {
      // logged in but not authorized for this role
      router.navigate(['/']);
      return false;
    }
    return true;
  }

  // not logged in → redirect to login with returnUrl
  router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
  return false;
}
