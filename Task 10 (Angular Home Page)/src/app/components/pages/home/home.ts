import { Component } from '@angular/core';
import {Carousel} from "../../ui/carousel/carousel";
import {Navbar} from '../../layout/navbar/navbar';
import {ProductsSection} from '../../widget/products-section/products-section';
import {Footer} from '../../layout/footer/footer';

@Component({
  selector: 'app-home',
  imports: [
    Carousel,
    Navbar,
    ProductsSection,
    Footer
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
