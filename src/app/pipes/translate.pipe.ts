import {ChangeDetectorRef, effect, EffectRef, Injector, Pipe, PipeTransform} from "@angular/core";
import {I18nService} from "../services/i18n.service";

@Pipe({
  pure: false,
  name: 'translate',
})
export class TranslatePipe implements PipeTransform {
  #fetchEffect?: EffectRef;
  #languageTag?: string;
  #value?: string;
  #key?: string;

  constructor(private readonly injector: Injector,
              private readonly i18nService: I18nService,
              private readonly changeDetectorRef: ChangeDetectorRef) {
  }

  transform(key: string, languageTag?: string): undefined | string {
    if (this.#key !== key || this.#languageTag !== languageTag) {
      const fetch = this.i18nService.fetch(key, languageTag);
      [this.#languageTag, this.#key] = [languageTag, key];
      this.#fetchEffect?.destroy();

      if (this.#value !== fetch()) {
        this.changeDetectorRef.markForCheck();
        this.#value = fetch();
      }

      this.#fetchEffect = effect(() => {
        if (this.#value !== fetch()) {
          this.changeDetectorRef.markForCheck();
          this.#value = fetch();
        }
      }, {injector: this.injector});
    }

    return this.#value;
  }
}
