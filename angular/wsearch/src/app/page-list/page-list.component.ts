import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

interface Page {
  title: string;
  wordcount: number;
  snippet: string;
}

@Component({
  selector: 'app-page-list',
  standalone: true,
  templateUrl: './page-list.component.html',
  styleUrl: './page-list.component.scss',
  imports: [CommonModule],
})
export class PageListComponent {
  @Input() pages: Page[] = [];

}