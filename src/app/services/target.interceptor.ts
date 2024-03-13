import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Request} from "express";
import {Inject, Injectable, Optional, PLATFORM_ID} from "@angular/core";
import {REQUEST} from "@nguniversal/express-engine/tokens";
import {isPlatformBrowser} from "@angular/common";

@Injectable()
export class TargetInterceptor implements HttpInterceptor {
  readonly #origin!: string;

  constructor(@Inject(REQUEST) @Optional() request: Request,
              @Inject(PLATFORM_ID) platformId: object) {
    if (request) {
      const {headers: {'x-forwarded-host': xForwardedHost, host}, protocol} = request;
      this.#origin = `${protocol}://${xForwardedHost ?? host}`;
    } else if (isPlatformBrowser(platformId)) {
      this.#origin = location.origin;
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
