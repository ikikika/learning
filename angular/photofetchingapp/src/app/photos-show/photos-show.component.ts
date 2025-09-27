import { Component, OnInit } from '@angular/core';
import { PhotosService } from '../photos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-photos-show',
  imports: [CommonModule],
  templateUrl: './photos-show.component.html',
  styleUrl: './photos-show.component.scss',
})
export class PhotosShowComponent implements OnInit {
  photoUrl: string = '';

  constructor(private photosService: PhotosService) {
    this.fetchPhoto();
  }

  onClick() {
    this.fetchPhoto();
  }

  fetchPhoto() {
    this.photosService.getPhoto().subscribe((response) => {
      this.photoUrl = response.urls.regular;
    });
  }

  ngOnInit() {}
}
