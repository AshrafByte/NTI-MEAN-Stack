import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [NgClass],
  templateUrl: './card.html',
  styleUrl: './card.css'
})
export class CardComponent {
  @Input() image!: string;
  @Input() name!: string;
  @Input() price!: number;
  @Input() rating!: number;
}
