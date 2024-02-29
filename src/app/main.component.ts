import {Component, effect, HostBinding, Inject, Signal} from '@angular/core';
import {IS_HOME} from "./token";

@Component({
  selector: 'main[sg-main]',
  template: `
      <nav class="px-[max(2rem,calc((100vw-var(--max-width))/2))]" sg-nav></nav>
      <router-outlet></router-outlet>
      <footer class="px-[max(2rem,calc((100vw-var(--max-width))/2))]" sg-footer></footer>
  `,
})
export class MainComponent {
  @HostBinding('class.snap-y')
  @HostBinding('class.snap-mandatory')
  protected isHome: boolean;
  constructor(@Inject(IS_HOME) isHome: Signal<boolean>) {
    effect(() => this.isHome = isHome());
    this.isHome = isHome();
  }
}
