type directionType = {
    x: number;
    y: number;
};
const initialSpeed = 0.025;
const acceleration = 0.000025;
const randomNumberBetween = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
};

export class Ball {
    ballElem: Element | null;
    direction: directionType = { x: 0.75, y: 0.5 };
    speed: number;
    constructor(ballElem: Element | null) {
        this.ballElem = ballElem;
        this.speed = initialSpeed;
    }

    get x() {
        if (this.ballElem) {
            return parseFloat(
                getComputedStyle(this.ballElem).getPropertyValue("--x")
            );
        } else {
            return 50;
        }
    }
    set x(value: number) {
        (this.ballElem as HTMLElement).style.setProperty("--x", `${value}`);
    }

    get y() {
        if (this.ballElem) {
            return parseFloat(
                getComputedStyle(this.ballElem).getPropertyValue("--y")
            );
        } else {
            return 50;
        }
    }
    set y(value: number) {
        (this.ballElem as HTMLElement).style.setProperty("--y", `${value}`);
    }

    rect() {
        return this.ballElem?.getBoundingClientRect();
    }

    reset() {
        this.x = 50;
        this.y = 50;
        this.direction = { x: 0.75, y: 0.5 };
        while (
            Math.abs(this.direction.x) <= 0.2 ||
            Math.abs(this.direction.x) >= 0.9
        ) {
            const heading = randomNumberBetween(0, 2 * Math.PI);
            this.direction = { x: Math.cos(heading), y: Math.sin(heading) };
        }
        this.speed = initialSpeed;
    }

    update(delta: number) {
        this.speed += acceleration;
        console.log(this.speed);

        this.x += this.direction.x * this.speed * delta;
        this.y += this.direction.y * this.speed * delta;
        const rect = this.rect();
        if (rect) {
            if (rect.bottom >= window.innerHeight || rect.top <= 0) {
                this.direction.y *= -1;
            }
            if (rect.right >= window.innerWidth || rect.left <= 0) {
                this.direction.x *= -1;
            }
        }
    }
}
