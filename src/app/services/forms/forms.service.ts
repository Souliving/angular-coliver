import { Injectable } from '@angular/core';
import { BehaviorSubject, map, mergeMap, Observable, of, tap, zip } from 'rxjs';
import { AdShortForm } from '../../data/formsStructure';
import { FormsApiService } from '../forms-api/forms-api.service';
import { UserApiService } from '../user-api/user-api.service';

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  allForms = new BehaviorSubject<{ ad: AdShortForm, photoUrl: string }[]>([]);
  allForms$ = () => this.allForms.asObservable();

  constructor(private formsAPIService: FormsApiService, private userApiService: UserApiService) { }

  initFormsWithPhoto() {
    this.formsAPIService.getAllShortForms().pipe(
      tap((adsWithPhotos: AdShortForm[]) => {
        this.allForms.next(adsWithPhotos.map(ad => ({ ad, photoUrl: ad.imageLink || '' })));
      })
    ).subscribe();
  }

  filterFormWithPhoto(form: any) {
    const userId = this.userApiService.getAuthUserValue()?.jwt.userId;
    let forms: Observable<{ ad: AdShortForm, photoUrl: string }[]>;
    if (userId) {
      forms = this.formsAPIService.getShortFormsWithFilter(userId, form);
    } else {
      forms = this.formsAPIService.getShortFormsWithFilterWithoutId(form);
    }
    forms.pipe(
      tap((adsWithPhotos) => {
        console.log('get filtered forms', adsWithPhotos);
        this.allForms.next(adsWithPhotos);
      })
    ).subscribe();
  }
}
