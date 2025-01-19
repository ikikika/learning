import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {

  passwordString = '';
  includeLetters = false;
  includeNumbers = false;
  includeSymbols = false;
  lengthOfString = 0;

  getPassword() {
    return this.passwordString;
  }

  onChangeLength(event: Event) {
    const parsedValue = parseInt((event.target as HTMLInputElement).value);

    // console.log(parsedValue);

    if (!isNaN(parsedValue)) {
      this.lengthOfString = parsedValue;
    }
  }

  onChangeUseLetters() {
    this.includeLetters = !this.includeLetters;
  }

  onChangeUseNumbers() {
    this.includeNumbers = !this.includeNumbers;
  }

  onChangeUseSymbols() {
    this.includeSymbols = !this.includeSymbols;
  }

  onButtonClick() {
    // console.log(`
    //   About to generate a password with the following:
    //   Includes letters: ${this.includeLetters}
    //   Includes numbers: ${this.includeNumbers}
    //   Includes symbols: ${this.includeSymbols}
    // `);
    // this.passwordString = 'MY PASSWORD!!!';

    const numbers = '1234567890';
    const letters = 'abcdefghijklmnopqrstuvwyz';
    const symbols = '!@#$%^&*()';

    let validChars = '';
    if (this.includeLetters) {
      validChars += letters;
    }
    if (this.includeNumbers) {
      validChars += numbers;
    }
    if (this.includeSymbols) {
      validChars += symbols;
    }

    let generatedPassword = '';
    for (let i = 0; i < this.lengthOfString; i++) {
      const index = Math.floor(Math.random() * validChars.length);
      generatedPassword += validChars[index];
    }
    this.passwordString = generatedPassword;
  }
}
