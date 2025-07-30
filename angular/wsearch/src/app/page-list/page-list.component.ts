import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

interface Page {
  title: string;
  wordcount: number;
  snippet: string;
  pageid: number;
}

@Component({
  selector: 'app-page-list',
  standalone: true,
  templateUrl: './page-list.component.html',
  styleUrl: './page-list.component.scss',
  imports: [CommonModule],
})
export class PageListComponent implements OnInit{
  @Input() pages: Page[] = [];

  ngOnInit() {}

}