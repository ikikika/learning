import { Component } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  term = '';

  // onInput(value: string | null) {
  //   this.term = value ?? '';
  // }

  onFormSubmit = (event: Event) => {
    event.preventDefault();
    console.log(this.term);
  }
}
