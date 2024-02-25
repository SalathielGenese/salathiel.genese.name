import {Component, Inject, Input} from "@angular/core";

@Component({
  selector: '[translate]',
  template: `{{ translate | translate }}`
})
export class TranslateComponent {
  @Input({required: true})
  translate!: string;
}
