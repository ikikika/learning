import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Email } from '../email';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

type EmailFormGroup = FormGroup<{
  to: FormControl<string>;
  from: FormControl<string>;
  subject: FormControl<string>;
  text: FormControl<string>;
}>;

@Component({
  selector: 'app-email-form',
  imports: [ReactiveFormsModule, SharedModule],
  templateUrl: './email-form.component.html',
  styleUrl: './email-form.component.scss',
  standalone: true,
})
export class EmailFormComponent {
  emailForm: EmailFormGroup = new FormGroup({
    to: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    from: new FormControl({ value: '', disabled: true }, { nonNullable: true }),
    subject: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    text: new FormControl('', { nonNullable: true }),
  });
  @Input() email: Email = {
    id: '',
    to: '',
    from: '',
    subject: '',
    text: '',
    html: '',
  };
  @Output() emailSubmit = new EventEmitter();

  ngOnInit() {
    const { subject, from, to, text } = this.email;

    this.emailForm.patchValue({
      to: to ?? '',
      from: from ?? '',
      subject: subject ?? '',
      text: text ?? '',
    });
  }

  onSubmit() {
    if (this.emailForm.invalid) {
      return;
    }

    this.emailSubmit.emit(this.emailForm.value);

    // console.log(this.emailForm.value);// get all values from the form, even the disabled fields
  }
}
