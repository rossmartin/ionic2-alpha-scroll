import { NgModule } from '@angular/core';
import { DynamicHTMLOutlet, IonAlphaScroll } from './ion-alpha-scroll';

@NgModule({
  declarations: [DynamicHTMLOutlet, IonAlphaScroll],
  exports: [IonAlphaScroll]
})
export class IonAlphaScrollModule {}
