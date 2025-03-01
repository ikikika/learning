import { Component } from '@angular/core';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { PageListComponent } from './page-list/page-list.component';
import { WikipediaService } from './wikipedia.service';

@Component({
  selector: 'app-root',
  imports: [ SearchBarComponent, PageListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {

  constructor(private wikipedia: WikipediaService) {}

  onTerm(term: string) {
    this.wikipedia.search(term).subscribe((response) => {
      console.log(response);
    });
  }
}
