import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';
import { User, UserData } from '../../data/userStructure';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

const apiUrl = 'https://api.coliver.tech/api/v1/';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {


  authUser = new BehaviorSubject<User | null>(null);

  constructor(private httpClient: HttpClient, private router: Router) {}


  // Метод для авторизации пользователя (например, после успешного входа)
  setAuthUser(user: User) {
    this.authUser.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getAuthUser(): Observable<User | null> {
    return this.authUser.asObservable();
  }

  getAuthUserValue(): User | null {
    return this.authUser.value;
  }

  isAuthUser() {
    return !!this.getAuthUserValue();
  }

  registration(userData: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.httpClient.post<any>(apiUrl+'auth/register', userData, { headers: headers })
      .pipe(
        catchError(this.handleError)
      ).subscribe(
        (response) => {
          // Обработка успешного ответа
          this.authUser.next(response)
          localStorage.setItem('user', JSON.stringify(response))
          console.log('Registration successful', response);
          
          // Перенаправление на другой маршрут, например, на страницу логина
          this.router.navigate(['/main']);
        },
        (error) => {
          // Обработка ошибок
          console.error('Registration failed', error);
        }
      );;
  }

  private handleError(error: any): Observable<never> {
    console.error('Ошибка запроса:', error);
    return throwError(error);
  }

  logIn(userData: Partial<{ email: string | null; password: string | null; }>) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.httpClient.post<any>(apiUrl+'auth/login', userData, { headers: headers })
      .pipe(
        catchError(this.handleError)
      ).subscribe(
        (response) => {
          // Обработка успешного ответа
          this.authUser.next(response)
          localStorage.setItem('user', JSON.stringify(response))
          console.log('Registration successful', response);
          
          // Перенаправление на другой маршрут, например, на страницу логина
          this.router.navigate(['/main']);
        },
        (error) => {
          // Обработка ошибок
          console.error('Registration failed', error);
        }
      );;
    
  }

  logOut() {
    localStorage.removeItem('user');

    this.authUser.next(null);

    this.router.navigate(['/main']);
  }

  getUserById(id:number):Observable<UserData>{
    return this.httpClient.get<UserData>(apiUrl+ 'users/'+id)
  }

  updateUserInfo(id:number, userData: any){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.httpClient.post<any>(apiUrl+'users/fillUser/'+id, userData, { headers: headers })
  }
}
