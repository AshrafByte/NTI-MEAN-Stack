import { Routes } from '@angular/router';
import {HomeComponent} from './components/pages/home/home.component';
import {AboutComponent} from './components/pages/about/about.component';
import {ContactComponent} from './components/pages/contact/contact.component';
import {ProductsComponent} from './components/pages/products/products.component';
import {ProductComponent} from './components/pages/product/product.component';
import {CartComponent} from './components/pages/cart/cart.component';
import {LoginComponent} from './components/pages/login/login.component';
import {SignupComponent} from './components/pages/signup/signup.component';
import {AccountComponent} from './components/pages/account/account.component';
import {OrderConfirmationComponent} from './components/pages/order-confirmation/order-confirmation.component';
import {OrderDetailsComponent} from './components/pages/order-details/order-details.component';

export const routes: Routes = [
  {path:"" ,        redirectTo  :"home" ,   pathMatch: "full"},
  {path:"home",     component   :HomeComponent ,     title:"Home Page"},
  {path:"about",    component   :AboutComponent ,    title:"About Page"},
  {path:"contact",  component   :ContactComponent ,  title:"Contact Page"},
  {path:"products", component   :ProductsComponent , title:"Products Page"},
  {path:"product/:id", component :ProductComponent , title:"Product Details"},
  {path:"cart",     component   :CartComponent ,     title:"Shopping Cart"},
  {path:"login",    component   :LoginComponent ,    title:"Sign In"},
  {path:"signup",   component   :SignupComponent ,   title:"Create Account"},
  {path:"account",  component   :AccountComponent ,  title:"My Account"},
  {path:"order-confirmation", component: OrderConfirmationComponent, title:"Order Confirmation"},
  {path:"order-details/:id", component: OrderDetailsComponent, title:"Order Details"},
];
