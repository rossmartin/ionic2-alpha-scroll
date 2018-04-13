import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

import { MapToIterable } from './util-classes';
import { IonAlphaScroll } from './ion-alpha-scroll';

@NgModule({
  declarations: [
    MapToIterable,
    IonAlphaScroll
  ],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports: [
    MapToIterable,
    IonAlphaScroll
  ]
})
export class IonAlphaScrollModule {}
