import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../input/input.component';

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
    ]),
    expiration: new FormControl('', [
      Validators.required,
      Validators.pattern('^(0[1-9]|1[0-2])/[0-9]{2}$'), // MM/YY format
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
}
