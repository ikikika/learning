import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  standalone: false
})
export class TableComponent {
  @Input() classNames: string = '';

  @Input() data: any = [];
  @Input() headers = [] as any;
}
