import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./pages/home.component";
import {NotFoundComponent} from "./pages/not-found.component";
import {BlogComponent} from "./pages/blog.component";
import {HireComponent} from "./pages/hire.component";

const routes: Routes = [
  {path: ':languageTag', pathMatch: 'full', component: HomeComponent, title: 'pages.home.title'},
  {path: ':languageTag/blog', component: BlogComponent, title: 'pages.blog.title'},
  {path: ':languageTag/hire', component: HireComponent, title: 'pages.hire.title'},
  {path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
