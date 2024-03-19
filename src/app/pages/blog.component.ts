import {Component, effect, Inject, Signal} from "@angular/core";
import {LANGUAGE_TAG} from "../token";
import {routes} from "../routes";
import {Meta} from "@angular/platform-browser";
import {I18nService} from "../services/i18n.service";

@Component({
  selector: 'section[path="/blog"]',
  template: `
      <article class="px-center md:pt-56 pt-24 pb-24">
          <header class="font-serif font-bold text-4xl mb-16">
              <h1 translate="pages.blog.title"></h1>
          </header>

          <div class="lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 grid">
              <a [routerLink]="['lorem-ipsum-dolor-sit-amet-consectetur-adipisicing-elit']"
                 *ngFor="let art of range(32)">
                  <figure class="hover:shadow-lg hover:bg-brown transition-all shadow group p-1">
                      <picture class="contents">
                          <source srcset="/assets/images/landing/splash/eberhard-grossgasteiger-kD3NrRWlV6A-unsplash-2986.jpg"
                                  media="(min-width: 2986px)">
                          <source srcset="/assets/images/landing/splash/eberhard-grossgasteiger-kD3NrRWlV6A-unsplash-2400.jpg"
                                  media="(min-width: 2400px)">
                          <source srcset="/assets/images/landing/splash/eberhard-grossgasteiger-kD3NrRWlV6A-unsplash-1920.jpg"
                                  media="(min-width: 1920px)">
                          <source srcset="/assets/images/landing/splash/eberhard-grossgasteiger-kD3NrRWlV6A-unsplash-640.jpg"
                                  media="(min-width: 640px)">
                          <img src="/assets/images/landing/splash/eberhard-grossgasteiger-kD3NrRWlV6A-unsplash-640.jpg"
                               class="group-hover:scale-105 group-hover:-rotate-3 transition-all aspect-square w-full block"
                               [alt]="'alt.landing.splash' | translate">
                      </picture>
                      <figcaption class="group-hover:text-white transition-all mt-4">
                          <p>
                              Lorem ipsum dolor sit amet, consectetur adipisicing elit
                          </p>
                      </figcaption>
                  </figure>
              </a>
          </div>
      </article>
  `,
})
export class BlogComponent {
  protected readonly routes = routes;

  constructor(meta: Meta,
              i18nService: I18nService,
              @Inject(LANGUAGE_TAG) protected readonly languageTag: Signal<string>) {
    const description = i18nService.fetch('pages.hire.description');
    effect(() => meta.updateTag({property: 'og:description', content: description()!}));
  }

  protected range(n: number) {
    return [...Array(n)];
  }
}
