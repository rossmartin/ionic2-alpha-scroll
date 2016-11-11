import { NgModule } from '@angular/core';
import { DynamicHTMLOutlet, Ionic2AlphaScroll } from './ion-alpha-scroll';

@NgModule({
  declarations: [DynamicHTMLOutlet, Ionic2AlphaScroll],
  exports: [Ionic2AlphaScroll]
})
export class Ionic2AlphaScrollModule {}