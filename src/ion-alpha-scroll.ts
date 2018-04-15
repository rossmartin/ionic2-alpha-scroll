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
import { NgTemplateOutlet } from '@angular/common';
import * as _ from 'lodash';
import * as Hammer from 'hammerjs';

@Component({
  selector: 'ion-alpha-scroll',
  template: `
    <ion-scroll class="ion-alpha-scroll" [ngStyle]="calculateScrollDimensions()" scrollX="false" scrollY="true">
      <ion-item-group class="ion-alpha-list-outer">
        <div *ngFor="let items of sortedItems | mapToIterable; trackBy:trackBySortedItems">
          <ion-item-divider id="scroll-letter-{{items.key}}">{{items.key}}</ion-item-divider>
          <div *ngFor="let item of items.value">
            <ng-container *ngTemplateOutlet="itemTemplate; context: item"></ng-container>
          </div>
        </div>
      </ion-item-group>
    </ion-scroll>
    <ul class="ion-alpha-sidebar" [ngStyle]="calculateDimensionsForSidebar()">
      <li *ngFor="let letter of alphabet" tappable (click)="alphaScrollGoToList(letter)">
        <a id="sidebar-letter-{{letter}}">{{letter}}</a>
      </li>
    </ul>
  `,
  styles: [`
    .ion-alpha-sidebar {
      position: fixed;
      right: 0;
      display: flex;
      flex-flow: column;
      z-index: 50000;
      margin: 10px 0px;
    }

    .ion-alpha-sidebar li {
      flex: 1 1 auto;
      list-style: none;
      width: 40px;
      text-align: center;
    }

    .ion-alpha-sidebar li a {
      font-size: 16px;
    }

    .ion-alpha-sidebar li a.selected {
      font-weight: bold;
      font-size: 20px;
    }
  `]
})
export class IonAlphaScroll {
  @ViewChild(Scroll) _scrollEle: Scroll;

  @Input() listData: any;
  @Input() key: string;
  @Input() itemTemplate: ElementRef;
  @Input() currentPageClass: any;
  @Input() highlight: boolean = false;
  @Input() triggerChange: any;

  sortedItems: any = {};
  alphabet: any = [];

  constructor(@Host() private _content: Content, private _elementRef: ElementRef, private vcRef: ViewContainerRef) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.setupHammerHandlers();
      this.setupScrollHandlers();
      this.alphaScrollGoToList();
    });
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    let tmp: any = {};
    for (let i = 0; i < this.listData.length; i++) {
      let listValue: any = _.get(this.listData[i], this.key);
      let letter = listValue.toUpperCase().charAt(0);
      if (typeof tmp[letter] === 'undefined') {
        tmp[letter] = [];
      }
      tmp[letter].push({ $implicit: this.listData[i] });
    }

    this.alphabet = this.iterateAlphabet(tmp);
    this.sortedItems = tmp;
  }

  calculateScrollDimensions() {
    let dimensions = this._content.getContentDimensions();
    return {
      height: dimensions.contentHeight + 'px',
      width: (dimensions.contentWidth - 40) + 'px'
    };
  }

  calculateDimensionsForSidebar() {
    return {
      top: this._content.contentTop + 'px',
      height: (this._content.getContentDimensions().contentHeight - 20) + 'px'
    }
  }

  alphaScrollGoToList(letter: string = null) {
    if (!letter) {
      const selector: string = '.ion-alpha-scroll ion-item-divider';
      const letterDivider: any = this._elementRef.nativeElement.querySelector(selector);

      if (letterDivider) {
        const letterDividerId: string = letterDivider.id;
        letter = letterDividerId.replace('scroll-letter-', '');
      }
    }

    if (letter) {
      const selector: string = '#scroll-letter-' + CSSEscape.escape(letter);
      const letterDivider: any = this._elementRef.nativeElement.querySelector(selector);

      if (letterDivider) {
        const offsetY = letterDivider.offsetTop;
        const _scrollContent: any = this._scrollEle._scrollContent.nativeElement;
        _scrollContent.scrollTop = offsetY;
        this.highlightLetter(letter);
      }
    }
  }

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
        if (letter) {
          this.alphaScrollGoToList(letter);
        }
      }
    }, 50));
  }

  setupScrollHandlers() {
    if (!this.highlight) return;

    this._scrollEle.addScrollEventListener(($e) => {
      const offsetY = $e.target.scrollTop;
      const selector: string = '.ion-alpha-scroll ion-item-divider';
      const letterDividers: any = this._elementRef.nativeElement.querySelectorAll(selector);

      for (var i = 0; i < letterDividers.length; i++) {
        if (letterDividers[i].offsetTop <= offsetY) {
          let letterDivider = letterDividers[i];
          if (letterDivider) {
            const letterDividerId: string = letterDivider.id;
            const letter = letterDividerId.replace('scroll-letter-', '');
            this.highlightLetter(letter);
          }
        }
      }
    });
  }

  highlightLetter(letter: string) {
    if (!this.highlight) return;

    let sidebarLetterElements: any = this._elementRef.nativeElement.querySelectorAll('.ion-alpha-sidebar li a');
    for (var i = 0; i < sidebarLetterElements.length; i++) {
      sidebarLetterElements[i].classList.remove("selected");
    }

    let letterEl: any = this._elementRef.nativeElement.querySelector('#sidebar-letter-' + letter);
    letterEl.classList.add("selected");
  }

  trackBySortedItems(index: number, item: any): number {
    return index;
  }

}
