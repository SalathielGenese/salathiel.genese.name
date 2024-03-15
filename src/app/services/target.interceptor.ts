import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Request} from "express";
import {Inject, Injectable, Optional, PLATFORM_ID, Signal} from "@angular/core";
import {REQUEST} from "@nguniversal/express-engine/tokens";
import {isPlatformBrowser} from "@angular/common";
import {LANGUAGES} from "../../constant";
import {LANGUAGE_TAG} from "../token";

@Injectable()
export class TargetInterceptor implements HttpInterceptor {
  readonly #origin!: string;

  constructor(@Inject(LANGUAGE_TAG) private readonly languageTag: Signal<string>,
              @Inject(REQUEST) @Optional() request: Request,
              @Inject(PLATFORM_ID) platformId: object) {
    if (request) {
      const {headers: {'x-forwarded-host': xForwardedHost, origin, host}, protocol} = request;
      this.#origin = origin ?? `${protocol}://${xForwardedHost ?? host}`;
    } else if (isPlatformBrowser(platformId)) {
      this.#origin = location.origin;
    }
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
      case url.startsWith('@api/'):
        req = req.clone({
          url: `${this.#origin}/${this.languageTag()}/~/${url.substring(5)}`,
        });
        break
    }

    return next.handle(req);
  }
}
