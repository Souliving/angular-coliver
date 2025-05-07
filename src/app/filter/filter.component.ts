import {Component, inject, Injector} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { CityApiService } from '../services/city-api/city-api.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { FilterLocationDialogComponent } from '../filter-location-dialog/filter-location-dialog.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSliderModule} from '@angular/material/slider';
import { FormsService } from '../services/forms/forms.service';
import {TuiButton, TuiDialogService, TuiLink} from '@taiga-ui/core';
import {TuiInputSlider} from "@taiga-ui/kit";
import {TuiNumberFormat, TuiTextfield} from '@taiga-ui/core';
import {FormsModule} from '@angular/forms';
import {TuiAccordion} from '@taiga-ui/experimental';
import {ChangeDetectionStrategy} from '@angular/core';
import {TuiInputRangeModule, TuiTextfieldControllerModule} from '@taiga-ui/legacy';
import {TuiInputModule} from '@taiga-ui/legacy';
import {TuiRange} from '@taiga-ui/kit';
import {TuiForm, TuiHeader} from '@taiga-ui/layout';
import {TuiCheckbox} from '@taiga-ui/kit';
import {TuiLabel} from '@taiga-ui/core';
import {PolymorpheusComponent} from "@tinkoff/ng-polymorpheus";
@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule,
            ReactiveFormsModule,
            MatFormFieldModule,
            MatSelectModule,
            MatInputModule,
            MatCheckboxModule,
            MatButtonModule,
            MatListModule,
            MatMenuModule,
            MatIconModule,
            MatExpansionModule,
            MatSliderModule,
            FormsModule,
      TuiForm, TuiCheckbox, TuiLabel,
            TuiAccordion,TuiInputModule, TuiRange, TuiButton, TuiInputSlider, TuiNumberFormat, TuiTextfield,TuiInputRangeModule, TuiTextfieldControllerModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {

  filterForm!: FormGroup ;

  protected readonly minAge = 18;
  protected readonly maxAge = 100;
  protected readonly sliderStepAge = 1;
  protected readonly stepsAge = (this.maxAge - this.minAge) / this.sliderStepAge;
  protected readonly quantum = 0.00001;
  protected readonly minPrice = 10000;
  protected readonly maxPrice = 250000;
  protected readonly sliderStepBudget = 5000;
  protected readonly stepsBudget = (this.minPrice - this.maxPrice) / this.sliderStepBudget;

  currentCity = {id: null, name: null}
  currentMetro = [{id: null, name: null, cityId:null}]
  readonly allPreferences = [
    { value: 'smoking', display: 'Не курит' },
    { value: 'alcohol', display: 'Не пьет' },
    { value: 'pets', display: 'Без животных' },
  ]

  constructor(
    private fb: FormBuilder,
    private cityService: CityApiService,
    private dialog: MatDialog,
    private formService: FormsService,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector
  ){}

  ngOnInit(){

    /* this.cities$ = this.cityService.getCities().pipe(
      catchError(error => {
        console.error('Ошибка загрузки городов', error);
        return of([]); // Возвращаем пустой массив в случае ошибки
      })
    ); */

    this.filterForm = this.fb.group({
      smoking: null,
      alcohol: null,
      petFriendly: null,
      isClean: null,
      age: new FormControl([18,65]),
      price: new FormControl([15000, 100000]),
      cityId: [[]],
      selectedCity: new FormControl(
        {
          id: new FormControl(null),
          name: new FormControl(null)
        }
      ),
      metroIds: [[]]
    });

  //  this.onCityChange();
  }

/*   onCityChange(){
    if(this.filterForm){
      this.filterForm.get('location.city')?.valueChanges
      .pipe(
        switchMap(city => {
          if (city) {
            return this.cityService.getMetroStations(city.id);
          } else {
            return of([]); // Возвращаем пустой массив, если город не выбран
          }
        }),
        catchError(error => {
          console.error('Ошибка загрузки станций метро', error);
          return of([]); // Возвращаем пустой массив в случае ошибки
        })
      )
      .subscribe(stations => {
        this.metroStations$ = of(stations);
      });
    }

  } */

  openFilterDialog(){
    const dialogRef = this.dialog.open(FilterLocationDialogComponent, {
      data: new FormGroup({cityId: new FormControl(this.currentCity), metroIds: new FormControl(this.currentMetro )})
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log(result.cityId)
        if(result.cityId.id == null) {
          this.filterForm.controls['cityId'].setValue([]);
        } else {
          this.filterForm.controls['cityId'].setValue([result.cityId.id]);
        }
        this.currentCity = result.cityId;
        this.currentMetro = result.metroIds
        let updatedMetroIds: any[] = [];
        result.metroIds.forEach((element: any) => {
          // Проверяем, чтобы избежать дублирования, если это необходимо
          if (!updatedMetroIds.includes(element.id)) {
            updatedMetroIds.push(element.id);
          }
        });

        // Устанавливаем значение для metroIds после завершения цикла
        if (result.metroIds[0].id != null) {
          this.filterForm.controls['metroIds'].setValue(updatedMetroIds);
        } else {
          this.filterForm.controls['metroIds'].setValue([]);
        }

      }
      console.log('The dialog was closed', result);
    });
  }

  updatePreference(preference: string, isChecked: MouseEvent) {
    console.log(preference, isChecked)
    this.filterForm.get(preference)?.setValue(isChecked);
  }

  submitForm(){
    this.formService.filterFormWithPhoto(this.filterForm.value)
    console.log(this.filterForm)
  }

  toCleanAge(){
    this.filterForm.get('age')?.patchValue({
      startAge: null,
      endAge: null
    });
  }

  toCleanPrice(){
    this.filterForm.get('price')?.patchValue({
      startPrice: null,
      endPrice: null
    });
  }

  toCleanForm(){
    this.filterForm.reset();
    this.formService.initFormsWithPhoto()
  }

}
