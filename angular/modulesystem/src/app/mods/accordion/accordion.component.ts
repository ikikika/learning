import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.css',
  standalone: false,
})
export class AccordionComponent {
  @Input() items: { title: string; content: string }[] | [] = [];

  openedItemIndex = -1;

  onClick(index: number) {
    if (index === this.openedItemIndex) {
      this.openedItemIndex = -1;
    } else {
      this.openedItemIndex = index;
    }
  }
}
