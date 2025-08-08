import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@src/app/core/interceptors/auth-interceptor';
import { errorInterceptor } from '@src/app/core/interceptors/error-interceptor';
import { MAT_PAGINATOR_DEFAULT_OPTIONS } from '@angular/material/paginator';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    {
      provide: MAT_PAGINATOR_DEFAULT_OPTIONS,
      useValue: {
        pageSize: 5,
        pageSizeOptions: [5, 10, 25, 50],
        showFirstLastButtons: true,
      },
    },
  ],
};
