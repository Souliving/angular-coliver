import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, retry, tap } from 'rxjs';

const apiUrl = 'http://94.103.89.23:8080/api/v1/';

@Injectable({
  providedIn: 'root'
})
export class FormsApiService {

  constructor(private httpClient: HttpClient) { }

  /* allAds = new BehaviorSubject(null);
  getAllAds = () => this.allAds.asObservable(); */

  getAllShortForms (): Observable<any[]> {
    return this.httpClient.get<any>(apiUrl+'form/getShortForms')
        .pipe(catchError(() => of([]))); 
  }

  getUserPhotoById (photoId: number): Observable<string>{
    return this.httpClient.get(apiUrl+ 'image/getImageById/'+photoId, { responseType: 'blob' })
      .pipe(
        map((blob: Blob) => {
          const objectURL = URL.createObjectURL(blob);
          return objectURL;
        })
      );
  }

  getFavoritesFormsByUserID (userId: number): Observable<any[]>{
    return this.httpClient.get<any>(apiUrl+ 'form/getFavoriteFormsByUserId/'+userId)
    .pipe(catchError(() => of([])));
  }
}
