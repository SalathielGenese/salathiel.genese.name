import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./pages/home.component";
import {NotFoundComponent} from "./pages/not-found.component";

const routes: Routes = [
    {path: '', pathMatch: 'prefix', component: HomeComponent},
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
