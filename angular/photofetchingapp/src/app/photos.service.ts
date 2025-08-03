import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';


interface UnsplashResponse {
  urls: {
    regular: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PhotosService {

  constructor(private http: HttpClient) { }

  getPhoto() {
    const accessKey = environment.UNSPLASH_ACCESS_KEY;
    return this.http.get<UnsplashResponse>(
      'https://api.unsplash.com/photos/random',
      {
      headers: {
        Authorization: `Client-ID ${accessKey}`
      }
      }
    );
  }
}
