# ionic2-alpha-scroll
Configurable Ionic 2 component for alphabetically indexed list with an alpha scroll bar.  This component has a few improvements on the original Ionic 1 component, mainly the panning functionality on the alpha wheel scroll shown below in the demo.

## I am no longer maintaining this project. PRs are welcome.

[![NPM](https://nodei.co/npm/ionic2-alpha-scroll.png?downloads=true&stars=true)](https://nodei.co/npm/ionic2-alpha-scroll/)

## Installation

1. Use npm to install the component

  ```bash
  npm install ionic2-alpha-scroll --save
  ```

1. Add the ionic2-alpha-scroll component to your app.

  Include the following on your `src/app/app.module.ts`.
  ```javascript
  import { IonAlphaScrollModule } from 'ionic2-alpha-scroll';

  @NgModule({
    declarations: [
      MyApp,
      ...
    ],
    imports: [
      IonicModule.forRoot(MyApp),
      IonAlphaScrollModule
    ],
    ...
  })
  ```

## Demo
[Here is a sample Ionic 2 app on GitHub that shows how to use this component](https://github.com/rossmartin/ionic2-alpha-scroll-example)
![Animated](alpha-scroll.gif)

## Usage

To use the `ion-alpha-scroll` component add this below to the `<ion-content>` in your template:
```html
<ion-alpha-scroll *ngIf="breeds"
  [listData]="breeds"
  key="name"
  [itemTemplate]="alphaScrollItemTemplate"
  [currentPageClass]="currentPageClass"
  [highlight]="true"
  [triggerChange]="triggerAlphaScrollChange">
</ion-alpha-scroll>
```

* `listData` is the model you would like to sort. Use an array of objects here.
* `key` is the name of the key you would like to sort by.
* `itemTemplate` is the reference to the template to display for the properties of each item in the model.
* `currentPageClass` is a reference to the instance of the current current page class (see example below).  This is needed so that bindings on the `itemTemplate` can refer to the Ionic 2 page class containing the `ion-alpha-scroll`.
* `highlight` can set to true or false to highlight the current letter in the sidebar.
* `triggerChange` can be any property you want that can be changed to trigger `ngOnChange` for the `ion-alpha-scroll` component.  If `listData` was modified the alpha list will reflect that after triggering the change.

Heres a quick example:

```javascript
@Component({
  selector: 'alpha-list-page',
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Dog Breeds</ion-title>
      </ion-navbar>
    </ion-header>

    <ion-content class="alpha-list-page">
      <ion-alpha-scroll
        [listData]="breeds"
        key="name"
        [itemTemplate]="alphaScrollItemTemplateRef"
        [currentPageClass]="currentPageClass"
        [triggerChange]="triggerAlphaScrollChange">

          <ng-template #alphaScrollItemTemplateRef let-item>
            <ion-item (click)="currentPageClass.onItemClick(item)">{{item.$t}}</ion-item>
          </ng-template>

      </ion-alpha-scroll>
    </ion-content>
  `
})
export class AlphaListPage {
  breeds: any;
  currentPageClass = this;
  triggerAlphaScrollChange: number = 0;

  constructor() {
    this.assignBreeds();
  }

  onItemClick(item) {
    // This is an example of how you could manually trigger ngOnChange
    // for the component. If you modify "listData" it won't perform
    // an ngOnChange, you will have to trigger manually to refresh the component.
    this.triggerAlphaScrollChange++;
  }

  assignBreeds() {
    this.breeds = [
      {
        'name': 'Affenpinscher'
      },
      {
        'name': 'Afghan Hound'
      },
      // ...
    ];
  }

  // ...
}
```

If you would like to disable the scroll bar for the `ion-alpha-scroll` `scroll-content` use this CSS:

```css
.ion-alpha-scroll .scroll-content::-webkit-scrollbar {
  display: none;
}
```

## Acknowledgements

[https://github.com/aquint/ion-alpha-scroll](https://github.com/aquint/ion-alpha-scroll)

## License

[MIT](LICENSE)
