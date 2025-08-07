import { CommonModule } from '@angular/common';
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
    private uniqueUsername: UniqueUsername
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
        passwordConfirm: new FormControl('', [
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
    return this.authForm.get('passwordConfirm') as FormControl;
  }
}
