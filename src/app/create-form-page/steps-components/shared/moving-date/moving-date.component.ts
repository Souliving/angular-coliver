import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiTextfield } from '@taiga-ui/core';
import { TuiInputDate } from '@taiga-ui/kit';

@Component({
  selector: 'moving-date',
  standalone: true,
  imports: [TuiInputDate, ReactiveFormsModule, TuiTextfield],
  templateUrl: './moving-date.component.html',
  styleUrl: './moving-date.component.scss'
})
export class MovingDateComponent {
 @Input({ required: true }) moveDate!: FormControl;
}
