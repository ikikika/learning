import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, tap } from 'rxjs';

interface UsernameAvailableResponse {
  available: boolean;
}

interface SignupCredentials {
  username: string;
  password: string;
  passwordConfirmation: string;
}

interface SignupResponse {
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  signedin$ = new BehaviorSubject(false); // dollar sign indicates an observable

  constructor(private http: HttpClient) {}

  usernameAvailable(username: string) {
    return this.http.post<UsernameAvailableResponse>(
      `${environment.apiUrl}/auth/username`,
      {
        username,
      }
    );
  }

  signup(credentials: SignupCredentials) {
    return this.http
      .post<SignupResponse>(`${environment.apiUrl}/auth/signup`, credentials)
      .pipe(
        // tap allows us to reach in, intercept a value and do something with it
        // tap does not transform the underlying value
        // the pipe will be skipped if there is an error with api call
        tap(() => {
          this.signedin$.next(true);
        })
      );
  }
}
