import {Component, HostBinding, Inject, Signal} from "@angular/core";
import {IS_HOME} from "./token";

@Component({
    selector: 'header[sg-header]',
    host: {'[class]': `'grid'`},
    template: `
        <ng-container *ngIf="home()">Home Header</ng-container>
        <ng-container *ngIf="!home()">
            <h1 class="text-grey-700 text-center relative md:py-8 w-full py-3">
                Other Header
            </h1>
        </ng-container>
    `,
})
export class HeaderComponent {
    constructor(@Inject(IS_HOME) protected readonly home: Signal<boolean>) {
    }

    @HostBinding('class.min-h-[calc(2*var(--nav-h))]')
    @HostBinding('class.justify-items-center')
    @HostBinding('class.place-items-end')
    @HostBinding('class.bg-brown/30')
    @HostBinding('class.font-bold')
    @HostBinding('class.text-xl')
    protected get notHomeClasses() {
        return !this.home();
    }

    @HostBinding('class.place-content-center')
    @HostBinding('class.min-h-screen')
    protected get homeClasses() {
        return this.home();
    }
}
