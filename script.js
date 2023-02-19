var initialSpeed = 0.035;
var acceleration = 0.000001;
var computerSpeed = 0.2;
var randomNumberBetween = function (min, max) {
    return Math.random() * (max - min) + min;
};
function isCollision(rect1, rect2) {
    return (rect1.left < rect2.right &&
        rect1.right > rect2.left &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top);
}
var Ball = /** @class */ (function () {
    function Ball(ballElem) {
        this.ballElem = ballElem;
        this.speed = initialSpeed;
        this.reset();
    }
    Object.defineProperty(Ball.prototype, "x", {
        get: function () {
            if (this.ballElem) {
                return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"));
            }
            else {
                return 50;
            }
        },
        set: function (value) {
            this.ballElem.style.setProperty("--x", "".concat(value));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Ball.prototype, "y", {
        get: function () {
            if (this.ballElem) {
                return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--y"));
            }
            else {
                return 50;
            }
        },
        set: function (value) {
            this.ballElem.style.setProperty("--y", "".concat(value));
        },
        enumerable: false,
        configurable: true
    });
    Ball.prototype.rect = function () {
        var _a;
        return (_a = this.ballElem) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
    };
    Ball.prototype.reset = function () {
        this.x = 50;
        this.y = 50;
        this.direction = { x: 0 };
        while (Math.abs(this.direction.x) <= 0.2 ||
            Math.abs(this.direction.x) >= 0.9) {
            var heading = randomNumberBetween(0, 2 * Math.PI);
            this.direction = { x: Math.cos(heading), y: Math.sin(heading) };
        }
        this.speed = initialSpeed;
    };
    Ball.prototype.update = function (delta, paddles) {
        this.speed += acceleration * delta;
        this.x += this.direction.x * this.speed * delta;
        this.y += this.direction.y * this.speed * delta;
        var rect = this.rect();
        if (rect) {
            if (rect.bottom >= window.innerHeight || rect.top <= 0) {
                this.direction.y *= -1;
            }
            var collisionIndex = paddles.findIndex(function (r) { return r !== undefined && (isCollision(rect, r) ? true : false); });
            if (collisionIndex !== -1) {
                var paddleCenter = paddles[collisionIndex].top +
                    paddles[collisionIndex].height / 2;
                var normalizedRelativeIntersectionY = (rect.top + rect.height / 2 - paddleCenter) /
                    (paddles[collisionIndex].height / 2);
                var bounceAngle = normalizedRelativeIntersectionY * (Math.PI / 3);
                this.direction.x =
                    Math.min(0.9, Math.max(0.2, Math.cos(bounceAngle))) *
                        Math.sign(this.direction.x) *
                        -1;
                this.direction.y = Math.sin(bounceAngle);
            }
        }
    };
    return Ball;
}());
export { Ball };
var Paddle = /** @class */ (function () {
    function Paddle(paddleElem) {
        this.paddleElem = paddleElem;
    }
    Object.defineProperty(Paddle.prototype, "position", {
        get: function () {
            if (this.paddleElem) {
                return parseFloat(getComputedStyle(this.paddleElem).getPropertyValue("--position"));
            }
            else {
                return 50;
            }
        },
        set: function (value) {
            this.paddleElem.style.setProperty("--position", "".concat(value));
        },
        enumerable: false,
        configurable: true
    });
    Paddle.prototype.rect = function () {
        var _a;
        return (_a = this.paddleElem) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
    };
    Paddle.prototype.reset = function () {
        this.position = 50;
    };
    Paddle.prototype.update = function (ballY) {
        this.position += computerSpeed * (ballY - this.position);
    };
    return Paddle;
}());
export { Paddle };
var ball = new Ball(document.querySelector("#ball"));
var playerPaddle = new Paddle(document.querySelector("#player-paddle"));
var computerPaddle = new Paddle(document.querySelector("#computer-paddle"));
var playerScore = document.querySelector(".player-score");
var computerScore = document.querySelector(".computer-score");
var lastTime;
var isLose = function () {
    var rect = ball.rect();
    if (rect)
        return rect.left <= 0 || rect.right >= window.innerWidth;
};
var handleLose = function () {
    var rect = ball.rect();
    if (rect &&
        computerScore &&
        computerScore.textContent &&
        playerScore &&
        playerScore.textContent) {
        if (rect.left <= 0) {
            computerScore.textContent = "".concat(parseInt(computerScore.textContent) + 1);
        }
        if (rect.right >= window.innerWidth) {
            playerScore.textContent = "".concat(parseInt(playerScore.textContent) + 1);
        }
    }
    ball.reset();
    computerPaddle.reset;
};
var update = function (time) {
    if (lastTime != null) {
        var delta = Math.min(time - lastTime, 50);
        if (playerPaddle.rect() !== undefined && computerPaddle.rect()) {
            ball.update(delta, [playerPaddle.rect(), computerPaddle.rect()]);
        }
        computerPaddle.update(ball.y);
        var hue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hue"));
        document.documentElement.style.setProperty("--hue", "".concat(hue + delta * 0.01));
        if (isLose())
            handleLose();
    }
    lastTime = time;
    window.requestAnimationFrame(update);
};
document.addEventListener("mousemove", function (e) {
    playerPaddle.position = (e.y / window.innerHeight) * 100;
});
window.requestAnimationFrame(update);
