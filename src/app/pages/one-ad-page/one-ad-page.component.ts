import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsApiService } from '../../services/forms-api/forms-api.service';
import { BehaviorSubject, map, mergeMap, Observable, Subject, tap, zip } from 'rxjs';
import { AdForm, AdShortForm } from '../../data/formsStructure';
import { CommonModule } from '@angular/common';
import {MatChipsModule} from '@angular/material/chips'
import {MatCardModule} from '@angular/material/card';
@Component({
  selector: 'app-one-ad-page',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatCardModule],
  templateUrl: './one-ad-page.component.html',
  styleUrl: './one-ad-page.component.scss'
})
export class OneAdPageComponent {

  adForm = new Subject<{ ad: AdForm[], photoUrl: string }>();

  constructor(private route: ActivatedRoute,
     private formsAPIService: FormsApiService) {}

  ngOnInit() {
      const adId = Number(this.route.snapshot.paramMap.get('id'));
      this.formsAPIService.getFullFormById(adId).pipe(
        mergeMap((ad: AdForm[]) => 
          this.formsAPIService.getUserPhotoById(ad[0].photoId).pipe(
              map(photoUrl => ({ ad, photoUrl })) 
          )
      ),
        tap((adWithPhotos) => {
          console.log(adWithPhotos)
          this.adForm.next(adWithPhotos)
        }) // Обновляем значение allForms
      ).subscribe();
      
  }
}
