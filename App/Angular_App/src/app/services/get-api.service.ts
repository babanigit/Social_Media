import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGetTweets } from '../models/GetTweets';


@Injectable({
  providedIn: 'root',
})
export class GetApiService {
  private readonly apiUrl = 'http://127.0.0.1:8000/api/tweets/';

  constructor(private http: HttpClient) { }

  getTweets(
    page: number = 1,
    per_page: number = 10,
    user_id?: number,
    following_only: boolean = false
  ): Observable<IGetTweets> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', per_page.toString());

    if (user_id) {
      params = params.set('user_id', user_id.toString());
    }

    if (following_only) {
      params = params.set('following_only', 'true');
    }

    return this.http.get<IGetTweets>(this.apiUrl, { params });
  }
}
