import { Component } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { AdShortForm } from '../../data/formsStructure';
import { FormsApiService } from '../../services/forms-api/forms-api.service';
import { AdCardComponent } from '../../components/ad-card/ad-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { UserApiService } from '../../services/user-api/user-api.service';

@Component({
  selector: 'app-favorite-ads',
  standalone: true,
  imports:[AdCardComponent, MatButtonModule, MatCardModule, CommonModule],
  templateUrl: './favorite-ads.component.html',
  styleUrl: './favorite-ads.component.scss'
})
export class FavoriteAdsComponent {

  ads$: Observable<{ ad: AdShortForm, photoUrl: string }[]> | undefined;

  constructor(private formsAPIService: FormsApiService, private userApiService: UserApiService){}

  ngOnInit(){
    const userId = this.userApiService.getAuthUserValue()?.jwt.userId;
    this.ads$ = this.formsAPIService.getFavoritesFormsByUserID(userId || 0).pipe(
      switchMap((ads: AdShortForm[]) => {
        // Для каждого объявления загружаем фото
        const adsWithPhotos$ = ads.map(ad =>
          this.formsAPIService.getUserPhotoById(ad.photoId).pipe(
            map(photoUrl => ({ ad, photoUrl }))
          )
        );
        // Ожидаем завершения всех запросов
        return forkJoin(adsWithPhotos$);
      })
    );
  }
}
