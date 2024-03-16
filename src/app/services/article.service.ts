import {Inject, Injectable, Signal} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, delay, map, Observable, of} from "rxjs";
import {LANGUAGE_TAG} from "../token";

@Injectable()
export class ArticleService {
  constructor(private readonly http: HttpClient,
              @Inject(LANGUAGE_TAG) private readonly languageTag: Signal<string>) {
  }

  find(slug: string): Observable<Article> {
    return this.http.get<{ content: Article }>(`@api/articles/${slug}`)
        .pipe(map(({content}) => content))
        // TODO: Remove after implementation
        .pipe(delay(3_000))
        .pipe(catchError((err, caught) => of({
          title: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
          id: '3ab0a72d-4b7b-4a9e-b953-202a3afb3910',
          languageTag: this.languageTag(),
          content: `
Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi at, debitis et facere, fugiat id in ipsa
ipsum laudantium molestiae natus nihil numquam pariatur quod sapiente similique voluptatum. Omnis, quidem.

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet architecto aspernatur at delectus eligendi
in iure laborum maiores maxime mollitia officiis, perspiciatis quis reprehenderit sapiente sed sit unde
voluptate, voluptates.

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id libero nostrum rem similique tenetur ut vero.
Alias consequuntur cumque, cupiditate minima nam neque nisi, nobis omnis placeat quod repellat totam!

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius eum fugit id impedit libero magnam maxime,
nam non nostrum numquam, perferendis quo repellat temporibus vero voluptatibus. Eligendi expedita
praesentium recusandae.`,
          slug,
        })));
  }
}

export interface Article {
  languageTag: string;
  content: string;
  title: string;
  slug: string;
  id: string;
}
