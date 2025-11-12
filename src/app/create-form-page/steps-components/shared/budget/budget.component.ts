import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiTextfield } from '@taiga-ui/core';
import { TuiInputNumber } from '@taiga-ui/kit';

@Component({
  selector: 'budget',
  standalone: true,
  imports: [TuiTextfield, TuiInputNumber, ReactiveFormsModule],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.scss'
})
export class BudgetComponent {
  @Input({ required: true }) budget!: FormControl;
}
