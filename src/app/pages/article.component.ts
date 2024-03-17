import {Component, DestroyRef, Injector, OnInit} from "@angular/core";
import {ActivatedRoute, TitleStrategy} from "@angular/router";
import {Article} from "../services/article.service";
import {map} from "rxjs";
import {SalathielTitleStrategy} from "../services/salathiel.title-strategy";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'section[path="/blog/:slug"]',
  template: `
      <article class="px-center md:pt-56 pt-36 pb-36">
          <header class="font-serif font-bold text-6xl mb-7">
              <h1>{{ article?.title }}</h1>
          </header>

          <div markdown [textContent]="article?.content"></div>
      </article>
  `,
})
export class ArticleComponent implements OnInit {
  protected readonly titleStrategy: TitleStrategy;
  protected article?: Article;

  constructor(title: Title,
              injector: Injector,
              destroyRef: DestroyRef,
              titleStrategy: TitleStrategy,
              private readonly activatedRoute: ActivatedRoute) {
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
