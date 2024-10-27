import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGetTweets } from '../models/GetTweets';
import { ILoginResponse, IRegisterResponse } from '../models/RegAndLog';


@Injectable({
  providedIn: 'root',
})
export class GetApiService {
  private readonly apiUrl = 'http://127.0.0.1:8000/api/tweets/';
  private readonly registerUrl = 'http://127.0.0.1:8000/api/register/';
  private readonly loginUrl = 'http://127.0.0.1:8000/api/login/';

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

  register(userData: FormData): Observable<IRegisterResponse> {
    return this.http.post<IRegisterResponse>(this.registerUrl, userData);
  }

  login(username: string, password: string): Observable<ILoginResponse> {
    const loginData = { username, password };
    return this.http.post<ILoginResponse>(this.loginUrl, loginData, {
      withCredentials: true, // To handle cookies
    });
  }

  storeTokenFromCookie() {
    const cookies = document.cookie.split('; ');
    const authTokenCookie = cookies.find(row => row.startsWith('auth_token='));

    if (authTokenCookie) {
      const token = authTokenCookie.split('=')[1];
      localStorage.setItem('auth_token', token);
    }
  }

}
