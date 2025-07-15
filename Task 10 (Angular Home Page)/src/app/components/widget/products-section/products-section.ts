import { Component } from '@angular/core';
import {CardComponent} from '../../ui/card/card';

@Component({
  selector: 'app-products-section',
  imports: [
    CardComponent

  ],
  templateUrl: './products-section.html',
  styleUrl: './products-section.css'
})
export class ProductsSection {
  products = [
    {
      name: 'Apple Watch Series 7',
      price: 599,
      rating: 5,
      image: 'assets/images/smartwatch-screen-digital-device.jpg'
    },
    {
      name: 'MacBook Pro M2',
      price: 1999,
      rating: 4,
      image: 'assets/images/smartwatch-screen-digital-device.jpg'
    },
    {
      name: 'iPhone 14 Pro',
      price: 1099,
      rating: 5,
      image: 'assets/images/smartwatch-screen-digital-device.jpg'
    },
    {
      name: 'iPad Air',
      price: 699,
      rating: 4,
      image: 'assets/images/smartwatch-screen-digital-device.jpg'
    },
    {
      name: 'AirPods Pro',
      price: 249,
      rating: 5,
      image: 'assets/images/smartwatch-screen-digital-device.jpg'
    },
    {
      name: 'Magic Keyboard',
      price: 129,
      rating: 4,
      image: 'assets/images/smartwatch-screen-digital-device.jpg'
    },
  ];
}
