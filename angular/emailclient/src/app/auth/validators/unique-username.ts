import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UniqueUsername implements AsyncValidator {
  constructor(private http: HttpClient) {}

  validate = (control: AbstractControl): Observable<ValidationErrors | null> => {
    const { value } = control;

    console.log('Validating username:', value);
    console.log(this.http);
    return of(null); 
  };
}
