import {Component, OnDestroy} from "@angular/core";
import {faBarsStaggered} from "@fortawesome/free-solid-svg-icons/faBarsStaggered";

@Component({
    host: {'[class]': `'place-items-center backdrop-blur-sm h-[var(--nav-h)] justify-center bg-white/50 w-full left-0 fixed top-0 z-10 flex'`},
    selector: 'nav[sg-nav]',
    template: `
        <a routerLink="/" class="whitespace-nowrap py-3 pr-5">
            Salathiel
        </a>
        <hr class="opacity-0 flex-grow">
        <a routerLink="/hire" class="whitespace-nowrap sm:hidden rounded-full text-white bg-brown border py-1 px-5">
            hire
        </a>
        <button (click)="show()" (mouseenter)="show()" (mouseleave)="hide()" class="sm:hidden py-3 px-5">
            <fa-icon [icon]="faBarsStaggered"></fa-icon>
        </button>
        <div role="menu"
             (mouseleave)="hide()"
             [class.opacity-0]="!visible"
             [class.opacity-100]="visible"
             (mouseenter)="visible && show()"
            [class.max-sm:pointer-events-none]="!visible"
             class="after:content-[''] after:absolute after:sm:opacity-0 after:right-4
                    after:transition-all after:opacity-100 after:transition after:border-8
                    after:border-b-transparent after:border-r-transparent after:origin-top-right after:rotate-45
                    sm:pointer-events-auto backdrop-blur bg-white/80 absolute rounded flex-col right-8 border flex
                    right-[calc(50vw-var(--max-width)/2)] top-[calc(50%+2rem)] transition-all transition sm:contents">
            <a routerLink="/blog" class="whitespace-nowrap py-3 px-5">
                BLOG
            </a>
            <a routerLink="/portfolio" class="whitespace-nowrap py-3 px-5">
                PORTFOLIO
            </a>
        </div>
        <a routerLink="/hire"
           class="whitespace-nowrap rounded-full text-white bg-brown sm:block text-sm border hidden py-2 px-5">
            hire
        </a>
    `,
})
export class NavComponent implements OnDestroy {
    protected readonly faBarsStaggered = faBarsStaggered;
    protected visible = false;

    #handle: any;

    ngOnDestroy() {
        clearTimeout(this.#handle);
    }

    protected hide() {
        this.#handle = setTimeout(() => this.visible = false, 700);
    }

    protected show() {
        this.visible = true;
        clearTimeout(this.#handle);
    }
}
