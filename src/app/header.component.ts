import {Component, HostBinding, Signal} from "@angular/core";
import {AppModule} from "./app.module";

@Component({
    selector: 'header[sg-header]',
    template: `
        Header [{{home()}}]
    `,
})
export class HeaderComponent {
    protected readonly home: Signal<boolean>;

    constructor(appModule: AppModule) {
        this.home = appModule.home;
    }

    @HostBinding('class.min-h-[50vh]')
    protected get notHomeHeight() {
        return !this.home();
    }

    @HostBinding('class.min-h-[calc(100vh-var(--nav-h))]')
    protected get homeHeight() {
        return this.home();
    }
}
