import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { PhoneMotionScene } from './three/phone-motion-scene';
import { ThreeProvider } from './lib.providers';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DeviceDetectorModule.forRoot()
  ],
  providers: [
    ThreeProvider,
    PhoneMotionScene
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
