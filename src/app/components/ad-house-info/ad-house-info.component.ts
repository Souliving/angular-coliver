import { Component } from '@angular/core';
import { InfoContainerComponent } from '../../shared/info-container/info-container.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ad-house-info',
  standalone: true,
  imports: [InfoContainerComponent, CommonModule],
  templateUrl: './ad-house-info.component.html',
  styleUrl: './ad-house-info.component.scss'
})
export class AdHouseInfoComponent {

  userDataFromServer: { [key: string]: string } = {
  budget: '20000',
  metro: 'Пушкинская',
  address: 'ул.Ленина, д. 1',
  roomCount: '2',
  residentsCount: '2',
  residentsGender: 'Мужской, женский'
};

 userFields = [
  { label: 'Бюджет', key: 'budget' },
  { label: 'Метро', key: 'metro' },
  { label: 'Адрес', key: 'address' },
  { label: 'Количество комнат в квартире', key: 'roomCount' },
  { label: 'Количество проживающих', key: 'residentsCount' },
  { label: 'Пол проживающих', key: 'residentsGender' }
];
}
