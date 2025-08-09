import { Component, OnInit } from '@angular/core';
import { EmailService, EmailSummary } from '../email.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-email-index',
  imports: [RouterLink, CommonModule],
  templateUrl: './email-index.component.html',
  styleUrl: './email-index.component.scss',
  standalone: true,
})
export class EmailIndexComponent implements OnInit {
  emails: EmailSummary[] | [] = [];

  constructor(private emailService: EmailService) {}

  ngOnInit() {
    this.emailService.getEmails().subscribe((emails) => {
      this.emails = emails;
    });
  }
}
