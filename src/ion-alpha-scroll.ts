import {
  Component,
  Host,
  Input,
  ElementRef,
  ViewChild,
  ViewContainerRef,
  SimpleChange
} from '@angular/core';
import { CSSEscape } from './util-classes';
import { Content, Scroll } from 'ionic-angular';
import * as _ from 'lodash';

@Component({
  selector: 'ion-alpha-scroll',
  template: `
    <div *dynamicComponent="alphaScrollTemplate; context: ionAlphaScrollRef;"></div>
  `
})
export class IonAlphaScroll {
  @Input() listData: any;
  @Input() key: string;
  @Input() itemTemplate: string;
  @Input() currentPageClass: any;
  @Input() triggerChange: any;
  private _scrollEle: HTMLElement;
  sortedItems: any = {};
  alphabet: any = [];
  ionAlphaScrollRef = this;
  alphaScrollTemplate: string;

  constructor(@Host() private _content: Content, private _elementRef: ElementRef, private vcRef: ViewContainerRef) {
  }

  ngOnInit() {
    this.alphaScrollTemplate = `
      <style>
        .ion-alpha-sidebar {
          position: fixed;
          right: 0;
          display: flex;
          flex-flow: column;
          z-index: 50000;
        }

        .ion-alpha-sidebar li {
          flex: 1 1 auto;
          list-style: none;
          width: 15px;
          text-align: center;
        }
      </style>

      <ion-scroll class="ion-alpha-scroll" [ngStyle]="ionAlphaScrollRef.calculateScrollDimensions()" scrollX="false" scrollY="true">
        <ion-item-group class="ion-alpha-list-outer">
          <div *ngFor="let items of ionAlphaScrollRef.sortedItems | mapToIterable; trackBy:ionAlphaScrollRef.trackBySortedItems">
            <ion-item-divider id="scroll-letter-{{items.key}}">{{items.key}}</ion-item-divider>
            <div *ngFor="let item of items.value">
              ${this.itemTemplate}
            </div>
          </div>
        </ion-item-group>
      </ion-scroll>
      <ul class="ion-alpha-sidebar" [ngStyle]="ionAlphaScrollRef.calculateDimensionsForSidebar()">
        <li *ngFor="let letter of ionAlphaScrollRef.alphabet" tappable (click)="ionAlphaScrollRef.alphaScrollGoToList(letter)">
        <a>{{letter}}</a>
        </li>
      </ul>
   `;

    setTimeout(() => {
      this._scrollEle = this._elementRef.nativeElement.querySelector('.scroll-content');
      this.setupHammerHandlers();
    });
  }

  ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
    let tmp: any = {};
    for (let i = 0; i < this.listData.length; i++) {
      let listValue: any = _.get(this.listData[i], this.key);
      let letter = listValue.toUpperCase().charAt(0);
      if (typeof tmp[letter] === 'undefined') {
        tmp[letter] = [];
      }
      tmp[letter].push(this.listData[i]);
    }

    this.alphabet = this.iterateAlphabet(tmp);
    this.sortedItems = tmp;
  }

  calculateScrollDimensions() {
    let dimensions = this._content.getContentDimensions();
    return {
      height: dimensions.contentHeight + 'px',
      width: (dimensions.contentWidth - 20) + 'px'
    };
  }

  calculateDimensionsForSidebar() {
    return {
      top: this._content.contentTop + 'px',
      height: (this._content.getContentDimensions().contentHeight - this._content.contentTop - 70) + 'px'
    }
  }

  alphaScrollGoToList(letter: any) {
    const selector = '#scroll-letter-' + CSSEscape.escape(letter);
    const ele: any = this._elementRef.nativeElement.querySelector(selector);
    const offsetY = ele.offsetTop;
    this._scrollEle.scrollTop = offsetY;
  }

  // create alphabet object
  iterateAlphabet(alphabet: any) {
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let numbers: Array<any> = [];

    if (Object.keys(alphabet).length > 0) {
      str = '';
      for (let i = 0; i < Object.keys(alphabet).length; i++) {
        str += Object.keys(alphabet)[i];
      }
    }

    for (let i = 0; i < str.length; i++) {
      let nextChar = str.charAt(i);
      numbers.push(nextChar);
    }

    return numbers;
  }

  setupHammerHandlers() {
    let sidebarEle: HTMLElement = this._elementRef.nativeElement.querySelector('.ion-alpha-sidebar');

    if (!sidebarEle) return;

    let mcHammer = new Hammer(sidebarEle, {
      recognizers: [
        // RecognizerClass, [options], [recognizeWith, ...], [requireFailure, ...]
        [Hammer.Pan, { direction: Hammer.DIRECTION_VERTICAL }],
      ]
    });

    mcHammer.on('panup pandown', _.throttle((e: any) => {
      const closestEle: any = document.elementFromPoint(e.center.x, e.center.y);
      if (closestEle && ['LI', 'A'].indexOf(closestEle.tagName) > -1) {
        const letter = closestEle.innerText;
        const selector = '#scroll-letter-' + CSSEscape.escape(letter);
        const letterDivider: any = this._elementRef.nativeElement.querySelector(selector);
        if (letterDivider) {
          this._scrollEle.scrollTop = letterDivider.offsetTop;
        }
      }
    }, 50 ));
  }

  trackBySortedItems(index: number, item: any): number {
    return index;
  }

}
