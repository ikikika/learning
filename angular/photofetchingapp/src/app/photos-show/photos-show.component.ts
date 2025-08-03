import { Component, OnInit } from '@angular/core';
import { PhotosService } from '../photos.service';

@Component({
  selector: 'app-photos-show',
  imports: [],
  templateUrl: './photos-show.component.html',
  styleUrl: './photos-show.component.scss'
})
export class PhotosShowComponent implements OnInit {

  constructor(private photosService: PhotosService) {
    this.photosService.getPhoto().subscribe(() => {});
  }

  ngOnInit() {}
}
