import {Component, DestroyRef, effect, Inject, OnInit, Signal} from "@angular/core";
import {ALTERNATES, LANGUAGE_TAG} from "../token";
import {routes} from "../routes";
import {Meta} from "@angular/platform-browser";
import {I18nService} from "../services/i18n.service";
import {LANGUAGES} from "../../constant";
import {Article} from "../services/article.service";
import {ActivatedRoute} from "@angular/router";
import {map} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {DateTime} from "luxon";

@Component({
  selector: 'section[path="/blog"]',
  template: `
      <article class="px-center md:pt-56 pt-24 pb-24">
          <header class="font-serif font-bold text-4xl mb-16">
              <h1 translate="pages.blog.title"></h1>
          </header>

          <div class="lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 grid">
              <a *ngFor="let article of articles" [routerLink]="[article.slug]">
                  <figure class="hover:shadow-lg hover:bg-brown transition-all shadow group p-1">
                      <picture class="contents">
                          <source srcset="/assets/images/landing/splash/eberhard-grossgasteiger-kD3NrRWlV6A-unsplash-2986.jpg"
                                  media="(min-width: 2986px)">
                          <source srcset="/assets/images/landing/splash/eberhard-grossgasteiger-kD3NrRWlV6A-unsplash-2400.jpg"
                                  media="(min-width: 2400px)">
                          <source srcset="/assets/images/landing/splash/eberhard-grossgasteiger-kD3NrRWlV6A-unsplash-1920.jpg"
                                  media="(min-width: 1920px)">
                          <source srcset="/assets/images/landing/splash/eberhard-grossgasteiger-kD3NrRWlV6A-unsplash-640.jpg"
                                  media="(min-width: 640px)">
                          <img src="/assets/images/landing/splash/eberhard-grossgasteiger-kD3NrRWlV6A-unsplash-640.jpg"
                               class="group-hover:scale-105 group-hover:-rotate-3 transition-all aspect-square w-full block"
                               [alt]="'alt.landing.splash' | translate">
                      </picture>
                      <figcaption class="group-hover:text-white transition-all mt-4">
                          <strong>{{ article.title }}</strong>
                          <p>{{ article.description.replace('\\\\f', '') }}</p>
                          <small [innerHTML]="'pages.article.authorship' | translate:{authors: getAuthors(article), date: getDate(article)}"
                             class="group-hover:text-grey-300 text-grey-500 italic mt-4"></small>
                      </figcaption>
                  </figure>
              </a>
          </div>
      </article>
  `,
})
export class BlogComponent implements OnInit {
  protected articles: Article[] = [];

  constructor(meta: Meta,
              i18nService: I18nService,
              private readonly destroyRef: DestroyRef,
              private readonly activatedRoute: ActivatedRoute,
              @Inject(ALTERNATES) alternates: Record<string, string>[],
              @Inject(LANGUAGE_TAG) private readonly languageTag: Signal<string>) {
    let alternate: typeof alternates[0];
    const description = i18nService.fetch('pages.blog.description');
    effect(() => meta.updateTag({property: 'og:description', content: description()!}));
    destroyRef.onDestroy(() => alternates.splice(alternates.indexOf(alternate), 1));
    setTimeout(() => alternates.push(alternate = LANGUAGES
        .filter(({tag}) => tag !== languageTag())
        .reduce((_, {tag}) => ({..._, [tag]: '/' + routes.blog(tag)}), {})));
  }

  ngOnInit() {
    this.activatedRoute.data
        .pipe(map(({articles}) => articles as Article[]))
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          error: err => console.error(err),
          next: articles => this.articles = articles,
        });
  }

  protected getAuthors(article: Article): string {
    return article.authors.join(', ');
  }

  protected getDate(article: Article): string {
    return DateTime.fromISO(article.publishedAt!).setLocale(this.languageTag()).toFormat('dd LLL yyyy');
  }
}
