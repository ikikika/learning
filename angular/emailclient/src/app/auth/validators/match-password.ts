import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class MatchPassword {
  
  validate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const passwordConfirm = control.get('passwordConfirm')?.value;

      if (password && passwordConfirm && password !== passwordConfirm) {
        return { passwordsDontMatch: true };
      }

      return null;
    };
  }
}