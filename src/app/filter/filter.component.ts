import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import {
  FilterLocationDialogComponent
} from '../filter-location-dialog/filter-location-dialog.component';
import {TuiButton, tuiDialog, TuiDropdown, TuiIcon, TuiLabel} from '@taiga-ui/core';
import {City, Subway} from '../data/formsStructure';
import {TuiInputRangeModule, TuiTextfieldControllerModule} from "@taiga-ui/legacy";
import {FormsService} from "../services/forms/forms.service";
import {TuiForm} from "@taiga-ui/layout";
import {TuiCheckbox} from "@taiga-ui/kit";

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule, TuiButton, TuiInputRangeModule, TuiTextfieldControllerModule, TuiForm, TuiLabel, TuiCheckbox, TuiDropdown, TuiIcon,
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {

  filterForm!: FormGroup;

  preferencesOpen = false;
  ageOpen = false;
  priceOpen = false;

  protected readonly minAge = 18;
  protected readonly maxAge = 100;
  protected readonly sliderStepAge = 1;
  protected readonly stepsAge = (this.maxAge - this.minAge) / this.sliderStepAge;
  protected readonly quantum = 0.00001;
  protected readonly minPrice = 10000;
  protected readonly maxPrice = 250000;
  protected readonly sliderStepBudget = 5000;
  protected readonly stepsBudget = (this.minPrice - this.maxPrice) / this.sliderStepBudget;

  currentCity: City = {id: null, name: null}
  currentMetro: Subway[] = [{id: null, name: null, cityId: null}]
  readonly allPreferences = [
    {value: 'smoking', display: 'Не курит'},
    {value: 'alcohol', display: 'Не пьет'},
    {value: 'pets', display: 'Без животных'},
  ]
  private readonly dialogTui = tuiDialog(FilterLocationDialogComponent, {
    dismissible: true,

  });

  constructor(
      private fb: FormBuilder,
      private formService: FormsService,
  ) {
  }

  ngOnInit() {

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
      age: new FormControl([18, 65]),
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


  openFilterDialog() {
    const data = new FormGroup({
      cityId: new FormControl<City>(this.currentCity),
      metroIds: new FormControl<Subway[]>(this.currentMetro)
    })

    this.dialogTui(data).subscribe({
      next: (result) => {
        if (result) {
          console.log(result.get('cityId')?.value)
          if (result.get('cityId')?.value.id == null) {
            console.log('if null')
            this.filterForm.controls['cityId'].setValue([]);
          } else {
            this.filterForm.controls['cityId'].setValue([result.get('cityId')?.value.id]);
          }
          this.currentCity = result.get('cityId')?.value;
          console.log('old metro', this.currentMetro)
          this.currentMetro = result.get('metroIds')?.value
          console.log('new metro', this.currentMetro)
          let updatedMetroIds: any[] = [];
          //console.log('check', result.get('metroIds')?.value)
          this.currentMetro.forEach((element: any) => {
            // Проверяем, чтобы избежать дублирования, если это необходимо
            if (!updatedMetroIds.includes(element.id)) {
              updatedMetroIds.push(element.id);
            }
          });

          // Устанавливаем значение для metroIds после завершения цикла

          if (result.get('metroIds')?.value[0].id != null) {
            console.log('updated', updatedMetroIds)
            this.filterForm.controls['metroIds'].setValue(updatedMetroIds);
          } else {
            this.filterForm.controls['metroIds'].setValue([]);
          }

        }
        console.log('The dialog was closed', result);
      },
      complete: () => {
        console.info('Dialog closed');
      },
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   if(result) {
    //     console.log(result.cityId)
    //     if(result.cityId.id == null) {
    //       this.filterForm.controls['cityId'].setValue([]);
    //     } else {
    //       this.filterForm.controls['cityId'].setValue([result.cityId.id]);
    //     }
    //     this.currentCity = result.cityId;
    //     this.currentMetro = result.metroIds
    //     let updatedMetroIds: any[] = [];
    //     result.metroIds.forEach((element: any) => {
    //       // Проверяем, чтобы избежать дублирования, если это необходимо
    //       if (!updatedMetroIds.includes(element.id)) {
    //         updatedMetroIds.push(element.id);
    //       }
    //     });
    //
    //     // Устанавливаем значение для metroIds после завершения цикла
    //     if (result.metroIds[0].id != null) {
    //       this.filterForm.controls['metroIds'].setValue(updatedMetroIds);
    //     } else {
    //       this.filterForm.controls['metroIds'].setValue([]);
    //     }
    //
    //   }
    //   console.log('The dialog was closed', result);
    // });
  }

  updatePreference(preference: string, isChecked: MouseEvent) {
    console.log(preference, isChecked)
    this.filterForm.get(preference)?.setValue(isChecked);
  }

  submitForm() {
    this.formService.filterFormWithPhoto(this.filterForm.value)
    console.log(this.filterForm)
  }

  toCleanAge() {
    this.filterForm.get('age')?.patchValue({
      startAge: null,
      endAge: null
    });
  }

  toCleanPrice() {
    this.filterForm.get('price')?.patchValue({
      startPrice: null,
      endPrice: null
    });
  }

  toCleanForm() {
    this.currentCity = {id: null, name: null}
    this.currentMetro = [{id: null, name: null, cityId: null}]
    this.filterForm.reset({
      smoking: null,
      alcohol: null,
      petFriendly: null,
      isClean: null,
      age: [this.minAge, 65],
      price: [15000, 100000],
      cityId: [],
      selectedCity: {id: null, name: null},
      metroIds: []
    });
    this.formService.initFormsWithPhoto()
  }

}

// export class FilterComponent implements OnInit {
//   // @ts-ignore
//   currentCity: City = { id: null, name: null };
//   currentMetro: Subway[] = [{ id: null, name: null, cityId: null }];
//   filterForm!: FormGroup;
//   private readonly dialogTui = tuiDialog(FilterLocationDialogComponent, {
//     dismissible: true,
//   });
//   constructor(private fb: FormBuilder) {}
//
//   ngOnInit() {
//     this.filterForm = this.fb.group({
//       smoking: null,
//       alcohol: null,
//       petFriendly: null,
//       isClean: null,
//       age: new FormControl([18, 65]),
//       price: new FormControl([15000, 100000]),
//       cityId: [[]],
//       metroIds: [[]],
//     });
//   }
//   openFilterDialog() {
//     console.log('start metro', this.currentMetro);
//     const data = new FormGroup({
//       cityId: new FormControl<City>(this.currentCity),
//       metroIds: new FormControl<Subway[]>(this.currentMetro),
//     });
//
//     this.dialogTui(data).subscribe({
//       next: (result) => {
//         if (result) {
//           console.log(result.get('cityId')?.value);
//           if (result.get('cityId')?.value.id == null) {
//             console.log('if null');
//             this.filterForm.controls['cityId'].setValue([]);
//           } else {
//             this.filterForm.controls['cityId'].setValue([
//               result.get('cityId')?.value.id,
//             ]);
//           }
//           this.currentCity = result.get('cityId')?.value;
//           console.log('old metro', this.currentMetro);
//           this.currentMetro = result.get('metroIds')?.value;
//           console.log('new metro', this.currentMetro);
//           let updatedMetroIds: any[] = [];
//           //console.log('check', result.get('metroIds')?.value)
//           this.currentMetro.forEach((element: any) => {
//             // Проверяем, чтобы избежать дублирования, если это необходимо
//             if (!updatedMetroIds.includes(element.id)) {
//               updatedMetroIds.push(element.id);
//             }
//           });
//
//           // Устанавливаем значение для metroIds после завершения цикла
//
//           if (result.get('metroIds')?.value[0].id != null) {
//             console.log('updated', updatedMetroIds);
//             this.filterForm.controls['metroIds'].setValue(updatedMetroIds);
//           } else {
//             this.filterForm.controls['metroIds'].setValue([]);
//           }
//         }
//         console.log('The dialog was closed', result);
//       },
//       complete: () => {
//         console.info('Dialog closed');
//       },
//     });
//   }
// }
