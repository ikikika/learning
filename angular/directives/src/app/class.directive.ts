import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appClass]'
})
export class ClassDirective {

  // reference the element we are applying the directive to
  // we can then access this element and start changing some of the underlying properties
  // eg add in different styling rules, modify classes, etc
  constructor(private element: ElementRef) {
    this.element.nativeElement.style.backgroundColor = 'orange';
  }

}
