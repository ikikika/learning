import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, SigninCredentials } from '../auth.service';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../shared/input/input.component';

@Component({
  selector: 'app-signin',
  imports: [ReactiveFormsModule, CommonModule, InputComponent],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent implements OnInit {
  authForm = new FormGroup({
    username: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[a-z0-9]+$/),
      ],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
      ],
    }),
  });

  constructor(private authService: AuthService) {}

  get usernameControl(): FormControl {
    return this.authForm.get('username') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.authForm.get('password') as FormControl;
  }

  ngOnInit() {}

  onSubmit() {
    if (this.authForm.invalid) {
      return;
    }
    const creds: SigninCredentials = this.authForm.getRawValue();
    this.authService.signin(creds).subscribe({
      next: () => {},
      error: ({ error }) => {
        if (error.username || error.password) {
          this.authForm.setErrors({ credentials: true });
        }
      },
    });
  }
}
