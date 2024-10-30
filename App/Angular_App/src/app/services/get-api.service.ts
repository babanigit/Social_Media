import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { IGetTweets } from '../models/GetTweets';
import { ILoginResponse, IRegisterResponse } from '../models/RegAndLog';
import { ILoggedInUser } from '../models/LoggedInUser';


@Injectable({
  providedIn: 'root',
})
export class GetApiService {

  private apiUrl = 'http://localhost:8000/api/'; // Replace with your Django API URL

  constructor(private http: HttpClient) { }

  storeToLocalStorage() {
    const token = localStorage.getItem('auth_token');  // Retrieve token from local storage
    console.log("the token is: " + JSON.stringify(token));
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });
    return headers;
  }

  getTokenFromCookieOrLocalStorage(): string | null {
    try {
      // Try to retrieve token from cookies
      const cookies = document.cookie.split('; ');
      const authTokenCookie = cookies.find(row => row.startsWith('auth_token='));
      if (authTokenCookie) {
        const token = authTokenCookie.split('=')[1];
        return token;
      }

      // Fallback to local storage if cookie is not found
      const token = localStorage.getItem('auth_token');
      if (token) {
        return token;
      }

      // No token found in either cookies or local storage
      console.error('No auth token found');
      return null;
    } catch (error) {
      console.error('Error retrieving auth token:', error);
      return null;
    }
  }

  register(userData: FormData): Observable<IRegisterResponse> {
    return this.http.post<IRegisterResponse>(this.apiUrl + 'register/', userData);
  }

  login(username: string, password: string): Observable<ILoginResponse> {
    const loginData = { username, password };
    return this.http.post<ILoginResponse>(this.apiUrl + 'login/', loginData, {
      withCredentials: true, // To handle cookies
    });
  }

  getLoggedInUser(page: number = 1): Observable<ILoggedInUser> {
    // Retrieve the auth token from cookies or local storage
    const token = this.getTokenFromCookieOrLocalStorage();

    // Check if the token is available
    if (!token) {
      console.error('Authorization token missing');
      return throwError('Authorization token missing');
    }

    // Set the Authorization header
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });

    // Create query parameters for pagination
    const params = new HttpParams().set('page', page.toString());

    // Make the GET request to fetch the logged-in user data
    return this.http.get<ILoggedInUser>(this.apiUrl + 'user/', { headers, params })
      .pipe(
        catchError((error) => {
          console.error('Error loading user data:', error);
          return throwError('Error loading user data'); // Propagate the error
        })
      );
  }

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

    return this.http.get<IGetTweets>(this.apiUrl + 'tweets/', { params });
  }


  createTweet(content: string, image?: File): Observable<any> {

    const formData = new FormData();
    formData.append('content', content);
    if (image) {
      formData.append('image', image, image.name);
    }

    const token = this.getTokenFromCookieOrLocalStorage();

    if (!token) {
      console.error('Authorization token missing');
      return throwError('Authorization token missing');
    }

    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });

    return this.http.post(this.apiUrl + 'tweets/create/', formData, { headers });
  }

  likeTweet(tweetId: string): Observable<any> {
    const token = this.getTokenFromCookieOrLocalStorage();

    if (!token) {
      console.error('Authorization token missing');
      return throwError('Authorization token missing');
    }

    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });

    return this.http.post(`${this.apiUrl}tweets/${tweetId}/like/`, null, { headers });
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
