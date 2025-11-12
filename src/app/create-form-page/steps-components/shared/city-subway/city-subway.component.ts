import { CommonModule } from '@angular/common';
import { Component, computed, effect, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiStringHandler } from '@taiga-ui/cdk';
import { TuiDataList, TuiTextfield } from '@taiga-ui/core';
import { TuiDataListWrapperComponent, TuiInputChip, TuiInputDate, TuiInputNumber, TuiMultiSelect, TuiSelectDirective, TuiStringifyPipe } from '@taiga-ui/kit';
import { City, Subway } from '../../../../data/formsStructure';
import { CreateNewAdService } from '../../../../services/create-new-ad/create-new-ad.service';

@Component({
  selector: 'city-subway',
  standalone: true,
  imports: [
    CommonModule, 
    TuiTextfield, 
    TuiInputNumber,
    TuiInputChip,
     TuiDataList,
    TuiStringifyPipe,
    TuiSelectDirective,
    TuiMultiSelect,
    TuiDataListWrapperComponent, 
  ReactiveFormsModule],
  templateUrl: './city-subway.component.html',
  styleUrl: './city-subway.component.scss'
})
export class CitySubwayComponent {
@Input({ required: true }) city!: FormControl;
@Input({ required: true }) metro!: FormControl;


  constructor(
    private newAdService: CreateNewAdService
  ){}

  ngOnInit(){
    this.setCityValue()
  }

  setCityValue(){
    this.city?.valueChanges.subscribe((city)=> this.newAdService.setCity(city))
  }

  citiesComputed = computed(() => this.newAdService.cities());
  metroComputed = computed(() => this.newAdService.metros());

  protected readonly stringifyCity: TuiStringHandler<City> = (city) => this.citiesComputed().find((item) => item.id === city.id)?.name ?? '';
 protected readonly stringifyMetro: TuiStringHandler<Subway> = (metro) => this.metroComputed().find((item) => item.id === metro.id)?.name ?? '';
 }
