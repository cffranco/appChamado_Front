import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const started = Date.now();
    return next.handle(req).pipe(
      tap(
        event => {
          if (event instanceof HttpResponse) {
            const elapsed = Date.now() - started;
            console.log(`Request for ${req.urlWithParams} took ${elapsed} ms.`);
          }
        },
        error => {
          if (error instanceof HttpErrorResponse) {
            console.error(`Request for ${req.urlWithParams} failed with status ${error.status}: ${error.message}`);
          }
        }
      )
    );
  }
}