import {computed, inject, InjectionToken, NgModule, Signal} from '@angular/core';
import {toSignal} from "@angular/core/rxjs-interop";
import {BrowserModule} from '@angular/platform-browser';
import {ActivatedRoute, ActivationEnd, Router} from "@angular/router";
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

import {filter} from "rxjs";

import {IS_HOME, LANGUAGE_TAG} from "./token";

import {HeaderComponent as HComponent} from "./components/header.component";
import {AppRoutingModule} from './app-routing.module';
import {HeaderComponent} from "./header.component";
import {FooterComponent} from "./footer.component";
import {MainComponent} from './main.component';
import {NavComponent} from "./nav.component";

import {NotFoundComponent} from "./pages/not-found.component";
import {BlogComponent} from "./pages/blog.component";
import {HireComponent} from "./pages/hire.component";
import {HomeComponent} from "./pages/home.component";

@NgModule({
  declarations: [
    HComponent,

    NavComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,

    HomeComponent,
    HireComponent,
    BlogComponent,
    NotFoundComponent,
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
    // HeaderComponent,
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
        // RootComponent === activatedRoute.children[0].component &&
        // HomeComponent === activatedRoute.children[0].children[0].component);
        HomeComponent === activatedRoute.children[0].component);
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
