import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [TitleCasePipe, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  fullName: string = '';
  date: string = '';

  onNameChange(value: string) {
    this.fullName = value;
  }

  onDateChange(value: string) {
    this.date = value;
  }
}

// https://angular.dev/guide/templates/pipes
// Pipes are functions that allow us to transform data format in our template