import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsApiService } from '../../services/forms-api/forms-api.service';
import { BehaviorSubject, map, mergeMap, Observable, Subject, tap, zip } from 'rxjs';
import { AdForm, AdShortForm } from '../../data/formsStructure';
import { ChatApiService } from '../../services/chat-api/chat-api.service';
import { CommonModule } from '@angular/common';
import { TuiTabs } from '@taiga-ui/kit';
import { FormsModule } from '@angular/forms';
import { AdPersonInfoComponent } from '../../components/ad-person-info/ad-person-info.component';
import { AdHouseInfoComponent } from '../../components/ad-house-info/ad-house-info.component';
import { ReviewComponent } from '../../components/review/review.component';
import { tuiDialog, TuiDialogService } from '@taiga-ui/core';
import { ComplaintDialogComponent } from '../../dialogs/complaint-dialog/complaint-dialog.component';
@Component({
  selector: 'app-one-ad-page',
  standalone: true,
  imports: [CommonModule, TuiTabs, FormsModule, AdPersonInfoComponent, AdHouseInfoComponent, ReviewComponent],
  templateUrl: './one-ad-page.component.html',
  styleUrl: './one-ad-page.component.scss'
})
export class OneAdPageComponent {
  private readonly dialog = tuiDialog(ComplaintDialogComponent, {
        dismissible: true,
        label: 'Жалоба',
    });
  activeItemIndex = 0;
  adForm = new Subject<{ ad: AdForm[], photoUrl: string }>();
  private currentAd: AdForm | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formsAPIService: FormsApiService,
    private chatApiService: ChatApiService
  ) {}

  ngOnInit() {
    const adId = Number(this.route.snapshot.paramMap.get('id'));
    this.formsAPIService.getFullFormById(adId).pipe(
      tap((ad: AdForm[]) => {
        this.currentAd = ad[0];
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

  openModal(){
    this.dialog('').subscribe({
            next: (data) => {
                console.info(`Dialog emitted data = ${data}`);
            },
            complete: () => {
                console.info('Dialog closed');
            },
        });
  }

  startChat(): void {
    if (!this.currentAd?.userId) {
      console.error('No user ID available');
      return;
    }

    this.chatApiService.getOrCreateChat(this.currentAd.userId).subscribe({
      next: (chat) => {
        this.router.navigate(['/chat'], { queryParams: { chatId: chat.id } });
      },
      error: (err) => {
        console.error('Failed to create chat:', err);
      }
    });
  }

}
