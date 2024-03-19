import {Component, DestroyRef, Inject, Injector, OnInit, Signal} from "@angular/core";
import {ActivatedRoute, TitleStrategy} from "@angular/router";
import {Meta, Title} from "@angular/platform-browser";
import {DateTime} from "luxon";

import {map} from "rxjs";

import {SalathielTitleStrategy} from "../services/salathiel.title-strategy";
import {Article} from "../services/article.service";
import {ALTERNATES, LANGUAGE_TAG, PATH, TO_ANCHOR} from "../token";
import {LANGUAGES} from "../../constant";
import {routes} from "../routes";

@Component({
  selector: 'section[path="/blog/:slug"]',
  template: `
      <article class="px-center md:pt-56 pt-24 pb-24">
          <header class="mb-16">
              <hgroup class="contents">
                  <h1 class="font-serif font-bold text-4xl">
                      {{ article?.title }}
                  </h1>
                  <p class="text-grey-500 italic mt-4">
                      {{ DateTime.fromISO(article?.publishedAt!).setLocale(languageTag()).toFormat('yyyy LLL dd') }} @
                      <ng-container *ngFor="let author of article?.authors ?? [];let last = last;">
                          <strong>{{ author }}</strong>
                          <span>{{ last ? '' : ' · ' }}</span>
                      </ng-container>
                  </p>
              </hgroup>
          </header>

          <ol *ngIf="article" class="mb-8">
              <li *ngFor="let heading of headingLines(article?.content)"
                  [ngClass]="{'ml-4': 3 === heading.level, 'ml-8': 4 === heading.level, 'ml-12': 5 === heading.level}">
                  <a [href]="path() + '#' + toAnchor(heading.content)">
                      {{ heading.content }}
                  </a>
              </li>
          </ol>

          <div markdown [textContent]="article?.content"></div>

          <footer *ngIf="article" class="mt-24">
              <ul>
                  <li *ngFor="let footnote of article.content.match(FOOTNOTE_REGEX)">
                      <sup>[{{ footnote.replace(FOOTNOTE_REGEX, '$1') }}]</sup>
                      <small> {{ footnote.replace(FOOTNOTE_REGEX, '$2') }}</small>
                  </li>
              </ul>
          </footer>
      </article>
  `,
})
export class ArticleComponent implements OnInit {
  protected readonly FOOTNOTE_REGEX = /\[\^(\d+)]: (.+)/gm;
  protected readonly titleStrategy: TitleStrategy;
  protected alternate?: Record<string, string>;
  protected readonly DateTime = DateTime;
  protected article?: Article;

  constructor(title: Title,
              injector: Injector,
              destroyRef: DestroyRef,
              private readonly meta: Meta,
              private readonly activatedRoute: ActivatedRoute,
              @Inject(PATH) protected readonly path: () => string,
              @Inject(LANGUAGE_TAG) protected readonly languageTag: Signal<string>,
              @Inject(TO_ANCHOR) protected readonly toAnchor: (text: string) => string,
              @Inject(ALTERNATES) private readonly alternates: Record<string, string>[]) {
    destroyRef.onDestroy(() => this.#removeAlternate());
    this.titleStrategy = new class extends SalathielTitleStrategy {
      constructor() {
        super(destroyRef, meta, title, injector);
      }

      override buildTitle(): string | undefined {
        return `\f${self.article?.title}`;
      }
    }();
    const self = this;
  }

  ngOnInit() {
    this.meta.updateTag({property: 'og:type', content: 'article'});
    this.activatedRoute.data
        .pipe(map(({article}) => article as Article))
        .subscribe({
          error: err => console.error(err),
          next: article => {
            this.article = article;
            this.titleStrategy.updateTitle(null as any);
            this.meta.updateTag({property: 'og:description', content: article.description});
            this.meta.updateTag({property: 'article:published_time', content: article.publishedAt});
            this.meta.updateTag({property: 'article:author', content: 'https://x.com/SalathielGenese'});
            this.meta.updateTag({property: 'article:publisher', content: 'https://x.com/SalathielGenese'});
            this.#removeAlternate();
            this.alternate = LANGUAGES
                .filter(({tag}) => tag !== this.languageTag() && tag in (article.alternates ?? {}))
                .reduce((_, {tag}) => ({..._, [tag]: '/' + routes.article(tag, article.alternates?.[tag])}), {});
            this.alternates.push(this.alternate);
          },
        });
  }

  protected headingLines(content = '') {
    return content.split(/(?:\r?\n)+/gm)
        .filter(line => line.match(/^#+\s*\S.*$/))
        .map(line => ({
          content: line.replace(/^#+\s*/g, ''),
          level: line.replace(/^(#+)(.*)$/g, '$1').length,
        }) as const);
  }

  #removeAlternate() {
    return this.alternate && this.alternates.splice(this.alternates.indexOf(this.alternate), 1);
  }
}
