import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {MainComponent} from './main.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NavComponent} from "./nav.component";
import {HeaderComponent} from "./header.component";
import {FooterComponent} from "./footer.component";
import {NotFoundComponent} from "./error/not-found.component";
import {HomeComponent} from "./home/home.component";

@NgModule({
    declarations: [
        NavComponent,
        MainComponent,
        HeaderComponent,
        FooterComponent,

        HomeComponent,
        NotFoundComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FontAwesomeModule
    ],
    providers: [],
    bootstrap: [
        NavComponent,
        MainComponent,
        HeaderComponent,
        FooterComponent,
    ]
})
export class AppModule {
}
