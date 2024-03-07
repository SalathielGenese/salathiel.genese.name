import {ChangeDetectorRef, effect, EffectRef, Inject, Injector, Pipe, PipeTransform, Signal} from "@angular/core";
import {I18nService} from "../services/i18n.service";
import {LANGUAGE_TAG} from "../token";

@Pipe({
  pure: false,
  name: 'translate',
})
export class TranslatePipe implements PipeTransform {
  #context = {} as Record<string, any>;
  #valueWithContext?: string;
  #fetchEffect?: EffectRef;
  #languageTag?: string;
  #value?: string;
  #key?: string;

  constructor(private readonly injector: Injector,
              private readonly i18nService: I18nService,
              private readonly changeDetectorRef: ChangeDetectorRef,
              @Inject(LANGUAGE_TAG) private readonly languageTag: Signal<string>) {
  }

  transform(key: string, languageTagOrContext?: string | Record<string, any> & {
    ['@languageTag']?: string;
  }): undefined | string {
    const languageTag = 'string' === typeof languageTagOrContext ? languageTagOrContext : languageTagOrContext?.['$$languageTag'];
    this.#context = 'string' === typeof languageTagOrContext ? {} : {
      $$languageTag: languageTag ?? this.languageTag(),
      ...languageTagOrContext ?? {},
    };
    this.#applyContext();

    if (this.#key !== key || this.#languageTag !== languageTag) {
      const fetch = this.i18nService.fetch(key, languageTag);
      [this.#languageTag, this.#key] = [languageTag, key];
      this.#fetchEffect?.destroy();

      if (this.#value !== fetch()) {
        this.#value = fetch();
        this.#applyContext();
      }

      this.#fetchEffect = effect(() => {
        if (this.#value !== fetch()) {
          this.#value = fetch();
          this.#applyContext();
        }
      }, {injector: this.injector});
    }

    return this.#valueWithContext;
  }

  #applyContext() {
    this.changeDetectorRef.markForCheck();
    this.#valueWithContext = this.#value
        ?.replace(/{{([a-zA-Z$_][a-zA-Z0-9$_]*)}}/g, (placeholder, key) => this.#context[key] ?? placeholder);
  }
}
