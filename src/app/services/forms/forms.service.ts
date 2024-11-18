import { Injectable } from '@angular/core';
import { BehaviorSubject, map, mergeMap, Observable, tap, zip } from 'rxjs';
import { AdShortForm } from '../../data/formsStructure';
import { FormsApiService } from '../forms-api/forms-api.service';
import { UserApiService } from '../user-api/user-api.service';

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  allForms = new BehaviorSubject<{ ad: AdShortForm, photoUrl: string }[] >([]);;
  allForms$ = () => this.allForms.asObservable();

  constructor(private formsAPIService: FormsApiService, private userApiService: UserApiService) { }

  initFormsWithPhoto() {
    this.formsAPIService.getAllShortForms().pipe(
      mergeMap((ads: AdShortForm[]) => {
        // Для каждого объявления загружаем фото
        const adsWithPhotos$ = ads.map(ad =>
          this.formsAPIService.getUserPhotoById(ad.photoId).pipe(
            map(photoUrl => ({ ad, photoUrl }))
          )
        );
        // Ожидаем завершения всех запросов и обновляем allForms
        return zip(adsWithPhotos$);
      }),
      tap((adsWithPhotos) => this.allForms.next(adsWithPhotos)) // Обновляем значение allForms
    ).subscribe();
  }

  filterFormWithPhoto( form: any){
   const userId = this.userApiService.getAuthUserValue()?.jwt.userId;
   let forms: Observable<AdShortForm[]>;
   if(userId) {
     forms = this.formsAPIService.postShortFormsWithFilter(userId, form)
   }
   else {
    forms = this.formsAPIService.postShortFormsWithFilterWithoutId(form)
   }
    forms.pipe(
      mergeMap((ads: AdShortForm[]) => {
        // Для каждого объявления загружаем фото
        const adsWithPhotos$ = ads.map(ad =>
          this.formsAPIService.getUserPhotoById(ad.photoId).pipe(
            map(photoUrl => ({ ad, photoUrl }))
          )
        );
        // Ожидаем завершения всех запросов и обновляем allForms
        return zip(adsWithPhotos$);
      }),
      tap((adsWithPhotos) => this.allForms.next(adsWithPhotos)) // Обновляем значение allForms
    ).subscribe();
  }
}
