import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardComponent } from './card/card.component';

// in ts, this is known as a decorator
@Component({
  // this is the name of this component. when angular sees this name in a html file, it will render an instance of this component
  selector: 'app-root',
  imports: [RouterOutlet, CardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cards';
}
