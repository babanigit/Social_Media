// import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError, timeout } from 'rxjs';
import { IGetTweets } from '../models/GetTweets';
import { ILoginResponse, IRegisterResponse } from '../models/RegAndLog';
import { ILoggedInUser } from '../models/LoggedInUser';

import { isPlatformBrowser } from '@angular/common';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { IGetAllUsers } from '../models/UsersTweets';

@Injectable({
  providedIn: 'root',
})
export class GetApiService {
  private apiUrl = 'http://localhost:8000/api'; // Replace with your Django API URL

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {}

  // get token from local storage or cookie
  getTokenFromCookieOrLocalStorage(): string | null {
    // Check if we are running in the browser
    if (!isPlatformBrowser(this.platformId)) {
      console.warn(
        'localStorage and document.cookie are not available in this environment.'
      );
      return null; // Return null if not in the browser
    }

    // Attempt to retrieve the token from local storage first
    const tokenFromLocalStorage = localStorage.getItem('auth_token');
    if (tokenFromLocalStorage) {
      // console.log('got token from local storage');
      return tokenFromLocalStorage;
    }

    // If not found, try to retrieve the token from cookies
    try {
      const cookies = document.cookie.split('; ');

      for (const cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key.trim() === 'auth_token') {
          // console.log('got token from cookie');
          return decodeURIComponent(value); // Return the token after decoding
        }
      }
    } catch (error) {
      console.error(
        '[get-api-serV-error]:- Error retrieving auth token from cookies:',
        error
      );
    }

    // If no token is found in either local storage or cookies, log the error
    console.error(
      '[get-api-serV-error]:- No auth token found. Authorization token missing or expired.'
    );
    return null;
  }

  // register and login
  register(userData: FormData): Observable<IRegisterResponse> {
    return this.http.post<IRegisterResponse>(
      this.apiUrl + '/register/',
      userData
    );
  }

  login(username: string, password: string): Observable<ILoginResponse> {
    const loginData = { username, password };
    return this.http.post<ILoginResponse>(this.apiUrl + '/login/', loginData, {
      withCredentials: true, // To handle cookies
    });
  }

  // get logged in user
  getLoggedInUser(page: number = 1): Observable<ILoggedInUser> {
    // Retrieve the auth token from cookies or local storage
    const token = this.getTokenFromCookieOrLocalStorage();

    // Check if the token is available
    if (!token) {
      console.error('[get-api-serV-error]:- Authorization token missing');
      return throwError('Authorization token missing');
    }

    // Set the Authorization header
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });

    // Create query parameters for pagination
    const params = new HttpParams().set('page', page.toString());

    // Make the GET request to fetch the logged-in user data
    return this.http
      .get<ILoggedInUser>(this.apiUrl + '/user/', { headers, params })
      .pipe(
        catchError((error) => {
          console.error(
            '[get-api-serV-error]:- Error loading logged in User :',
            error
          );
          throw error;
        })
      );
  }

  // get tweets
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

    return this.http.get<IGetTweets>(this.apiUrl + '/tweets/', { params }).pipe(
      catchError((error) => {
        console.error(
          '[get-api-serV-error]:- Error loading get Tweets :',
          error
        );
        throw error;
      })
    );
  }

  //get all users
  getAllUsers(
    page: number = 1,
    per_page: number = 10,
    user_id?: number,
    following_only: boolean = false
  ): Observable<IGetAllUsers> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', per_page.toString());

    if (user_id) {
      params = params.set('user_id', user_id.toString());
    }

    if (following_only) {
      params = params.set('following_only', 'true');
    }

    return this.http
      .get<IGetAllUsers>(this.apiUrl + '/getUsers/', { params })
      .pipe(
        catchError((error) => {
          console.error(
            '[get-api-serV-error]:- Error loading get Tweets :',
            error
          );
          throw error;
        })
      );
  }

  getTweetById(tweetId: string): Observable<any> {
    const token = this.getTokenFromCookieOrLocalStorage();

    if (!token) {
      console.error('[get-api-serV-error]:- Authorization token missing');
      return throwError('Authorization token missing');
    }

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });

    return this.http.get(`${this.apiUrl}/tweet/${tweetId}/tweet`).pipe(
      catchError((error) => {
        console.error(
          '[get-api-serV-error]:- Error loading like get tweet by id :',
          error
        );
        throw error;
      })
    );
  }

  createTweet(content: string, image?: File): Observable<any> {
    const formData = new FormData();
    formData.append('content', content);
    if (image) {
      formData.append('image', image, image.name);
    }

    const token = this.getTokenFromCookieOrLocalStorage();

    if (!token) {
      console.error('[get-api-serV-error]:- Authorization token missing');
      return throwError('Authorization token missing');
    }

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });

    return this.http
      .post(this.apiUrl + '/tweets/create/', formData, { headers })
      .pipe(
        catchError((error) => {
          console.error(
            '[get-api-serV-error]:- Error loading create Tweet :',
            error
          );
          throw error;
        })
      );
  }

  likeTweet(tweetId: string): Observable<any> {
    const token = this.getTokenFromCookieOrLocalStorage();

    if (!token) {
      console.error('[get-api-serV-error]:- Authorization token missing');
      return throwError('Authorization token missing');
    }

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });

    return this.http
      .post(`${this.apiUrl}/tweets/${tweetId}/like/`, null, { headers })
      .pipe(
        catchError((error) => {
          console.error(
            '[get-api-serV-error]:- Error loading like tweet :',
            error
          );
          throw error;
        })
      );
  }

  getTweetComments(tweetId: string): Observable<any> {
    const url = `${this.apiUrl}/tweets/${tweetId}/postGetComments/`;
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error(
          '[get-api-serV-error]:- Error loading get Tweet Comments :',
          error
        );
        throw error;
      })
    );
  }

  likeComment(tweetId: string): Observable<any> {
    const token = this.getTokenFromCookieOrLocalStorage();

    if (!token) {
      console.error('[get-api-serV-error]:- Authorization token missing');
      return throwError('Authorization token missing');
    }

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });

    return this.http
      .post(`${this.apiUrl}/tweets/${tweetId}/likeComment/`, null, { headers })
      .pipe(
        // timeout(100), // Simulate a request timeout after 100ms
        catchError((error) => {
          console.error('[get-api-serV-error]:- ', error);
          throw error;
        })
      );
  }

  dislikeComment(tweetId: string): Observable<any> {
    const token = this.getTokenFromCookieOrLocalStorage();

    if (!token) {
      console.error('[get-api-serV-error]:- Authorization token missing');
      return throwError('Authorization token missing');
    }

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });

    return this.http
      .post(`${this.apiUrl}/tweets/${tweetId}/dislikeComments/`, null, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error(
            '[get-api-serV-error]:- Error loading like tweet :',
            error
          );
          throw error;
        })
      );
  }

  // storeTokenFromCookie() {
  //   const cookies = document.cookie.split('; ');
  //   const authTokenCookie = cookies.find(row => row.startsWith('auth_token='));

  //   if (authTokenCookie) {
  //     console.log("stored on local host")
  //     const token = authTokenCookie.split('=')[1];
  //     localStorage.setItem('auth_token', token);
  //   }
  // }
}
