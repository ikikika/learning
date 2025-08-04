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
    cardNumber: new FormControl(''),
    expiration: new FormControl(''),
    securityCode: new FormControl('')
  });

  ngOnInit() {
    // Initialization logic here
  }
}
