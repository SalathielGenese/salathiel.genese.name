import {computed, effect, inject, InjectionToken, NgModule, PLATFORM_ID, Signal, signal} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./pages/home.component";
import {NotFoundComponent} from "./pages/not-found.component";
import {BlogComponent} from "./pages/blog.component";
import {HireComponent} from "./pages/hire.component";
import {IS_HOME, LANGUAGE_TAG} from "./token";
import {isPlatformBrowser} from "@angular/common";
import {filter} from "rxjs";
import {COOKIE_LANGUAGE_TAG, LANGUAGES} from "../constant";
import {REQUEST} from "@nguniversal/express-engine/tokens";
import {toSignal} from "@angular/core/rxjs-interop";

const routes: Routes = [
  {path: ':languageTag', pathMatch: 'full', component: HomeComponent, title: 'pages.home.title'},
  {path: ':languageTag/blog', component: BlogComponent, title: 'pages.blog.title'},
  {path: ':languageTag/hire', component: HireComponent, title: 'pages.hire.title'},
  {path: '**', component: NotFoundComponent},
];

const NAVIGATION_END = new InjectionToken<Signal<NavigationEnd>>('NAVIGATION_END');

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  providers: [
    {
      useFactory: () => toSignal(inject(Router).events.pipe(filter(_ => _ instanceof NavigationEnd))),
      provide: NAVIGATION_END,
    },
    {
      useFactory: () => {
        const activatedRoute = inject(ActivatedRoute);
        const navigationEnd = inject(NAVIGATION_END);
        return computed(() => {
          navigationEnd();
          return HomeComponent === activatedRoute.children[0]?.component;
        })
      },
      provide: IS_HOME,
    },
    {
      provide: LANGUAGE_TAG,
      useFactory: () => {
        const platformId = inject(PLATFORM_ID);
        const navigationEnd = inject(NAVIGATION_END);
        const request = inject(REQUEST, {optional: true});
        const languageTag = signal((url => LANGUAGES.find(({tag}) => url.startsWith(`/${tag}`))?.tag!)(resolveUrl()));
        effect(() => {
          languageTag.set((url => LANGUAGES.find(({tag}) => url.startsWith(`/${tag}`))?.tag)(resolveUrl())
              ?? resolveCookieLanguageTag()
              ?? 'en-GB');
          navigationEnd();
        }, {allowSignalWrites: true});
        return languageTag;

        function resolveCookieLanguageTag() {
          if (isPlatformBrowser(platformId)) {
            const {cookie} = document;
            return LANGUAGES.find(({tag}) => cookie.includes(`${COOKIE_LANGUAGE_TAG}=${tag}`))?.tag;
          } else {
            return request?.cookies?.[COOKIE_LANGUAGE_TAG];
          }
        }

        function resolveUrl() {
          if (isPlatformBrowser(platformId)) {
            return location.pathname;
          } else {
            return request?.url!;
          }
        }
      },
    }
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule {
}
