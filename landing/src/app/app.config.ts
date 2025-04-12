import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideNavigationNodes } from './core/providers/provide-navigtator-nodes';
import { navigationNodesList } from './core/constants/navigation-nodes.constant';
import { provideHttpClient } from '@angular/common/http';
import { provideMarkdown } from 'ngx-markdown';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideMarkdown(),
    provideRouter(routes),
    provideNavigationNodes(navigationNodesList)
  ]
};
