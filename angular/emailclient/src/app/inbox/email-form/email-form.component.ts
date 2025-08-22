import { Component, Input } from '@angular/core';
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

  ngOnInit() {
    const { subject, from, to, text } = this.email;

    this.emailForm.patchValue({
      to: this.email.to ?? '',
      from: this.email.from ?? '',
      subject: this.email.subject ?? '',
      text: this.email.text ?? '',
    });
  }

  onSubmit() {}
}
