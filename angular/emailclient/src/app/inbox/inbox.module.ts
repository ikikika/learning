import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InboxRoutingModule } from './inbox-routing.module';
import { EmailIndexComponent } from './email-index/email-index.component';
import { HomeComponent } from './home/home.component';
import { PlaceholderComponent } from './placeholder/placeholder.component';
import { SharedModule } from '../shared/shared.module';
import { EmailCreateComponent } from './email-create/email-create.component';

@NgModule({
  declarations: [
    HomeComponent,
    EmailIndexComponent,
    PlaceholderComponent,
    EmailCreateComponent,
  ],
  imports: [
    CommonModule,
    InboxRoutingModule,
    SharedModule
  ],
})
export class InboxModule {}
