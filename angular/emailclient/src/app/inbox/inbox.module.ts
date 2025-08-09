import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InboxRoutingModule } from './inbox-routing.module';
import { EmailIndexComponent } from './email-index/email-index.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, InboxRoutingModule, EmailIndexComponent],
})
export class InboxModule {}
