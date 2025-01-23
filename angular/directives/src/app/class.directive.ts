import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appClass]'
})
export class ClassDirective {

  // @Input() backgroundColor: string | undefined;

  // reference the element we are applying the directive to
  // we can then access this element and start changing some of the underlying properties
  // eg add in different styling rules, modify classes, etc
  constructor(private element: ElementRef) {
    // this.element.nativeElement.style.backgroundColor = 'orange';

    // NEVER DO THIS!!! example only
    // setTimeout(() => {
    //   this.element.nativeElement.style.backgroundColor = this.backgroundColor;
    // }, 2000);
  }

  // allows angular to intercept anytme  we try to set a value to backgroundColor property and use it to update something else
  @Input() set backgroundColor(color: string) {
    this.element.nativeElement.style.backgroundColor = color;
  }

}


// class Car {
//   color = 'red';
// }

// Instantiate
// const car = new Car();
// Access color
// car.color = 'blue';

// can we detect change to color and do soemthing?

// class Car {
//   set color(newColor: string) {
//     detect changes to color and do something here
//     console.log(newColor);
//   }
// }