import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
  standalone: false
})
export class StatisticsComponent {
  @Input() data :{ value: number; label: string; }[] = [];
}
