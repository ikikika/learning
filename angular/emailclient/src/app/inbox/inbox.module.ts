import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InboxRoutingModule } from './inbox-routing.module';
import { EmailIndexComponent } from './email-index/email-index.component';
import { HomeComponent } from './home/home.component';
import { PlaceholderComponent } from './placeholder/placeholder.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [HomeComponent, EmailIndexComponent, PlaceholderComponent],
  imports: [CommonModule, InboxRoutingModule, SharedModule],
})
export class InboxModule {}
