import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NAVIGATION_NODES } from '../../core/providers/provide-navigtator-nodes';

@Component({
  selector: 'navigator',
  standalone: true,
  imports: [RouterLink],
  styleUrl: './navigator.component.css',
  template: `
  <section class="nav-container">
    <nav>
        <div class="nav-links">
            @for(item of routeList; track item.label){
            <a [routerLink]="item.path" [class]="isActive(item.path) ? 'active' : ''">
                {{item.label}}
            </a>
            }
        </div>
    </nav>
  </section>`,
})
export class NavigatorComponent {

  protected readonly route = inject(ActivatedRoute);
  protected readonly routeList = inject(NAVIGATION_NODES)


  isActive(path: string): boolean {
    const currentPath = this.route.snapshot.url.join('/');

    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  }
}
