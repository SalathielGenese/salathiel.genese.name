import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { MainComponent } from './main.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  bootstrap: [MainComponent],
})
export class AppServerModule {}
