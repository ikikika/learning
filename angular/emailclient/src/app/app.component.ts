import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    AuthModule,
    RouterLink,
    RouterLinkActive,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  signedin$: BehaviorSubject<boolean>; // reference to the signedin$ observable in AuthService

  constructor(private authService: AuthService) {
    this.signedin$ = this.authService.signedin$;
  }

  // ngOnInit() {
  //   // check if the user is authenticated when the app initializes
  //   this.authService.signedin$.subscribe((isSignedIn) => {
  //     this.signedin = isSignedIn;
  //   });
  // }
}
