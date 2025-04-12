import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigatorComponent } from './shared/navigator/navigator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigatorComponent],
  template: `<div class="top-glow" transition:persist></div>
  <main>
    <navigator></navigator>
    <router-outlet></router-outlet>
  </main>
  <div class="bottom-glow" transition:persist></div>`,
})
export class AppComponent {
  title = 'landing';
}
