import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TitleCasePipe, DatePipe, CurrencyPipe, DecimalPipe, JsonPipe, CommonModule } from '@angular/common';
import { ConvertPipe } from './convert.pipe';

@Component({
  selector: 'app-root',
  imports: [TitleCasePipe, DatePipe, CurrencyPipe, DecimalPipe, JsonPipe, ConvertPipe, CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  fullName: string = '';
  date: string = '';
  today: number = Date.now();
  amount: number | undefined;
  height: number | undefined;
  miles: number | undefined;

  car = {
    make: 'Toyota',
    model: 'Camry',
    year: 2000
  };

  onNameChange(value: string) {
    this.fullName = value;
  }

  onDateChange(value: string) {
    this.date = value;
  }

  onAmountChange(value: string) {
    this.amount = parseFloat(value);
  }

  onHeightChange(value: string) {
    this.height = parseFloat(value);
  }

  onMilesChange(value: string) {
    this.miles = parseFloat(value);
  }
}

// https://angular.dev/guide/templates/pipes
// Pipes are functions that allow us to transform data format in our template