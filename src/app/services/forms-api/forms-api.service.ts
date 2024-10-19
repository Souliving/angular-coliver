import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, map, Observable, of, tap} from 'rxjs';
import {User} from "../../data/userStructure";

const apiUrl = 'https://api.coliver.tech/api/v1/';

@Injectable({
  providedIn: 'root'
})
export class FormsApiService {

  constructor(private httpClient: HttpClient) { }

  /* allAds = new BehaviorSubject(null);
  getAllAds = () => this.allAds.asObservable(); */

  getAllShortForms() {
    let user: User = JSON.parse(<string>localStorage.getItem('user'));
    return this.httpClient.get<any[]>(apiUrl + 'form/getShortFormsForUserId/' + user.jwt.userId)
  }

  getUserPhotoById (photoId: number): Observable<string>{
      return this.httpClient.get<string>('https://images.coliver.tech/getImageById/'+photoId,   { responseType: 'text' as 'json' } )
        .pipe(
          catchError(() => of(''))
        );
  }

  /* getUserPhotoByUserId(userId: number):  Observable<string>{
    return this.httpClient.get(apiUrl+ 'image/getImageByUserId/'+userId, { responseType: 'blob' })
      .pipe(
        map((blob: Blob) => {
          const objectURL = URL.createObjectURL(blob);
          return objectURL;
        })
      );
  } */

  getUserPhotoByUserId(userId: number):  Observable<string>{
    return this.httpClient.get<string>('https://images.coliver.tech/getImageByUserId/'+userId,   { responseType: 'text' as 'json' } )
      .pipe(
        catchError(() => of(''))
      );
  }

  uploadPhotoByUserId(userId:number, photo:any): Observable<string>{
    const headers = new HttpHeaders({
      'Content-Type': 'image/png'
    });

    return this.httpClient.post<any>('https://images.coliver.tech/uploadImageByUserId/', photo, { headers: headers })
      .pipe(
        catchError( error => of(error))
      )
  }
  getFavoritesFormsByUserID (userId: number): Observable<any[]>{
    return this.httpClient.get<any>(apiUrl+ 'form/getFavoriteFormsByUserId/'+userId)
    .pipe(catchError(() => of([])));
  }

  addFavoriteFormForUserId(userId: number, formId: number | undefined): Observable<any> {
    const body = {userId: userId, favFormId: formId};
    return this.httpClient.put<any>(apiUrl + 'form/addFavoriteForm', body).pipe();
  }

  deleteFavoriteFormForUserId(userId: number, formId: number | undefined): Observable<any> {
    const body = {userId: userId, favFormId: formId};
    return this.httpClient.request<any>('delete', apiUrl + 'form/deleteFavoriteForm', {body: body}).pipe();
  }
}
