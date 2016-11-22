import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';
import { IonAlphaScroll, MapToIterable } from './ion-alpha-scroll';
import { DynamicComponentModule } from 'ng-dynamic';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    DynamicComponentModule.forRoot({
      imports: [CommonModule, IonicModule],
      declarations: [MapToIterable]
    })
  ],
  declarations: [IonAlphaScroll],
  exports: [IonAlphaScroll]
})
export class IonAlphaScrollModule {}
