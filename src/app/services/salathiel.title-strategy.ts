import {DestroyRef, effect, EffectRef, Injectable, Injector, signal} from "@angular/core";
import {RouterStateSnapshot, TitleStrategy} from "@angular/router";
import {Meta, Title} from "@angular/platform-browser";
import {I18nService} from "./i18n.service";
import {LANGUAGE_TAG, ORIGIN} from "../token";
import {LANGUAGES} from "../../constant";

@Injectable()
export class SalathielTitleStrategy extends TitleStrategy {
  #i18nService?: I18nService;
  #titleEffectRef?: EffectRef;
  #imageAltEffectRef?: EffectRef;
  #languageTagEffectRef?: EffectRef;

  constructor(destroyRef: DestroyRef,
              private readonly meta: Meta,
              private readonly title: Title,
              private readonly injector: Injector) {
    super();
    destroyRef.onDestroy(() => {
      this.#languageTagEffectRef?.destroy();
      this.#imageAltEffectRef?.destroy();
      this.#titleEffectRef?.destroy();
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot) {
    this.#i18nService ??= this.injector.get(I18nService);
    this.#updateOpenGraphForTitle(snapshot);
    this.#updateOpenGraphForLocale();
    this.#updateOpenGraphForImage();
  }

  #updateOpenGraphForTitle(snapshot: RouterStateSnapshot) {
    const common = this.#i18nService!.fetch('pages.home.title');
    const title = this.buildTitle(snapshot);

    if (title) {
      const fetch = title.startsWith('\f')
          ? signal(title.substring(1))
          : this.#i18nService!.fetch(`${title}`);
      this.#titleEffectRef?.destroy();
      this.#titleEffectRef = effect(() => {
        const title = [...new Set([fetch(), common()])].filter(_ => _).join(' · ');
        this.meta.updateTag({property: 'og:title', content: title});
        this.title.setTitle(title);
      }, {injector: this.injector});
    }
  }

  #updateOpenGraphForLocale() {
    this.#languageTagEffectRef?.destroy();
    this.#languageTagEffectRef = effect(() => {
      const languageTag = this.injector.get(LANGUAGE_TAG);
      this.meta.updateTag({property: 'og:locale', content: languageTag().replaceAll('-', '_')});
      LANGUAGES.forEach(() => {
        try {
          this.meta.removeTag('property=og:locale:alternate');
        } catch (ignored) {
        }
      });
      LANGUAGES
          .filter(({tag}) => tag !== languageTag())
          .forEach(({tag}) => this.meta.addTag({property: 'og:locale:alternate', content: tag.replaceAll('-', '_')}));
    }, {injector: this.injector});
  }

  #updateOpenGraphForImage() {
    const origin = this.injector.get(ORIGIN);
    this.meta.updateTag({property: 'og:image:width', content: '640'});
    this.meta.updateTag({property: 'og:image:height', content: '960'});
    this.meta.updateTag({property: 'og:image:type', content: 'image/jpeg'});
    this.meta.updateTag({
      property: 'og:image',
      content: origin() + '/assets/images/landing/splash/eberhard-grossgasteiger-kD3NrRWlV6A-unsplash-640.jpg'
    });
    this.meta.updateTag({
      property: 'og:image:url',
      content: origin() + '/assets/images/landing/splash/eberhard-grossgasteiger-kD3NrRWlV6A-unsplash-640.jpg'
    });

    const imageAlt = this.#i18nService!.fetch('alt.landing.splash');
    this.#imageAltEffectRef?.destroy();
    this.#imageAltEffectRef = effect(() =>
        this.meta.updateTag({property: 'og:image:alt', content: imageAlt()!}), {injector: this.injector});
  }
}
