import {BrowserModule, provideClientHydration} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {TitleStrategy} from "@angular/router";
import {Inject, NgModule, Optional, PLATFORM_ID, SecurityContext} from '@angular/core';

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
import {Request} from "express";
import {isPlatformBrowser} from "@angular/common";

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
  constructor(markdownService: MarkdownService,
              @Inject(PLATFORM_ID) private readonly platformId: object,
              @Optional() @Inject(REQUEST) private readonly request: Request) {
    markdownService.renderer.br = () => `<br class="block my-4">`;
    markdownService.renderer.paragraph = text => `<p class="my-4">${text}</p>`;
    markdownService.renderer.blockquote = quote =>
        `<blockquote class="border-grey-500 border-l-2 ml-4 pl-4">${quote}</blockquote>`;
    markdownService.renderer.list = (body, ordered, start) => {
      const task = body.includes('<li data-task');
      return ordered
          ? `<ol class="${task ? 'ml-[2px] pl-4' : 'pl-8 list-decimal'}" start="${start}">${body}</ol>`
          : `<ul class="${task ? 'ml-[2px] pl-4' : 'pl-8 list-disc'}">${body}</ul>`;
    };
    markdownService.renderer.heading = (text, level: number) => {
      return `<h${level} id="${this.#toAnchor(text)}" class="${{
        3: 'text-xl',
        2: 'text-3xl',
      }[level] ?? 'text-lg'} transition-all pt-4 group" tabindex="${1E4 + Math.round(1E6 * Math.random())}">${text}<a href="${this.#path + '#' + this.#toAnchor(text)}" class="group-focus:inline group-hover:inline text-gray-400 hidden ml-4">#</a></h${level}>`;
    };
    markdownService.renderer.link = (href, title, text) =>
        /^\^\d+$/.test(text)
            ? `<sup title="${href}">[${text.substring(1)}]</sup>`
            : `<a href="${encodeURI(href ?? '#')}">${text}</a>`;
    markdownService.renderer.listitem = (text, task, checked) =>
        task
            ? checked
                ? `<li data-task><span class="bg-grey-500 aspect-square inline-block outline-offset-1 outline-1 outline h-3"></span><span class="ml-1">${text}</span></li>`
                : `<li data-task><span class="outline-grey-400/50 bg-grey-400/30 aspect-square inline-block outline-offset-1 outline-1 outline h-3"></span><span class="ml-1">${text}</span></li>`
            : `<li>${text}</li>`;
    markdownService.renderer.codespan = code => `<span class="bg-grey-400 rounded px-1">${code}</span>`;
  }

  #toAnchor(text: string) {
    return text
        .toLowerCase()
        .replace(/[^A-Za-z]+/g, '-')
        .replace(/^-+/, '');
  }

  get #path() {
    if (isPlatformBrowser(this.platformId)) {
      return location.pathname;
    } else {
      return this.request?.url;
    }
  }
}
