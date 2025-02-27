import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {

  // write out a property here that is going to be used to trigger some information and send it back up to a parent
  @Output() submitted = new EventEmitter<string>();

  term = '';

  // onInput(value: string | null) {
  //   this.term = value ?? '';
  // }

  onFormSubmit = (event: Event) => {
    event.preventDefault();
    this.submitted.emit(this.term);
  }
}
