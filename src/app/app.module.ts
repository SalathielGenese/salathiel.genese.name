import {computed, inject, InjectionToken, NgModule, Signal} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

import {HeaderComponent as HComponent} from "./components/header.component";
import {NotFoundComponent} from "./pages/not-found.component";
import {AppRoutingModule} from './app-routing.module';
import {HomeComponent} from "./pages/home.component";
import {HeaderComponent} from "./header.component";
import {FooterComponent} from "./footer.component";
import {MainComponent} from './main.component';
import {NavComponent} from "./nav.component";
import {BlogComponent} from "./pages/blog.component";
import {PortfolioComponent} from "./pages/portfolio.component";
import {HireComponent} from "./pages/hire.component";
import {ActivatedRoute, ActivationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {RootComponent} from "./pages/root.component";
import {IS_HOME, LANGUAGE_TAG} from "./token";
import {toSignal} from "@angular/core/rxjs-interop";

@NgModule({
  declarations: [
    HComponent,

    NavComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,

    RootComponent,
    HomeComponent,
    HireComponent,
    BlogComponent,
    NotFoundComponent,
    PortfolioComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule
  ],
  providers: [
    {provide: LANGUAGE_TAG, useFactory: () => inject(AppModule).resolve(LANGUAGE_TAG)},
    {provide: IS_HOME, useFactory: () => inject(AppModule).resolve(IS_HOME)},
  ],
  bootstrap: [
    NavComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,
  ]
})
export class AppModule {
  readonly #languageTag: Signal<string>;
  readonly #isHome: Signal<boolean>;

  constructor(router: Router, activatedRoute: ActivatedRoute) {
    const activationEnd = toSignal(router.events
        .pipe(filter(_ => _ instanceof ActivationEnd))) as Signal<ActivationEnd>;
    this.#isHome = computed(() =>
        activationEnd() && // NOTE: Re-compute when signal change
        RootComponent === activatedRoute.children[0].component &&
        HomeComponent === activatedRoute.children[0].children[0].component);
    this.#languageTag = computed(() => activationEnd()?.snapshot.params?.['locale'] ?? 'en-GB');
  }

  resolve<T>(token: InjectionToken<T>): T | void {
    switch (token) {
      case IS_HOME:
        return this.#isHome as any;
      case LANGUAGE_TAG:
        return this.#languageTag as any;
    }
  }
}
