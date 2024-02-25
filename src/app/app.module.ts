import {
  effect,
  Inject,
  inject,
  InjectionToken,
  NgModule,
  Optional,
  PLATFORM_ID,
  signal,
  Signal,
  WritableSignal
} from '@angular/core';
import {toSignal} from "@angular/core/rxjs-interop";
import {BrowserModule, provideClientHydration} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
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
import {I18nService} from "./services/i18n.service";
import {TranslatePipe} from "./pipes/translate.pipe";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {TargetInterceptor} from "./services/target.interceptor";
import {REQUEST} from "@nguniversal/express-engine/tokens";
import {Request} from "express";
import {isPlatformServer} from "@angular/common";
import {LANGUAGES} from "../constant";

@NgModule({
  declarations: [
    TranslatePipe,

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
    HttpClientModule,
    FontAwesomeModule
  ],
  providers: [
    {provide: LANGUAGE_TAG, useFactory: () => inject(AppModule).resolve(LANGUAGE_TAG)},
    {provide: IS_HOME, useFactory: () => inject(AppModule).resolve(IS_HOME)},
    {provide: HTTP_INTERCEPTORS, multi: true, useClass: TargetInterceptor},
    provideClientHydration(),
    I18nService,
  ],
  bootstrap: [
    MainComponent,
    // HeaderComponent,
  ]
})
export class AppModule {
  readonly #isHome: WritableSignal<boolean>;
  readonly #languageTag: WritableSignal<string>;

  constructor(router: Router,
              activatedRoute: ActivatedRoute,
              @Inject(PLATFORM_ID) private readonly platformId: object,
              @Inject(REQUEST) @Optional() private readonly request: Request) {
    const navigationEnd = toSignal(
        router.events.pipe(filter(_ => _ instanceof NavigationEnd))) as Signal<NavigationEnd>;
    effect(() => {
      this.#isHome.set(HomeComponent === activatedRoute.children[0]?.component);
      this.#languageTag.set(this.#resolveLanguageTag());
      navigationEnd();
    }, {allowSignalWrites: true});
    this.#isHome = signal(HomeComponent === activatedRoute.children[0]?.component);
    this.#languageTag = signal(this.#resolveLanguageTag());
  }

  resolve<T>(token: InjectionToken<T>): T | void {
    switch (token) {
      case IS_HOME:
        return this.#isHome as any;
      case LANGUAGE_TAG:
        return this.#languageTag as any;
    }
  }

  #resolveLanguageTag(): string {
    if (isPlatformServer(this.platformId)) {
      return LANGUAGES.find(({tag}) => this.request.url.startsWith(`/${tag}`))?.tag ?? 'en-GB';
    } else {
      return LANGUAGES.find(({tag}) => location.pathname.startsWith(`/${tag}`))?.tag ?? 'en-GB';
    }
  }
}
