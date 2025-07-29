import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiIcon, TuiTextfield, TuiTextfieldComponent } from '@taiga-ui/core';
import { TuiTextarea } from '@taiga-ui/kit';
import { TuiInputModule, TuiTextareaDirective } from '@taiga-ui/legacy';
@Component({
  selector: 'review',
  standalone: true,
  imports: [CommonModule, FormsModule, TuiIcon, TuiInputModule, TuiTextarea, TuiTextfield],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent {
  newReview: string = '';
  
reviews = [
  {id: 1, name:'Марина', age:20, text: 'Great product!', rating: 5},
  {id: 2, name:'Анастасия', age:22, text: 'Not bad, could be better.', rating: 3},
  {id: 3, name:'Екатерина', age:25, text: 'I love it!', rating: 4},
  {id: 4, name:'Ольга', age:30, text: 'Terrible experience.', rating: 1},
  {id: 5, name:'Светлана', age:28, text:        'Very satisfied with the service.', rating: 5},
  {id: 6, name:'Татьяна', age:35, text: 'Could use some improvements.', rating: 2},
  {id: 7, name:'Елена', age:40, text: 'Excellent quality!', rating: 5}
];

 submitReview() {
    const trimmed = this.newReview.trim();
    if (!trimmed) return;

    this.reviews.push({
      id: Date.now(),
      name: 'Пользователь',
      text: trimmed,
      age: 0,
      rating: 0
    });

    this.newReview = '';
  }
}
