import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, map, Observable, of, tap} from 'rxjs';
import {User} from "../../data/userStructure";
import { AdShortForm } from '../../data/formsStructure';

const apiUrl = 'https://api.coliver.tech/api/v1/';

@Injectable({
  providedIn: 'root'
})
export class FormsApiService {

  constructor(private httpClient: HttpClient) { }

  getAllShortForms() {
    let user: User = JSON.parse(<string>localStorage.getItem('user'));
    if(user) return this.httpClient.get<any[]>(apiUrl + 'form/getShortFormsForUserId/' + user.jwt.userId)
    else return this.httpClient.get<any[]>(apiUrl + 'form/getShortForms')
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

  buildQueryParams(obj: { [key: string]: any }): HttpParams {
    let params = new HttpParams();

    Object.keys(obj).forEach((key) => {
      const value = obj[key];

      if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
        // Skip null, undefined, empty strings, or empty arrays
        return;
      }

      if (Array.isArray(value)) {
        // Serialize non-empty arrays as comma-separated strings
        params = params.set(key, value.join(','));
      } else {
        // Set scalar values directly
        params = params.set(key, value);
      }
    });

    return params;
  }

  flattenObject(obj: any, parentKey = '', result: any = {}): any {
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      const newKey = key;

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        this.flattenObject(value, newKey, result);
      } else {
        result[newKey] = value;
      }
    }
    return result;
  }

  getShortFormsWithFilter(userId: number, filter: any): Observable<AdShortForm []>{
    const flattenedFilters = this.flattenObject(filter);
    const params = this.buildQueryParams(flattenedFilters);
    const options = {params}
    return this.httpClient.get<AdShortForm[]>(apiUrl + 'form/getShortFormsWithFilter/' + userId, options).pipe(
      catchError(() => of([]))
    );
  }

  getShortFormsWithFilterWithoutId(filter: any): Observable<AdShortForm []>{
    const flattenedFilters = this.flattenObject(filter);
    const params = this.buildQueryParams(flattenedFilters);
    const options = {params}
    return this.httpClient.get<AdShortForm[]>(apiUrl + 'form/getWithFilterWithoutId', options).pipe(
      catchError(() => of([]))
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
