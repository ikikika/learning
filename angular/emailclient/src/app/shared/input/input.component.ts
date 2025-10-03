import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class InputComponent implements OnInit {
  @Input() label: string = '';
  @Input() control!: FormControl; // Use the ! Non-null Assertion Operator
  @Input() inputType: string = '';
  @Input() controlType = 'input';

  constructor() {}

  ngOnInit() {}

  showErrors() {
    const { dirty, touched, errors } = this.control;
    return (dirty || touched) && !!errors;
  }
}
