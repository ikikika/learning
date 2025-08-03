import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  @Input() control: FormControl = new FormControl('');
  @Input() label: string = '';

  showErrors() {
    const { dirty, touched, errors } = this.control;
    // Show errors if the control is invalid and has a value (not pristine)
    if (errors && this.control.value !== '' && this.control.invalid) {
      return true;
    }
    return dirty && touched && !!errors;
  }
}
