import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  Inject,
  PLATFORM_ID,
  Signal,
  ViewChild
} from "@angular/core";
import {ALTERNATES, LANGUAGE_TAG, TableOfContentEntry, TOC} from "../token";
import {LANGUAGES} from "../../constant";
import {routes} from "../routes";
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'section[path="/editor"]',
  template: `
      <article class="md:pt-56 pt-24 pb-24">
          <header class="px-center mb-16">
              <h1 class="text-center font-serif font-bold text-4xl" translate="pages.editor.title"></h1>
          </header>

          <div class="max-md:grid-rows-2 md:grid-cols-2 gap-4 grid p-4">
              <textarea class="disabled:bg-white/0 transition-all bg-white/30 shadow p-2"
                        (ngModelChange)="updateTableOfContent()"
                        [disabled]="disabled"
                        [(ngModel)]="data"
                        rows="15"
              ></textarea>
              <article class="shadow">
                  <nav class="border-l-2 p-2" role="navigation">
                      <h2 translate="pages.article.table-of-content" class="font-bold text-2xl mb-8"></h2>
                      <ol *ngFor="let entry of tableOfContentEntries ?? []"
                          class="text-sm">
                          <li class="py-1">
                              <a [href]="entry.anchor" [innerHTML]="entry.content"></a>
                          </li>
                          <li *ngIf="entry.children?.length">
                              <ol class="pl-4">
                                  <li *ngFor="let entry of entry.children ?? []" class="py-1">
                                      <a [href]="entry.anchor" [innerHTML]="entry.content"></a>
                                  </li>
                              </ol>
                          </li>
                      </ol>
                  </nav>

                  <div class="[&_blockquote]:border-l-4 [&_blockquote]:shadow [&_blockquote]:rounded [&_blockquote]:ml-6 [&_blockquote]:my-6  [&_blockquote]:p-2
                      [&_p_a]:decoration-grey-400/60 [&_p_a]:underline-offset-4 [&_p_a]:decoration-dashed [&_p_a]:decoration-1 [&_p_a]:underline
                      [&_code]:bg-grey-400 [&_code]:rounded-sm [&_code]:text-sm [&_code]:pb-0.5 [&_code]:pt-1 [&_code]:px-1
                      [&>h2]:font-bold [&>h2]:text-2xl [&>h2]:mt-24 [&>h2]:mb-8
                      [&>h3]:font-bold [&>h3]:text-xl [&>h3]:mt-12 [&>h3]:mb-6
                      [&_p]:my-4
                      pb-24"
                       [data]="data"
                       *ngIf="data"
                       markdown
                       #content
                  ></div>
              </article>
          </div>
      </article>
  `,
})
export class EditorComponent {
  protected tableOfContentEntries?: TableOfContentEntry[];
  protected disabled = true;
  protected data?: string;

  @ViewChild('content', {read: ElementRef})
  protected contentRef?: ElementRef<HTMLDivElement>;

  #alternate?: Record<string, string>;
  #handle: any;

  constructor(destroyRef: DestroyRef,
              @Inject(PLATFORM_ID) platformId: object,
              @Inject(LANGUAGE_TAG) languageTag: Signal<string>,
              private readonly changeDetectorRef: ChangeDetectorRef,
              @Inject(ALTERNATES) alternates: Record<string, string>[],
              @Inject(TOC) private readonly toc: (ref: HTMLDivElement) => TableOfContentEntry[]) {
    if (isPlatformBrowser(platformId)) {
      setTimeout(() => this.disabled = false, 3_000);
    }

    setTimeout(() => alternates.push(this.#alternate = LANGUAGES
        .filter(({tag}) => tag !== languageTag())
        .reduce((_, {tag}) => ({..._, [tag]: '/' + routes.editor(tag)}), {})));
    destroyRef.onDestroy(() => this.#alternate && alternates.splice(alternates.indexOf(this.#alternate), 1));
  }

  protected updateTableOfContent() {
    clearTimeout(this.#handle);
    this.#handle = setTimeout(() => {
      if (this.contentRef?.nativeElement) {
        this.tableOfContentEntries = this.toc(this.contentRef.nativeElement);
      }
    }, 350);
  }
}
