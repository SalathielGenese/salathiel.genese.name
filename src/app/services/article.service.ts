import {Inject, Injectable, Signal} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {LANGUAGE_TAG} from "../token";

@Injectable()
export class ArticleService {
  constructor(private readonly http: HttpClient,
              @Inject(LANGUAGE_TAG) private readonly languageTag: Signal<string>) {
  }

  find(slug: string): Observable<Article> {
    return this.http.get<{ content: Article }>(`@api/articles/${slug}`)
        .pipe(map(({content}) => content));
  }
}

export interface Article {
  alternates?: Record<string, string>;
  languageTag: string;
  publishedAt: string;
  description: string;
  authors: string[];
  content: string;
  title: string;
  slug: string;
  id: string;
}
