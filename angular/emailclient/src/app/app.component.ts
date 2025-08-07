import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthModule } from './auth/auth.module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AuthModule, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'emailclient';
}
