import { Component, OnInit } from '@angular/core';
import { EmailService, EmailSummary } from '../email.service';

@Component({
  selector: 'app-email-index',
  templateUrl: './email-index.component.html',
  styleUrl: './email-index.component.scss',
  standalone: false,
})
export class EmailIndexComponent implements OnInit {
  emails: EmailSummary[] | [] = [];

  constructor(private emailService: EmailService) {}

  ngOnInit() {
    this.emailService.getEmails().subscribe((emails) => {
      this.emails = emails;
      this.emails.push({
        id: '1',
        subject: 'Test Email',
        from: '',
      });
    });
  }
}
