import { ApplicationConfig, APP_INITIALIZER, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { appInitializer } from './_helpers/app.initializer';
import { jwtInterceptor } from './_helpers/jwt.interceptor';
import { errorInterceptor } from './_helpers/error.interceptor';
import { fakeBackendInterceptor } from './_helpers/fake-backend';
import { AccountService } from './_services/account.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        jwtInterceptor,
        errorInterceptor,
        fakeBackendInterceptor   // ← Remove this line to use a real backend
      ])
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      deps: [AccountService],
      multi: true
    }
  ]
};
