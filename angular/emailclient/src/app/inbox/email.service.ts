import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Email } from './email';

export interface EmailSummary {
  id: string;
  subject: string;
  from: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private http: HttpClient) {}

  getEmails() {
    return this.http.get<EmailSummary[]>(`${environment.apiUrl}/emails`);
    // cookies handled by AuthHttpInterceptor
  }

  getEmail(id: string) {
    return this.http.get<Email>(`${environment.apiUrl}/emails/${id}`);
  }

  sendEmail(email: Email) {
    return this.http.post(`${environment.apiUrl}/emails`, email);
  }
}
