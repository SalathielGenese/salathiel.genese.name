import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Request} from "express";
import {Inject, Injectable, Optional, PLATFORM_ID} from "@angular/core";
import {REQUEST} from "@nguniversal/express-engine/tokens";
import {isPlatformBrowser} from "@angular/common";

@Injectable()
export class TargetInterceptor implements HttpInterceptor {
  readonly #origin: string;

  constructor(@Inject(REQUEST) @Optional() request: Request,
              @Inject(PLATFORM_ID) platformId: object) {
    if (request) {
      const {
        'x-forwarded-proto': protocol,
        'x-forwarded-host': host,
      } = request.headers;
      this.#origin = `${protocol}://${host}`;
    } else if (isPlatformBrowser(platformId)) {
      this.#origin = location.origin;
    } else {
      this.#origin = 'un://resolved';
    }
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.url.startsWith('@api/')) {
      req = req.clone({
        url: `${this.#origin}/~/${req.url.substring(5)}`,
      });
    }

    return next.handle(req);
  }
}
