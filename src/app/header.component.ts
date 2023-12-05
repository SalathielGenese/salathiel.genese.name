import {Component, Signal} from "@angular/core";
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
}
