import {BrowserModule, provideClientHydration} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {TitleStrategy} from "@angular/router";
import {NgModule} from '@angular/core';

import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

import {AppRoutingModule} from './app-routing.module';

import {HeaderComponent as HComponent} from "./components/header.component";
import {TranslateComponent} from "./components/translate.component";

import {SalathielTitleStrategy} from "./services/salathiel.title-strategy";
import {TargetInterceptor} from "./services/target.interceptor";
import {I18nService} from "./services/i18n.service";

import {NotFoundComponent} from "./pages/not-found.component";
import {BlogComponent} from "./pages/blog.component";
import {HireComponent} from "./pages/hire.component";
import {HomeComponent} from "./pages/home.component";
import {TranslatePipe} from "./pipes/translate.pipe";

import {HeaderComponent} from "./header.component";
import {FooterComponent} from "./footer.component";
import {MainComponent} from './main.component';
import {NavComponent} from "./nav.component";

@NgModule({
  declarations: [
    TranslatePipe,
    TranslateComponent,

    HComponent,

    NavComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,

    HomeComponent,
    HireComponent,
    BlogComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    ReactiveFormsModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, multi: true, useClass: TargetInterceptor},
    {provide: TitleStrategy, useClass: SalathielTitleStrategy},
    provideClientHydration(),
    I18nService,
  ],
  bootstrap: [
    MainComponent,
    // HeaderComponent,
  ]
})
export class AppModule {
}
