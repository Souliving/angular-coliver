import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'info-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-container.component.html',
  styleUrl: './info-container.component.scss'
})
export class InfoContainerComponent {
  @Input() label: string = '';
  @Input() value?: string | number | null;
}
