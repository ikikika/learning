import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PhotosShowComponent } from "./photos-show/photos-show.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PhotosShowComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'photofetchingapp';
}
