import { Directive, TemplateRef, ViewContainerRef, Input } from '@angular/core';

//structural directive

@Directive({
  selector: '[appTimes]'
})
export class TimesDirective {

  constructor(
    private viewContainer: ViewContainerRef,
    // ViewContainerRef is a reference to the element that we applied our directive to
    // ViewContainerRef ref is a kind of custom version of our element that gives us the ability to very easily add in more elements or remove elements or essentially render some other templates inside there.
    // viewContainer can contain other elements

    private templateRef: TemplateRef<any>
    // reference to whatever elements are placed inside of the element that we applied our directive to.
  ) { }

  @Input('appTimes') set render(times: number) {
    this.viewContainer.clear();
    // delete everything inside that is already existing
    // next lines if code recreate everything inside there from scratch

    for (let i = 0; i < times; i++) {
      // iterate from zero all the way up to times.
      // for every step of iteration, I'm going to create a new instance of this template ref and we're going to add it into the view container
      this.viewContainer.createEmbeddedView(this.templateRef, {
        index: i
      });
    }
  }

}


// <ul *appTimes="5"> viewContainerRef
//   <li></li> templateRef
// </ul>