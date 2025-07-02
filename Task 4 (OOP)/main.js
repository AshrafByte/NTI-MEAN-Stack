// main.js
import {Circle, Rectangle, Shape, Square} from './shapes.js';

let rectangle = new Rectangle(5, 10);
rectangle.display();
rectangle.displayArea();
rectangle.displayPerimeter();
console.log("--------------------------");

let square = new Square(10);
square.display();
square.displayArea();
square.displayPerimeter();
console.log("--------------------------");

let circle = new Circle(5);
circle.display();
circle.displayArea();
circle.displayPerimeter();
console.log("--------------------------");

let shape = new Shape();
shape.display();
console.log("--------------------------");

