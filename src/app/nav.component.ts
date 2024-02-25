import {Component, Inject, Signal} from "@angular/core";
import {LANGUAGE_TAG} from "./token";

@Component({
  host: {'[class]': `'backdrop-blur lowercase w-full fixed py-4 z-10 flex'`},
  selector: 'nav[sg-nav]',
  template: `
      <a class="text-grey-400 bg-grey-100 origin-center -rotate-45 text-center normal-case -left-16 fixed w-48"
         href="https://github.com/SalathielGenese/salathiel.genese.name"
         target="_blank">
          <small>GitHub</small>
      </a>
      <a class="sm:pr-8 sm:py-4 pr-4 py-2"
         [routerLink]="[languageTag()]">
          {{ 'pages.home.title' | translate }}
      </a>
      <hr class="pointer-events-none opacity-0 flex-grow">
      <a [routerLink]="[languageTag(), 'blog']"
         class="sm:px-8 sm:py-4 px-4 py-2">
          Blog
      </a>
      <a class="border-white text-white bg-brown rounded border sm:my-3 shadow px-4 py-0.5 my-1.5"
         [routerLink]="[languageTag(), 'hire']">
          Hire
      </a>
  `,
})
export class NavComponent {
  constructor(@Inject(LANGUAGE_TAG) protected readonly languageTag: Signal<string>) {
  }
}
