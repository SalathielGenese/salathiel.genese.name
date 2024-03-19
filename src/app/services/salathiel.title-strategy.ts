import {DestroyRef, effect, EffectRef, Injectable, Injector, signal, Signal} from "@angular/core";
import {RouterStateSnapshot, TitleStrategy} from "@angular/router";
import {Meta, Title} from "@angular/platform-browser";
import {I18nService} from "./i18n.service";

@Injectable()
export class SalathielTitleStrategy extends TitleStrategy {
  #i18nService?: I18nService;
  #effectRef?: EffectRef;

  constructor(destroyRef: DestroyRef,
              private readonly meta: Meta,
              private readonly title: Title,
              private readonly injector: Injector) {
    super();
    destroyRef.onDestroy(() => this.#effectRef?.destroy());
  }

  override updateTitle(snapshot: RouterStateSnapshot) {
    this.#effectRef?.destroy();
    this.#i18nService ??= this.injector.get(I18nService);
    const common = this.#i18nService.fetch('pages.home.title');
    (title => {
      if (title) {
        const fetch = title.startsWith('\f')
            ? signal(title.substring(1))
            : this.#i18nService.fetch(`${title}`);
        this.#effectRef = effect(() => this.#setTitle(fetch, common), {injector: this.injector});
        this.#setTitle(fetch, common);
      }
    })(this.buildTitle(snapshot));
  }

  #setTitle(fetch: Signal<string | undefined>, common: Signal<string | undefined>) {
    const title = [fetch(), common()]
        .filter((_, i, __) => _ && i === __.indexOf(_))
        .join(' · ');
    this.meta.updateTag({property: 'og:title', content: title});
    this.title.setTitle(title);
  }
}
