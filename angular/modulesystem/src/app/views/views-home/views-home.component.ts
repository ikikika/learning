import { Component } from '@angular/core';
import { StatisticsComponent } from "../statistics/statistics.component";

@Component({
  selector: 'app-views-home',
  templateUrl: './views-home.component.html',
  styleUrl: './views-home.component.css',
  standalone: false
})
export class ViewsHomeComponent {
  stats = [
    { value: 22, label: '# of Users' },
    { value: 900, label: 'Revenue' },
    { value: 50, label: 'Reviews' }
  ];

}
