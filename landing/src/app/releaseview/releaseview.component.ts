import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GitHubRelease } from './releaseview.service';
import { DatePipe } from '@angular/common';
import { MarkdownComponent } from 'ngx-markdown';
@Component({
  selector: 'app-releaseview',
  standalone: true,
  imports: [DatePipe, MarkdownComponent],
  template: `
  <h1>Releases</h1>
@if (releases.length > 0) {
@for (item of releases; track $index) {
@if (verifyIsValidTagName(item.tag_name)) {
    <div class="divider"></div>
<h2>
    <a [href]="item.html_url" target="_blank">
        {{ item.tag_name }}
    </a>
</h2>
<small>{{ item.published_at | date: 'medium' }}</small>
<markdown [data]="item.body"></markdown>
<div class="href-container">
    @if (item.tarball_url) {
        <a [href]="item.tarball_url" target="_blank" class="href-card">Download .tar.gz</a>
    }
    @if (item.zipball_url) {
        <a [href]="item.zipball_url" target="_blank" class="href-card">Download .zip</a>
    }
</div>

}
}
} @else {
<p>No releases found.</p>

}
  `,
  styles: '.divider {width: 100%; background-color: var(--border-color); height: 1px; margin-top: 0px; margin-bottom: 10px;} .href-container { display: grid; gap: 5px; padding-bottom: 20px; }'
})
export class ReleaseviewComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly releases: GitHubRelease[] = this.route.snapshot.data['releases'] ?? [];


  verifyIsValidTagName(tag_name: string) {
    return tag_name.match(/^v?\d+\.\d+\.\d+$/);
  }
}
