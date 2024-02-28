import {Component} from '@angular/core';

@Component({
  selector: 'main[sg-main]',
  template: `
      <nav class="px-[max(2rem,calc((100vw-var(--max-width))/2))]" sg-nav></nav>
      <router-outlet></router-outlet>
      <footer class="px-[max(2rem,calc((100vw-var(--max-width))/2))]" sg-footer></footer>
  `,
})
export class MainComponent {
}
