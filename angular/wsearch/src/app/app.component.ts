import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { PageListComponent } from './page-list/page-list.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SearchBarComponent, PageListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  onTerm(term: string) {
    console.log('I am the app and here is the term', term);
  }
}
