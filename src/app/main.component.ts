import {Component, effect, HostBinding, Inject, Signal} from '@angular/core';
import {IS_HOME} from "./token";

@Component({
  selector: 'main[sg-main]',
  template: `
      <nav class="px-center" sg-nav></nav>
      <router-outlet></router-outlet>
      <footer class="px-center" sg-footer></footer>
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
