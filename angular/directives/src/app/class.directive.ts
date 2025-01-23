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
  // provide a string that is going to be the name of the property that we are trying to set from the outside world.
  // Now, whenever we try to set the appClass property, this input decorator is going to kind of redirect that to the backgroundColor method.
  // @Input('appClass') set backgroundColor(color: string) {

  //   // So from the outside world everyone thinks we are setting appClass.
  //   // But inside of our actual class, what actually gets executed is the backgroundColor method.

  //   this.element.nativeElement.style.backgroundColor = color;
  // }

  @Input('appClass') set classNames(classObj: any) {
    for (let key in classObj) {
      if (classObj[key]) {
        this.element.nativeElement.classList.add(key);
      } else {
        this.element.nativeElement.classList.remove(key);
      }
    }
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