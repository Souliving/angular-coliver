import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AdShortForm} from '../../data/formsStructure';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {FormsApiService} from "../../services/forms-api/forms-api.service";
import {User} from "../../data/userStructure";

@Component({
  selector: 'app-ad-card',
  standalone: true,
  providers: [FormsApiService],
  imports: [MatButtonModule, MatCardModule, MatIcon, CommonModule],
  templateUrl: './ad-card.component.html',
  styleUrl: './ad-card.component.scss'
})
export class AdCardComponent {

  constructor(
    private formsAPIService: FormsApiService
  ) {
  }

  @Input() ad: { ad: AdShortForm, photoUrl: string } | null = null;
  @Output() deleteCard: EventEmitter<number> = new EventEmitter();

  ngOnChanges() {
    console.log(this.ad)
  }

  toFavorites = (id: number | undefined) => {
    if (id) {
      console.log('add favorites id', id)
    }
    let user: User = JSON.parse(<string>localStorage.getItem('user'));
    this.formsAPIService.addFavoriteFormForUserId(user.jwt.userId, id).subscribe(
      _ => this.ad!!.ad.isFavorite = true
    )

  }
  removeFavorites = (id: number | undefined) => {
    if (id) {
      console.log('remove favorites id', id)
    }
    let user: User = JSON.parse(<string>localStorage.getItem('user'));
    this.formsAPIService.deleteFavoriteFormForUserId(user.jwt.userId, id).subscribe(
      _ => {
        this.ad!!.ad.isFavorite = false;
        this.delete(id)
      }
    )

  }

  delete(id: number | undefined) {
    this.deleteCard.emit(id);
  }
}
