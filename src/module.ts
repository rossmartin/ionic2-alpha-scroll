import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';
import { IonAlphaScroll } from './ion-alpha-scroll';
import { UtilModule } from './util-module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    UtilModule
  ],
  declarations: [IonAlphaScroll],
  exports: [IonAlphaScroll]
})
export class IonAlphaScrollModule {}
