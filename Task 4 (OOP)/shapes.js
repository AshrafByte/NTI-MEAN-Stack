export class Shape {

    constructor() {
        if (this.constructor === Shape)
            throw 'Shapes is Abstract class';
    }

    calculateArea(){}
    calculatePerimeter(){}

    displayArea() {
        console.log(`Area: ${this.calculateArea()}`);
    }

    displayPerimeter() {
        console.log(`Perimeter: ${this.calculatePerimeter()}`);
    }

    display() {
        console.log(this.toString());
    }

}

export class Rectangle extends Shape {
    #length;
    #width;
    constructor(length, width) {
        super();
        this.#length = length;
        this.#width = width;
    }

    calculateArea() {
        return this.#length * this.#width;
    }

    calculatePerimeter() {
        return 2 * (this.#length + this.#width);
    }


    toString() {
        return `Length: ${this.#length}, Width: ${this.#width}`;
    }
}

export class Square extends Rectangle {
    #side;
    constructor(side) {
        super(side, side);
        this.#side = side;
    }

    toString() {
        return `Side: ${this.#side}`;
    }
}

export class Circle extends Shape {
    #radius;
    constructor(radius) {
        super();
        this.#radius = radius;
    }

    calculateArea() {
        return Math.PI * this.#radius ** 2;
    }

    calculatePerimeter() {
        return 2 * Math.PI * this.#radius;
    }

    toString() {
        return `Radius: ${this.#radius}`;
    }
}
