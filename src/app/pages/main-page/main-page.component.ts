import {Component, OnInit} from '@angular/core';
import {FormsApiService} from '../../services/forms-api/forms-api.service';
import {map, mergeMap, Observable, zip} from 'rxjs';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {AdCardComponent} from '../../components/ad-card/ad-card.component';
import {CommonModule} from '@angular/common';
import {AdShortForm} from '../../data/formsStructure';
import {FilterComponent} from '../../filter/filter.component';
import { FormsService } from '../../services/forms/forms.service';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [AdCardComponent, MatButtonModule, MatCardModule, CommonModule, FilterComponent],
  providers: [FormsApiService],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent implements OnInit {
  ads$: Observable<{ ad: AdShortForm, photoUrl: string }[]> | undefined;

  constructor(
    private formService: FormsService
  ) {
  }

  ngOnInit(){
    this.formService.initFormsWithPhoto()
    this.ads$ = this.formService.allForms$()
  }

}

