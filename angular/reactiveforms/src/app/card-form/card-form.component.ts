import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-card-form',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './card-form.component.html',
  styleUrl: './card-form.component.scss',
  standalone: true,
})
export class CardFormComponent implements OnInit {

  cardForm = new FormGroup({
    name: new FormControl(''),
  })


  ngOnInit() {
    // Initialization logic here
  }

}
