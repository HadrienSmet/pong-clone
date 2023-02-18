type directionType = {
    x: number;
    y: number;
};

const initialSpeed = 0.035;
const acceleration = 0.000001;
const computerSpeed = 0.2;

const randomNumberBetween = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
};

function isCollision(rect1: DOMRect, rect2: DOMRect) {
    return (
        rect1.left < rect2.right &&
        rect1.right > rect2.left &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top
    );
}

export class Ball {
    ballElem: Element | null;
    direction: directionType = { x: 0.75, y: 0.5 };
    speed: number;

    constructor(ballElem: Element | null) {
        this.ballElem = ballElem;
        this.speed = initialSpeed;
        this.reset();
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

    update(delta: number, paddles: (DOMRect | undefined)[]) {
        this.speed += acceleration * delta;
        this.x += this.direction.x * this.speed * delta;
        this.y += this.direction.y * this.speed * delta;
        const rect = this.rect();
        if (rect) {
            if (rect.bottom >= window.innerHeight || rect.top <= 0) {
                this.direction.y *= -1;
            }

            const collisionIndex = paddles.findIndex(
                (r) => r !== undefined && (isCollision(rect, r) ? true : false)
            );
            if (collisionIndex !== -1) {
                const paddleCenter =
                    (paddles[collisionIndex] as DOMRect).top +
                    (paddles[collisionIndex] as DOMRect).height / 2;
                const normalizedRelativeIntersectionY =
                    (rect.top + rect.height / 2 - paddleCenter) /
                    ((paddles[collisionIndex] as DOMRect).height / 2);
                const bounceAngle =
                    normalizedRelativeIntersectionY * (Math.PI / 3);
                this.direction.x =
                    Math.sign(this.direction.x) * Math.cos(bounceAngle) * -1;
                this.direction.y = Math.sin(bounceAngle);
            }
        }
    }
}

export class Paddle {
    paddleElem: Element | null;
    constructor(paddleElem: Element | null) {
        this.paddleElem = paddleElem;
    }

    get position() {
        if (this.paddleElem) {
            return parseFloat(
                getComputedStyle(this.paddleElem).getPropertyValue("--position")
            );
        } else {
            return 50;
        }
    }

    set position(value: number) {
        (this.paddleElem as HTMLElement).style.setProperty(
            "--position",
            `${value}`
        );
    }

    rect() {
        return this.paddleElem?.getBoundingClientRect();
    }

    reset() {
        this.position = 50;
    }

    update(delta: number, ballY: number) {
        this.position += computerSpeed * (ballY - this.position);
    }
}

const ball = new Ball(document.querySelector("#ball"));
const playerPaddle = new Paddle(document.querySelector("#player-paddle"));
const computerPaddle = new Paddle(document.querySelector("#computer-paddle"));
const playerScore = document.querySelector(".player-score");
const computerScore = document.querySelector(".computer-score");

let lastTime: number | null;

const isLose = () => {
    const rect = ball.rect();
    if (rect) return rect.left <= 0 || rect.right >= window.innerWidth;
};

const handleLose = () => {
    const rect = ball.rect();
    if (
        rect &&
        computerScore &&
        computerScore.textContent &&
        playerScore &&
        playerScore.textContent
    ) {
        if (rect.left <= 0) {
            computerScore.textContent = `${
                parseInt(computerScore.textContent) + 1
            }`;
        }
        if (rect.right >= window.innerWidth) {
            playerScore.textContent = `${
                parseInt(playerScore.textContent) + 1
            }`;
        }
    }
    ball.reset();
    computerPaddle.reset;
};

const update = (time: number) => {
    if (lastTime != null) {
        const delta = Math.min(time - lastTime, 50);
        if (playerPaddle.rect() !== undefined && computerPaddle.rect()) {
            ball.update(delta, [playerPaddle.rect(), computerPaddle.rect()]);
        }
        computerPaddle.update(delta, ball.y);

        const hue = parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue("--hue")
        );

        document.documentElement.style.setProperty(
            "--hue",
            `${hue + delta * 0.01}`
        );

        if (isLose()) handleLose();
    }

    lastTime = time;
    window.requestAnimationFrame(update);
};

document.addEventListener("mousemove", (e) => {
    playerPaddle.position = (e.y / window.innerHeight) * 100;
});

window.requestAnimationFrame(update);
