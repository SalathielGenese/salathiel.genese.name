import {Component, Input} from "@angular/core";

@Component({
  selector: '[translate]',
  template: `{{ translate | translate:context }}`,
})
export class TranslateComponent {
  @Input({alias: 'translate-language-tag'})
  translateLanguageTag?: string;
  @Input({alias: 'translate-context'})
  translateContext?: Record<string, any>;
  @Input({required: true})
  translate!: string;

  protected get context() {
    return {
      ...this.translateContext ?? {},
      $$languageTag: this.translateLanguageTag,
    };
  }
}
