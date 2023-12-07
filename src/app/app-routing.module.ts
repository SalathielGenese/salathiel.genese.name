import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./pages/home.component";
import {NotFoundComponent} from "./pages/not-found.component";
import {BlogComponent} from "./pages/blog.component";
import {PortfolioComponent} from "./pages/portfolio.component";
import {HireComponent} from "./pages/hire.component";
import {RootComponent} from "./pages/root.component";

const routes: Routes = [
    {
        path: ':locale',
        component: RootComponent,
        children: [
            {path: '', pathMatch: 'full', component: HomeComponent},
            {path: 'portfolio', component: PortfolioComponent,},
            {path: 'hire', component: HireComponent},
            {path: 'blog', component: BlogComponent},
        ],
    },
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
