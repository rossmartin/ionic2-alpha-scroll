import {
  Component,
  Host,
  Input,
  Pipe,
  ElementRef,
  ViewChild,
  Directive,
  ViewContainerRef,
  ComponentResolver,
  ComponentMetadata,
  ComponentFactory,
  ReflectiveInjector,
  SimpleChange
} from '@angular/core';
import { Content, Scroll } from 'ionic-angular';
import * as _ from 'lodash';

@Pipe({ name: 'mapToIterable' })
class MapToIterable {
  transform(value) {
    let result = [];

    if (value.entries) {
      for (var [key, value] of value.entries()) {
        result.push({ key, value });
      }
    } else {
      for (let key in value) {
        result.push({ key, value: value[key] });
      }
    }

    return result;
  }
}

export function createComponentFactory(resolver: ComponentResolver, metadata: ComponentMetadata): Promise<ComponentFactory<any>> {
    const cmpClass = class DynamicComponent {};
    const decoratedCmp = Component(metadata)(cmpClass);
    return resolver.resolveComponent(decoratedCmp);
}

@Directive({
  selector: 'dynamic-html-outlet',
})
export class DynamicHTMLOutlet {
  @Input() src: string;
  @Input() ionAlphaScrollRef: any;
  @Input() currentPageClass: any;

  constructor(private vcRef: ViewContainerRef, private resolver: ComponentResolver) {
  }

  ngOnChanges() {
    if (!this.src) return;

    const metadata = new ComponentMetadata({
      selector: 'dynamic-html',
      template: this.src,
      pipes: [MapToIterable]
    });
    createComponentFactory(this.resolver, metadata).then(factory => {
      const injector = ReflectiveInjector.fromResolvedProviders([], this.vcRef.parentInjector);
      let component = this.vcRef.createComponent(factory, 0, injector, []);
      component.instance.ionAlphaScrollRef = this.ionAlphaScrollRef;
      component.instance.currentPageClass = this.currentPageClass;
    });
  }
}

@Component({
  selector: 'ion-alpha-scroll',
  template: `
    <dynamic-html-outlet
      [src]="alphaScrollTemplate"
      [ionAlphaScrollRef]="ionAlphaScrollRef"
      [currentPageClass]="currentPageClass">
    </dynamic-html-outlet>
  `,
  pipes: [MapToIterable],
  directives: [DynamicHTMLOutlet]
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
  alphaScrollTemplate: string;
  ionAlphaScrollRef = this;

  constructor(
    @Host() private _content: Content,
    private _elementRef: ElementRef,
    private vcRef: ViewContainerRef,
    private resolver: ComponentResolver
  ) {

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
        <ion-list class="ion-alpha-list-outer">
          <div *ngFor="let items of ionAlphaScrollRef.sortedItems | mapToIterable; trackBy:ionAlphaScrollRef.trackBySortedItems">
            <ion-item-divider id="scroll-letter-{{items.key}}">{{items.key}}</ion-item-divider>
            <div *ngFor="let item of items.value">
              ${this.itemTemplate}
            </div>
          </div>
        </ion-list>
      </ion-scroll>
      <ul class="ion-alpha-sidebar" [ngStyle]="ionAlphaScrollRef.calculateDimensionsForSidebar()">
        <li *ngFor="let letter of ionAlphaScrollRef.alphabet" tappable (click)="ionAlphaScrollRef.alphaScrollGoToList(letter)">
          <a>{{letter}}</a>
        </li>
      </ul>
    `;

    setTimeout(() => {
      this._scrollEle = this._elementRef.nativeElement.querySelector('scroll-content');
      this.setupHammerHandlers();
    });
  }

  ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
    let tmp = {};
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
      height: dimensions.scrollHeight + 'px',
      width: (dimensions.contentWidth - 20) + 'px'
    };
  }

  calculateDimensionsForSidebar() {
    return {
      top: this._content.contentTop + 'px',
      height: (this._content.getContentDimensions().contentHeight - this._content.contentTop - 70) + 'px'
    }
  }

  alphaScrollGoToList(letter) {
    let ele: any = this._elementRef.nativeElement.querySelector(`#scroll-letter-${letter}`);
    let offsetY = ele.offsetTop;
    this._scrollEle.scrollTop = offsetY;
  }

  // create alphabet object
  iterateAlphabet(alphabet) {
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let numbers = [];

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

    let mcHammer = new Hammer(sidebarEle, {
      recognizers: [
        // RecognizerClass, [options], [recognizeWith, ...], [requireFailure, ...]
        [Hammer.Pan, { direction: Hammer.DIRECTION_VERTICAL }],
      ]
    });

    mcHammer.on('panup pandown', _.throttle((e) => {
      let closestEle: any = document.elementFromPoint(e.center.x, e.center.y);
      if (closestEle && ['LI', 'A'].indexOf(closestEle.tagName) > -1) {
        let letter = closestEle.innerText;
        let letterDivider: any = this._elementRef.nativeElement.querySelector(`#scroll-letter-${letter}`);
        if (letterDivider) {
          this._scrollEle.scrollTop = letterDivider.offsetTop;
        }
      }
    }, 50 ));
  }

  trackBySortedItems(index: number, item: any) {
    return index;
  }

}
