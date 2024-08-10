import { Component, Input } from '@angular/core';
import { AdShortForm } from '../../../../data/formsStructure';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ad-card',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIcon, CommonModule],
  templateUrl: './ad-card.component.html',
  styleUrl: './ad-card.component.scss'
})
export class AdCardComponent {

  @Input() ad: { ad: AdShortForm, photoUrl: string } | null = null;

  ngOnChanges(){
    console.log(this.ad)
  }
  toFavorites = (id: number | undefined) => {
    if(id){
      console.log('favorites id', id)
    }
    
  }
}
