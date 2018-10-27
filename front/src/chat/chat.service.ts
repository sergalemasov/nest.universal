import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IMessage } from 'src/events/models/message';
import { IUser } from 'src/events/models/user';

export class HttpError extends Error {
  url: string;
  status: number;
  statusText: string;
  headers: HttpHeaders;
  error: any;

  constructor(errorResponse: HttpErrorResponse) {
      super();

      const {
          status,
          error,
          headers,
          statusText,
          url
      } = errorResponse;

      this.message = `Http ${status}. ${error}.`;
      this.error = error;
      this.headers = headers;
      this.statusText = statusText;
      this.url = url;
  }
}

@Injectable()
export class ChatService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  public sendMessage(message: IMessage) {
    return this.http.post<IMessage>(`${this.apiUrl}/messages`, message)
      .pipe(
        catchError(error => this.handleError(error))
      );

  }

  public getAllMessages(): Observable<IMessage[]> {
    return this.http.get<IMessage[]>(`${this.apiUrl}/messages`)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  public getUserDetails(uid: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiUrl}/user/${uid}`)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  private handleError(errorResponse: HttpErrorResponse): Observable<never> {
    const isClientSideError = errorResponse.error instanceof ErrorEvent;

    if (isClientSideError) {
        return throwError(errorResponse);
    }

    return throwError(new HttpError(errorResponse));
  }
}
