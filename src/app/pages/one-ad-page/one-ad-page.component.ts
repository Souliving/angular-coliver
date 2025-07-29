import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsApiService } from '../../services/forms-api/forms-api.service';
import { BehaviorSubject, map, mergeMap, Observable, Subject, tap, zip } from 'rxjs';
import { AdForm, AdShortForm } from '../../data/formsStructure';
import { CommonModule } from '@angular/common';
import { TuiTabs } from '@taiga-ui/kit';
import { FormsModule } from '@angular/forms';
import { AdPersonInfoComponent } from '../../components/ad-person-info/ad-person-info.component';
import { AdHouseInfoComponent } from '../../components/ad-house-info/ad-house-info.component';
import { ReviewComponent } from '../../components/review/review.component';
@Component({
  selector: 'app-one-ad-page',
  standalone: true,
  imports: [CommonModule, TuiTabs, FormsModule, AdPersonInfoComponent, AdHouseInfoComponent, ReviewComponent],
  templateUrl: './one-ad-page.component.html',
  styleUrl: './one-ad-page.component.scss'
})
export class OneAdPageComponent {
   activeItemIndex = 0;
  adForm = new Subject<{ ad: AdForm[], photoUrl: string }>();

  constructor(private route: ActivatedRoute,
     private formsAPIService: FormsApiService) {}

  ngOnInit() {
    const adId = Number(this.route.snapshot.paramMap.get('id'));
    this.formsAPIService.getFullFormById(adId).pipe(
      tap((ad: AdForm[]) => {
        const adWithPhotos = {
          ad: ad,
          photoUrl: ad[0].imageLink!!
        };
        console.log(adWithPhotos);
        this.adForm.next(adWithPhotos);
      })
    ).subscribe();

  }

  changeTab(index: number){
    this.activeItemIndex = index
  }

}
