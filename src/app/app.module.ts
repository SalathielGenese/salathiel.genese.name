import {BrowserModule, Meta, provideClientHydration} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {NavigationEnd, Router, TitleStrategy} from "@angular/router";
import {DestroyRef, ElementRef, inject, Inject, NgModule, PLATFORM_ID, SecurityContext, signal} from '@angular/core';

import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

import {AppRoutingModule} from './app-routing.module';

import {HeaderComponent as HComponent} from "./components/header.component";
import {TranslateComponent} from "./components/translate.component";

import {SalathielTitleStrategy} from "./services/salathiel.title-strategy";
import {TargetInterceptor} from "./services/target.interceptor";
import {I18nService} from "./services/i18n.service";

import {NotFoundComponent} from "./pages/not-found.component";
import {BlogComponent} from "./pages/blog.component";
import {HireComponent} from "./pages/hire.component";
import {HomeComponent} from "./pages/home.component";
import {TranslatePipe} from "./pipes/translate.pipe";

import {HeaderComponent} from "./header.component";
import {FooterComponent} from "./footer.component";
import {MainComponent} from './main.component';
import {NavComponent} from "./nav.component";
import {ArticleComponent} from "./pages/article.component";
import {ArticleService} from "./services/article.service";
import {MarkdownModule, MarkdownService} from "ngx-markdown";
import {REQUEST} from "@nguniversal/express-engine/tokens";
import {isPlatformBrowser} from "@angular/common";
import {ALTERNATES, ORIGIN, PATH, TableOfContentEntry, TO_ANCHOR, TOC} from "./token";
import {filter} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@NgModule({
  declarations: [
    TranslatePipe,
    TranslateComponent,

    HComponent,

    NavComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,

    HomeComponent,
    HireComponent,
    BlogComponent,
    ArticleComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE,
    }),
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, multi: true, useClass: TargetInterceptor},
    {provide: TitleStrategy, useClass: SalathielTitleStrategy},
    {
      provide: TO_ANCHOR, useValue: (text: string) => text
          .toLowerCase()
          .replace(/[^A-Za-z]+/g, '-')
          .replace(/^-*/, '')
          .replace(/-*$/, ''),
    },
    {
      provide: TOC, useFactory: () => {
        const toc = signal([] as TableOfContentEntry[]);
        let content: HTMLDivElement | undefined;
        const setToc = toc.set.bind(toc);
        Reflect.set(toc, 'set', (ref: HTMLDivElement) => {
          if (ref !== content) {
            setToc((ref ? Array.from(ref.children) : [])
                .filter(_ => _.nodeName.match(/^H[1-6]$/))
                .map(_ => ({
                  anchor: (_.children.item(0) as HTMLAnchorElement).getAttribute('href'),
                  content: (_.children.item(1) as HTMLElement).innerHTML,
                  level: +_.nodeName[1],
                }) as TableOfContentEntry)
                .reduce((toc, entry) => {
                  if (!toc.length) {
                    toc.push(entry);
                  } else if (entry.level === 1 + toc.at(-1)!.level) {
                    (toc.at(-1)!.children ??= []).push(entry);
                  } else {
                    toc.push(entry);
                  }

                  return toc;
                }, [] as TableOfContentEntry[]));
            content = ref;
          }
        });
        return toc;
      },
    },
    {
      provide: PATH, useFactory: () => {
        const platformId = inject(PLATFORM_ID);

        switch (true) {
          case isPlatformBrowser(platformId):
            return () => location.pathname;
          default:
            const request = inject(REQUEST);
            return () => request.url;
        }
      }
    },
    {
      provide: ORIGIN, useFactory: () => {
        const platformId = inject(PLATFORM_ID);

        switch (true) {
          case isPlatformBrowser(platformId):
            return () => location.origin;
          default:
            const request = inject(REQUEST);
            const IS_PRODUCTION = 'production' === process.env['NODE_ENV'];
            return () => {
              const {headers: {'x-forwarded-host': xForwardedHost, origin, host}, protocol} = request;
              return origin ?? `${IS_PRODUCTION ? 'https' : protocol}://${xForwardedHost ?? host}`;
            };
        }
      }
    },
    {provide: ALTERNATES, useValue: []},
    provideClientHydration(),
    ArticleService,
    I18nService,
  ],
  bootstrap: [
    MainComponent,
    // HeaderComponent,
  ]
})
export class AppModule {
  constructor(router: Router,
              destroyRef: DestroyRef,
              private readonly meta: Meta,
              markdownService: MarkdownService,
              @Inject(PATH) private readonly path: () => string,
              @Inject(ORIGIN) private readonly origin: () => string,
              @Inject(TO_ANCHOR) private readonly toAnchor: (text: string) => string) {
    router.events
        .pipe(filter(_ => _ instanceof NavigationEnd))
        .pipe(takeUntilDestroyed(destroyRef))
        .subscribe(() => {
          this.meta.updateTag({property: 'og:type', content: 'website'});
          this.meta.updateTag({property: 'og:url', content: this.origin() + this.path()});
        });
    this.#overrideMarkdownMarkupVisitor(markdownService);
  }

  #overrideMarkdownMarkupVisitor(markdownService: MarkdownService) {
    markdownService.renderer.heading = (text, level, raw) =>
        `<h${level} tabindex="${Math.round(1E8 * Math.random())}" id="${this.toAnchor(raw)}" class="relative group">
          <a class="group-focus:opacity-100 group-hover:opacity-100 text-grey-400 right-full opacity-0 absolute px-1"
             href="${this.origin()}${this.path()}#${this.toAnchor(raw)}"
          >#</a>
          <span class="block">${text}</span>
        </h${level}>`
  }
}
