import { Component } from '@angular/core';
import { ModalComponent } from "../modal/modal.component";
import { SharedModule } from "../../shared/shared.module";

@Component({
  selector: 'app-mods-home',
  templateUrl: './mods-home.component.html',
  styleUrl: './mods-home.component.css',
  standalone: false
})
export class ModsHomeComponent {

  modalOpen = false;

  onClick() {
    this.modalOpen = !this.modalOpen;
  }
  
}
