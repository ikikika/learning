import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatchPassword } from '../validators/match-password';
import { UniqueUsername } from '../validators/unique-username';
import { InputComponent } from '../../shared/input/input.component';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  authForm!: FormGroup;
  constructor(
    private matchPassword: MatchPassword,
    private uniqueUsername: UniqueUsername,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authForm = new FormGroup(
      {
        username: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
            Validators.pattern(/^[a-z0-9]+$/),
          ],
          asyncValidators: [this.uniqueUsername.validate], // this will run after all sync validators are completed
          updateOn: 'change',
        }),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ]),
        passwordConfirmation: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ]),
      },
      {
        validators: this.matchPassword.validate(),
      }
    );
  }

  get usernameControl(): FormControl {
    return this.authForm.get('username') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.authForm.get('password') as FormControl;
  }

  get passwordConfirmControl(): FormControl {
    return this.authForm.get('passwordConfirmation') as FormControl;
  }

  onSubmit() {
    if (this.authForm.invalid) {
      return;
    }
    this.authService.signup(this.authForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/inbox')
      },
      error: (err) => {
        if (!err.status) {
          this.authForm.setErrors({ noConnection: true });
        } else {
          this.authForm.setErrors({ unknownError: true });
        }
      },
      // no need for complete here as we are not using it
    });
  }
}
