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
import {BlogComponent} from "./pages/blog.component";
import {PortfolioComponent} from "./pages/portfolio.component";
import {HireComponent} from "./pages/hire.component";

@NgModule({
    declarations: [
        HComponent,

        NavComponent,
        MainComponent,
        HeaderComponent,
        FooterComponent,

        HomeComponent,
        HireComponent,
        BlogComponent,
        NotFoundComponent,
        PortfolioComponent,
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
