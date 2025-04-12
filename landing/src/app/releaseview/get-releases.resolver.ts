import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import { GitHubRelease, ReleaseviewService } from './releaseview.service';

export const getReleasesResolver: ResolveFn<GitHubRelease[]> = (route, state) => {

  const releases = inject(ReleaseviewService)

  const owner = route.data['owner'] || 'DelgadoElias';
  const repo = route.data['repo'] || 'friendly-promise';

  return releases.getReleases(owner, repo).pipe(
    catchError((error) => {
      console.error('Error fetching releases', error);
      return of([]);
    })
  );
};
