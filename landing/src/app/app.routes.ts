import { Routes } from '@angular/router';
import { HomeviewComponent } from './homeview/homeview.component';
import { getReleasesResolver } from './releaseview/get-releases.resolver';

export const routes: Routes = [
    {
        path: '',
        component: HomeviewComponent
    },
    {
        path: 'releases',
        loadComponent: () => import('./releaseview/releaseview.component').then((c) => c.ReleaseviewComponent),
        resolve: { releases: getReleasesResolver }
    }
];
