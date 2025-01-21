import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { faker } from "@faker-js/faker"; 

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  randomText = faker.lorem.sentence();
  enteredText = '';

  onInput(value: string) {
    this.enteredText = value;
  }
}
