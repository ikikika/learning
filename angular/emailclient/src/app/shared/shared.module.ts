import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input/input.component';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, InputComponent, ModalComponent],
  exports: [InputComponent, ModalComponent],
})
export class SharedModule {}
