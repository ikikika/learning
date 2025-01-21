import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { faker } from "@faker-js/faker"; 

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  randomText = faker.lorem.sentence();

  onInput(value: string) {
    console.log(value);
  }
}
