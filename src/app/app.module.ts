import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

import {HeaderComponent as HComponent} from "./components/header.component";
import {NotFoundComponent} from "./pages/not-found.component";
import {AppRoutingModule} from './app-routing.module';
import {HomeComponent} from "./pages/home.component";
import {HeaderComponent} from "./header.component";
import {FooterComponent} from "./footer.component";
import {MainComponent} from './main.component';
import {NavComponent} from "./nav.component";

@NgModule({
    declarations: [
        HComponent,

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
