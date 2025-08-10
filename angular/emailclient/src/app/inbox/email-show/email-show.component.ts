import { Component } from '@angular/core';
import { Email } from '../email';
import { ActivatedRoute } from '@angular/router';
import { EmailService } from '../email.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-email-show',
  imports: [],
  templateUrl: './email-show.component.html',
  styleUrl: './email-show.component.scss',
})
export class EmailShowComponent {
  email!: Email;

  constructor(
    private route: ActivatedRoute,
    private emailService: EmailService
  ) {
    this.email = route.snapshot.data['email'];
    this.route.data.subscribe(({ email }) => {
      this.email = email;
    });
  }

  ngOnInit() {
    // this.route.params.subscribe(({ id }) => {
    //   // the below subscribe will run every time the route params change
    //   // but it is not efficient
    //   this.emailService.getEmail(id).subscribe((email: Email) => {
    //     console.log('Email fetched:', email);
    //     // this.email = email;
    //   });
    // });

    // move this logic to the resolver service
    // this.route.params
    //   .pipe(
    //     // if internet connection is slow,
    //     // switchmap will cancel the previous request when a new id is received
    //     // and only the latest request will be processed
    //     switchMap(({ id }) => this.emailService.getEmail(id))
    //   )
    //   .subscribe((email) => {
    //     this.email = email;
    //   });
  }
}
