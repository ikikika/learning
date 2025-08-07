import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class MatchPassword {
  static validate: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const passwordConfirm = control.get('passwordConfirm')?.value;

    if (password && passwordConfirm && password !== passwordConfirm) {
      return { passwordsDontMatch: true };
    }

    return null;
  };
}
