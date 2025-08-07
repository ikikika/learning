import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UniqueUsername implements AsyncValidator {
  constructor(private http: HttpClient) {}

  validate = (
    control: AbstractControl
  ): Observable<ValidationErrors | null> => {
    const { value } = control;

    // console.log('Validating username:', value);
    // console.log(this.http);
    // return of(null);

    return this.http
      .post<any>('https://api.angular-email.com/auth/username', {
        username: value,
      })
      .pipe(
        map((value) => {
          return null; // this api is configured if the username is available, it returns null
        }),
        catchError((err) => {
          if (err.error.username) {
            return of({ nonUniqueUsername: true }); // of operator creates an observable that emits the error object
        } else {
            // eg, if the server is down
            return of({ noConnection: true });
          }
        })
      );
  };
}
