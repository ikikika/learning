import { Component } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-mods-home',
  templateUrl: './mods-home.component.html',
  styleUrl: './mods-home.component.css',
  standalone: false,
})
export class ModsHomeComponent {
  modalOpen = false;

  items = [
    {
      title: 'Why is the sky blue?',
      content: 'The sky is blue because it is.',
    },
    {
      title: 'What does an orange taste like?',
      content: 'An orange tastes like an orange.',
    },
    {
      title: 'What is the meaning of life?',
      content: 'The meaning of life is to be happy.',
    },
  ];

  onClick() {
    this.modalOpen = !this.modalOpen;
  }
}
