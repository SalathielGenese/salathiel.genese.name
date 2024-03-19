import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Inject, Injectable, Signal} from "@angular/core";
import {LANGUAGES} from "../../constant";
import {LANGUAGE_TAG, ORIGIN} from "../token";

@Injectable()
export class TargetInterceptor implements HttpInterceptor {
  readonly #origin!: string;

  constructor(@Inject(LANGUAGE_TAG) private readonly languageTag: Signal<string>,
              @Inject(ORIGIN) origin: () => string) {
    this.#origin = origin();
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const {url} = req;

    switch (true) {
      case url.startsWith('@api/i18n/'):
        const languageTag = LANGUAGES.find(({tag}) => url.startsWith(`@api/i18n/${tag}`))?.tag!;
        req = req.clone({
          url: `${this.#origin}/${languageTag}/~/i18n/${url.substring(11 + languageTag.length)}`,
        });
        break;
      case url.startsWith('@api/articles/'):
        req = req.clone({
          url: `${this.#origin}/${this.languageTag()}/~/articles/${url.substring(14)}`,
        });
        break;
      case url.startsWith('@api/'):
        req = req.clone({
          url: `${this.#origin}/${this.languageTag()}/~/${url.substring(5)}`,
        });
        break
    }

    return next.handle(req);
  }
}
