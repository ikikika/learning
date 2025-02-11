import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  standalone: false
})
export class ModalComponent {
  constructor(private element: ElementRef) {
    console.log(this.element.nativeElement);
  }

  ngOnInit() {
    document.body.appendChild(this.element.nativeElement);
    // we can get access to data that has been provided from a parent component, but we cannot access that data anywhere inside of our component before ngOnInit gets called.
  }
  
}
