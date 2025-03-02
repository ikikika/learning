import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-list',
  standalone: true,
  templateUrl: './page-list.component.html',
  styleUrl: './page-list.component.scss'
})
export class PageListComponent {
  @Input() pages = [];

}
