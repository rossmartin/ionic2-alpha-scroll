import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { MapToIterable, DynamicHTML, DynamicHTMLOutlet, Ionic2AlphaScroll } from './ion-alpha-scroll';

@NgModule({
  imports: [IonicModule],
  declarations: [MapToIterable, DynamicHTML, DynamicHTMLOutlet, Ionic2AlphaScroll],
  exports: [Ionic2AlphaScroll]
})
export class Ionic2AlphaScrollModule {}