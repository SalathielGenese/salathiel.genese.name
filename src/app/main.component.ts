import {Component} from '@angular/core';

@Component({
  selector: 'main[sg-main]',
  template: `
      <nav class="px-[clamp(max(calc((100vw-var(--max-width))/2),2rem),2rem,2rem)]" sg-nav></nav>
      <router-outlet></router-outlet>
      <footer class="px-[clamp(max(calc((100vw-var(--max-width))/2),2rem),2rem,2rem)]" sg-footer></footer>
  `,
})
export class MainComponent {
}
