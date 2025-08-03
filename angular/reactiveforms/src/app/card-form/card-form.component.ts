import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-card-form',
  imports: [ReactiveFormsModule, JsonPipe, CommonModule],
  templateUrl: './card-form.component.html',
  styleUrl: './card-form.component.scss',
  standalone: true,
})
export class CardFormComponent implements OnInit {
  cardForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  ngOnInit() {
    // Initialization logic here
  }
}
