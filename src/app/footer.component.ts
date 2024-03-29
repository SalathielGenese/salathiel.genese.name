import {Component, Inject, Signal} from "@angular/core";
import {faLinkedinIn} from "@fortawesome/free-brands-svg-icons/faLinkedinIn";
import {faFacebook} from "@fortawesome/free-brands-svg-icons/faFacebook";
import {faTwitter} from "@fortawesome/free-brands-svg-icons/faTwitter";
import {faGithub} from "@fortawesome/free-brands-svg-icons/faGithub";
import {faTiktok} from "@fortawesome/free-brands-svg-icons/faTiktok";
import {IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {COOKIE_LANGUAGE_TAG, LANGUAGES} from "../constant";
import {ALTERNATES, LANGUAGE_TAG} from "./token";
import {Router} from "@angular/router";
import {routes} from "./routes";

@Component({
  host: {'[class]': `'justify-items-center place-items-center snap-always snap-center bg-grey-800 min-h-[50vh] grid p-8'`},
  selector: 'footer[sg-footer]',
  template: `
      <div>
          <p class="text-center">
              <strong class="text-grey-600 font-extrabold">
                  © 2024
              </strong>
          </p>

          <ul class="text-grey-400 text-center block my-8">
              <li *ngFor="let social of socials" class="contents">
                  <a class="m-1 p-3" [href]="social.uri" target="_blank">
                      <fa-icon [icon]="social.icon" size="xl"></fa-icon>
                  </a>
              </li>
          </ul>

          <div class="text-center">
              <select class="disabled:text-grey-700 border-grey-700/50 bg-transparent text-grey-400 border p-1"
                      (change)="setLanguageTag(languageTagRef.value)"
                      [disabled]="!alternates.length"
                      #languageTagRef>
                  <option [selected]="language.tag === languageTag()"
                          *ngFor="let language of languages"
                          class="bg-grey-700"
                          [value]="language.tag">
                      {{ language.title }}
                  </option>
              </select>
          </div>
      </div>
  `,
})
export class FooterComponent {
  protected readonly socials: { icon: IconDefinition, uri: string }[] = [
    {icon: faGithub, uri: 'https://github.com/SalathielGenese'},
    {icon: faLinkedinIn, uri: 'https://www.linkedin.com/in/salathielgenese'},
    {icon: faTwitter, uri: 'https://x.com/@SalathielGenese'},
    {icon: faTiktok, uri: 'https://www.tiktok.com/@salathielgenese'},
    {icon: faFacebook, uri: 'https://www.facebook.com/SalathielGenese'},
  ];
  protected readonly languages = LANGUAGES;
  protected readonly routes = routes;

  constructor(private readonly router: Router,
              @Inject(LANGUAGE_TAG) protected readonly languageTag: Signal<string>,
              @Inject(ALTERNATES) protected readonly alternates: Record<string, string>[]) {
  }

  protected setLanguageTag(languageTag: string) {
    const {[languageTag]: target} = this.alternates.at(-1) ?? {};

    if (target) {
      this.router.navigateByUrl(target, {onSameUrlNavigation: 'reload'})
          .then(() => {
            document.cookie = `${COOKIE_LANGUAGE_TAG}=${languageTag};SameSite=Strict;Max-Age=0;`;
            document.cookie = `${COOKIE_LANGUAGE_TAG}=${languageTag};SameSite=Strict;Max-Age=${365 * 86_400};`;
          })
          .catch(err => console.error(err));
    }
  }
}
