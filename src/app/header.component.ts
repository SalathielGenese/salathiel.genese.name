import {Component, HostBinding, Signal} from "@angular/core";
import {AppModule} from "./app.module";

@Component({
    selector: 'header[sg-header]',
    host: {'[class]': `'grid'`},
    template: `
        Header [{{home()}}]
    `,
})
export class HeaderComponent {
    protected readonly home: Signal<boolean>;

    constructor(appModule: AppModule) {
        this.home = appModule.home;
    }

    @HostBinding('class.min-h-[calc(2*var(--nav-h))]')
    @HostBinding('class.justify-items-center')
    @HostBinding('class.place-items-end')
    @HostBinding('class.bg-brown/30')
    protected get notHomeClasses() {
        return !this.home();
    }

    @HostBinding('class.place-content-center')
    @HostBinding('class.min-h-screen')
    protected get homeClasses() {
        return this.home();
    }
}
