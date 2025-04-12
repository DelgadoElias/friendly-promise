import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface GitHubRelease {
  name: string;
  tag_name: string;
  body: string;
  html_url: string;
  published_at: string;
  assets: string[];
  draft: boolean;
  tarball_url: string,
  zipball_url: string,
  prerelease: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class ReleaseviewService {
  private readonly baseUrl = 'https://api.github.com/repos';

  constructor(private readonly http: HttpClient) { }

  getReleases(owner: string, repo: string): Observable<GitHubRelease[]> {
    const url = `${this.baseUrl}/${owner}/${repo}/releases`;
    return this.http.get<GitHubRelease[]>(url);
  }
}
