import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  templateUrl: './placeholder.component.html',
  styleUrl: './placeholder.component.css',
  standalone: false
})
export class PlaceholderComponent {
  @Input() header = true;
  @Input() lines = 3;
}
