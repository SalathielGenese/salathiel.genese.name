import {Component} from "@angular/core";

@Component({
    host: {'[class]': `'place-items-center backdrop-blur-sm h-[var(--nav-h)] justify-center bg-white/50 w-full left-0 fixed top-0 z-10 flex'`},
    selector: 'nav[sg-nav]',
    template: `
        <span>A</span>
        <hr class="flex-grow">
        <span>Z</span>
    `,
})
export class NavComponent {
}
