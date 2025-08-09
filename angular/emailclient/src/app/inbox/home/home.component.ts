import { Component } from '@angular/core';
import { InboxRoutingModule } from "../inbox-routing.module";
import { EmailIndexComponent } from "../email-index/email-index.component";

@Component({
  selector: 'app-home',
  imports: [InboxRoutingModule, EmailIndexComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
