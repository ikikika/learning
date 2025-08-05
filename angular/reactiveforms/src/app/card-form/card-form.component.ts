import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { DateFormControl } from '../date-form-control';

@Component({
  selector: 'app-card-form',
  imports: [ReactiveFormsModule, JsonPipe, CommonModule, InputComponent],
  templateUrl: './card-form.component.html',
  styleUrl: './card-form.component.scss',
  standalone: true,
})
export class CardFormComponent implements OnInit {
  cardForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      // Validators.maxLength(5),
      // Validators.pattern('/\\s'),
    ]),
    cardNumber: new FormControl('', [
      Validators.required,
      Validators.minLength(16),
      Validators.maxLength(16),
      Validators.pattern('\\d{16}'), // ensure only digits
      Validators.pattern('^(?!\\s*$).+'), // not empty or whitespace
    ]),
    expiration: new DateFormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.pattern('^(0[1-9]|1[0-2])/[0-9]{2}$'), // MM/YY format
      Validators.pattern('^(?!\\s*$).+'), // not empty or whitespace
    ]),
    securityCode: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(3),
    ]),
  });

  ngOnInit() {
    // Initialization logic here
  }

  onSubmit() {
    console.log('Form Submitted', this.cardForm.value);
  }

  onResetClick() {
    this.cardForm.reset(); // method available inside FormGroup. sets controls to null
  }
}
