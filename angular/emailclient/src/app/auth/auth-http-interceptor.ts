import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEventType,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthHttpInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Modify or log the outgoing request
    const modifiedReq = req.clone({
      withCredentials: true,
    });

    return next.handle(modifiedReq);

    // return next.handle(modifiedReq).pipe(
    //   tap((event) => {
    //     // can use other operators to msufy or log the response
    //     if (event.type === HttpEventType.Response) {
    //       // Handle the response if needed
    //       console.log('Response received:', event);
    //     }
    //     if (event.type === HttpEventType.Sent) {
    //       // Handle the request being sent if needed
    //       console.log('Request sent:', event);
    //     }
    //   })
    // );
  }
}
