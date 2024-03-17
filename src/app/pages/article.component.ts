import {Component, DestroyRef, Inject, Injector, OnInit, Signal} from "@angular/core";
import {ActivatedRoute, TitleStrategy} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {DateTime} from "luxon";

import {map} from "rxjs";

import {SalathielTitleStrategy} from "../services/salathiel.title-strategy";
import {Article} from "../services/article.service";
import {LANGUAGE_TAG} from "../token";

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
  protected readonly DateTime = DateTime;
  protected article?: Article;

  constructor(title: Title,
              injector: Injector,
              destroyRef: DestroyRef,
              titleStrategy: TitleStrategy,
              private readonly activatedRoute: ActivatedRoute,
              @Inject(LANGUAGE_TAG) protected readonly languageTag: Signal<string>) {
    this.titleStrategy = new class extends SalathielTitleStrategy {
      constructor() {
        super(destroyRef, title, injector);
      }

      override buildTitle(): string | undefined {
        return `\f${self.article?.title}`;
      }
    }();
    const self = this;
  }

  ngOnInit() {
    this.activatedRoute.data
        .pipe(map(({article}) => article as Article))
        .subscribe({
          error: err => console.error(err),
          next: article => {
            this.article = article;
            this.titleStrategy.updateTitle(null as any);
          },
        });
  }
}
