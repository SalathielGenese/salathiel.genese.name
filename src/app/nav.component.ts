import {Component, Inject, Signal} from "@angular/core";
import {LANGUAGE_TAG} from "./token";

@Component({
  host: {'[class]': `'backdrop-blur text-black w-full fixed py-4 z-10 flex'`},
  selector: 'nav[sg-nav]',
  template: `
      <a class="text-grey-500 bg-grey-100 origin-center -rotate-45 text-center -left-16 fixed w-48"
         href="https://github.com/SalathielGenese/salathiel.genese.name"
         target="_blank">
          <small>GitHub</small>
      </a>
      <a class="font-serif sm:pr-8 sm:py-4 pr-4 py-2"
         routerLinkActive="font-extrabold drop-shadow-md"
         [routerLinkActiveOptions]="{exact: true}"
         [routerLink]="[languageTag()]"
         translate="pages.home.title"
      ></a>
      <hr class="pointer-events-none opacity-0 flex-grow">
      <a routerLinkActive="font-extrabold drop-shadow-md"
         class="lowercase sm:px-8 sm:py-4 px-4 py-2"
         [routerLink]="[languageTag(), 'blog']"
         translate="pages.blog.title"
      ></a>
      <a class="border-white text-white lowercase bg-brown rounded border sm:my-3 shadow px-4 py-0.5 my-1.5"
         routerLinkActive="font-extrabold drop-shadow-md"
         [routerLink]="[languageTag(), 'hire']"
         translate="pages.hire.title"
      ></a>
  `,
})
export class NavComponent {
  constructor(@Inject(LANGUAGE_TAG) protected readonly languageTag: Signal<string>) {
  }
}
