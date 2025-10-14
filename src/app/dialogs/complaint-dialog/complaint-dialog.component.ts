import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiDialogContext, TuiTextfield } from '@taiga-ui/core';
import { TuiTextarea } from '@taiga-ui/kit';
import { injectContext } from '@taiga-ui/polymorpheus';

@Component({
  selector: 'app-complaint-dialog',
  standalone: true,
  imports: [TuiTextfield, FormsModule, TuiTextarea, CommonModule],
  templateUrl: './complaint-dialog.component.html',
  styleUrl: './complaint-dialog.component.scss'
})
export class ComplaintDialogComponent {
  public readonly context = injectContext<TuiDialogContext<string, string>>();
  complaint = '';

  constructor() {}

  submitComplaint() {
    this.context.completeWith(this.complaint);
  }
}
