import { Component, OnInit} from '@angular/core';
import { FormsApiService } from '../../services/forms-api.service';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { AdCardComponent } from './components/ad-card/ad-card.component';
import { CommonModule } from '@angular/common';
import { AdShortForm } from '../../data/formsStructure';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [AdCardComponent, MatButtonModule, MatCardModule, CommonModule],
  providers: [FormsApiService],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent implements OnInit {
  ads$: Observable<{ ad: AdShortForm, photoUrl: string }[]> | undefined;

  constructor(
    private formsAPIService: FormsApiService
  ){}


  ngOnInit(){
    this.ads$ = this.formsAPIService.getAllShortForms().pipe(
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

