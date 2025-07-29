import { Component } from '@angular/core';
import { InfoContainerComponent } from '../../shared/info-container/info-container.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ad-person-info',
  standalone: true,
  imports: [InfoContainerComponent, CommonModule],
  templateUrl: './ad-person-info.component.html',
  styleUrl: './ad-person-info.component.scss'
})
export class AdPersonInfoComponent {

userDataFromServer: { [key: string]: string } = {
  moveDate: '01.08.2025',
  hobbies: 'Чтение, спорт',
  neighborGender: 'Не важно',
  neighborAge: '20–30 лет',
  description: 'Ищу чистоплотного и неконфликтного соседа'
};

userFields = [
  { label: 'Дата переезда', key: 'moveDate' },
  { label: 'Привычки и увлечения', key: 'hobbies' },
  {
    label: 'О будущем соседе',
    children: [
      { label: 'Пол', key: 'neighborGender' },
      { label: 'Возраст', key: 'neighborAge' }
    ]
  },
  { label: 'Описание', key: 'description' }
];

}
