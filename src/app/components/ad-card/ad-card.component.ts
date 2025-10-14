import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AdShortForm} from '../../data/formsStructure';
import {CommonModule} from '@angular/common';
import {FormsApiService} from "../../services/forms-api/forms-api.service";
import {User} from "../../data/userStructure";
import { Router } from '@angular/router';
import {TuiAppearance, TuiButton, TuiIcon, TuiTitle} from "@taiga-ui/core";
import {TuiCardLarge, TuiHeader} from "@taiga-ui/layout";
import {TuiChip} from "@taiga-ui/kit";
import { AgeWordPipe } from '../../pipe/age-word.pipe';
import { UserApiService } from '../../services/user-api/user-api.service';

@Component({
  selector: 'app-ad-card',
  standalone: true,
  providers: [FormsApiService],
  imports: [CommonModule, TuiAppearance, TuiCardLarge,TuiIcon, TuiHeader, TuiTitle, TuiButton, TuiChip, AgeWordPipe],
  templateUrl: './ad-card.component.html',
  styleUrl: './ad-card.component.scss'
})
export class AdCardComponent {
  isAuth = this.userApiService.getToken()
  
  constructor(
    private formsAPIService: FormsApiService,
    private router: Router,
    private userApiService: UserApiService
  ) {
  }

  @Input() ad: { ad: AdShortForm, photoUrl: string } | null = null;
  @Output() deleteCard: EventEmitter<number> = new EventEmitter();

  ngOnChanges() {
   // console.log(this.ad)
  }

  toFavorites = (id: number | undefined, event: MouseEvent) => {
    event.stopPropagation();
    if (id) {
      //console.log('add favorites id', id)
    }
    let user: User = JSON.parse(<string>localStorage.getItem('user'));
    this.formsAPIService.addFavoriteFormForUserId(user.jwt.userId, id).subscribe(
      _ => this.ad!!.ad.isFavorite = true
    )

  }
  removeFavorites = (id: number | undefined, event: MouseEvent) => {
    event.stopPropagation();
    if (id) {
     // console.log('remove favorites id', id)
    }
    let user: User = JSON.parse(<string>localStorage.getItem('user'));
    this.formsAPIService.deleteFavoriteFormForUserId(user.jwt.userId, id).subscribe(
      _ => {
        this.ad!!.ad.isFavorite = false;
        this.delete(id)
      }
    )

  }

  toAdPage(){
    console.log('ad', this.ad)
    if (this.ad?.ad?.id) {
      this.router.navigate(['/ad', this.ad.ad.id]); // Переход на страницу объявления
  }
  }

  delete(id: number | undefined) {
    this.deleteCard.emit(id);
  }
}
