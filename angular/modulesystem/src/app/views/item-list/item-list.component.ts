import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css',
  standalone: false
})
export class ItemListComponent {
  @Input() items: { image: string; title: string; description: string; }[] = [];

  constructor() {
    console.log('inside contructor', this.items);
  }

  ngOnInit() {
    //if we ever need to get access to some data that is being provided by a parent component, the earliest we can access it is inside of NG on init.
    console.log('inside ngOnInit', this.items);
  }

}
