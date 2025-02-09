import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css',
  standalone: false
})
export class ItemListComponent {
  @Input() items: { image: string; title: string; description: string; }[] = [];

}
