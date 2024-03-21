import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ActivatedRoute, TitleStrategy} from "@angular/router";
import {Meta, Title} from "@angular/platform-browser";
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  Inject,
  InjectionToken,
  Injector,
  OnInit,
  Signal,
  ViewChild
} from "@angular/core";
import {DateTime} from "luxon";

import {map} from "rxjs";

import {SalathielTitleStrategy} from "../services/salathiel.title-strategy";
import {Article} from "../services/article.service";
import {ALTERNATES, LANGUAGE_TAG, TableOfContentEntry, TOC} from "../token";
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
                  <p [innerHTML]="'pages.article.authorship' | translate:{authors: getAuthors(article), date: getDate(article)}"
                     class="text-grey-500 italic mt-4"
                     *ngIf="article">
                  </p>
              </hgroup>
          </header>

          <div [textContent]="article.description.replace('\\\\f', '')"
               *ngIf="article"
               class="my-8"
               markdown
          ></div>

          <h2 translate="pages.article.table-of-content" class="font-bold text-2xl mt-24 mb-8"></h2>

          <nav class="border-l-4 shadow rounded text-sm ml-6 p-2" role="navigation">
              <ol *ngFor="let entry of tableOfContentEntries ?? []"
                  class="">
                  <li class="py-1">
                      <a [href]="entry.anchor" [innerHTML]="entry.content"></a>
                  </li>
                  <li *ngIf="entry.children?.length">
                      <ol class="pl-4">
                          <li *ngFor="let entry of entry.children ?? []" class="py-1">
                              <a [href]="entry.anchor" [innerHTML]="entry.content"></a>
                          </li>
                      </ol>
                  </li>
              </ol>
          </nav>

          <div class="[&_blockquote]:border-l-4 [&_blockquote]:shadow [&_blockquote]:rounded [&_blockquote]:ml-6 [&_blockquote]:my-6  [&_blockquote]:p-2
                      [&_p_a]:decoration-grey-400/60 [&_p_a]:underline-offset-4 [&_p_a]:decoration-dashed [&_p_a]:decoration-1 [&_p_a]:underline
                      [&_code]:bg-grey-400 [&_code]:rounded-sm [&_code]:text-sm [&_code]:pb-0.5 [&_code]:pt-1 [&_code]:px-1
                      [&>h2]:font-bold [&>h2]:text-2xl [&>h2]:mt-24 [&>h2]:mb-8
                      [&>h3]:font-bold [&>h3]:text-xl [&>h3]:mt-12 [&>h3]:mb-6
                      [&_p]:my-4
                      pb-24"
               [innerHTML]="article.content | markdown:{decodeHtml:true}"
               *ngIf="article"
               #content
          ></div>
      </article>
  `,
})
export class ArticleComponent implements OnInit, AfterViewChecked {
  protected tableOfContentEntries?: TableOfContentEntry[];
  protected readonly titleStrategy: TitleStrategy;
  protected alternate?: Record<string, string>;
  protected article?: Article;

  @ViewChild('content')
  protected contentRef?: ElementRef<HTMLDivElement>;

  #content?: string;

  constructor(title: Title,
              injector: Injector,
              private readonly meta: Meta,
              private readonly destroyRef: DestroyRef,
              private readonly activatedRoute: ActivatedRoute,
              private readonly changeDetectorRef: ChangeDetectorRef,
              @Inject(LANGUAGE_TAG) private readonly languageTag: Signal<string>,
              @Inject(ALTERNATES) private readonly alternates: Record<string, string>[],
              @Inject(TOC) private readonly toc: typeof TOC extends InjectionToken<infer I> ? I : never) {
    destroyRef.onDestroy(() => this.#removeAlternate());
    this.titleStrategy = new class extends SalathielTitleStrategy {
      constructor() {
        super(destroyRef, meta, title, injector);
      }

      override buildTitle(): string | undefined {
        return `\f${self.article?.title}`;
      }
    }();
    effect(() => this.tableOfContentEntries = toc());
    const self = this;
  }

  ngOnInit() {
    this.meta.updateTag({property: 'og:type', content: 'article'});
    this.activatedRoute.data
        .pipe(map(({article}) => article as Article))
        .pipe(takeUntilDestroyed(this.destroyRef))
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

  ngAfterViewChecked() {
    if (this.#content !== this.article?.content) {
      if (this.contentRef?.nativeElement) {
        this.toc.set(this.contentRef.nativeElement);
      } else {
        this.tableOfContentEntries = [];
      }
      this.changeDetectorRef.detectChanges();
      this.#content = this.article?.content;
    }
  }

  protected getAuthors(article: Article): string {
    return article.authors.join(', ');
  }

  protected getDate(article: Article): string {
    return DateTime.fromISO(article.publishedAt!).setLocale(this.languageTag()).toFormat('dd LLL yyy');
  }

  #removeAlternate() {
    return this.alternate && this.alternates.splice(this.alternates.indexOf(this.alternate), 1);
  }
}
