var initialSpeed = 0.025;
var acceleration = 0.000025;
var randomNumberBetween = function (min, max) {
    return Math.random() * (max - min) + min;
};
var Ball = /** @class */ (function () {
    function Ball(ballElem) {
        this.direction = { x: 0.75, y: 0.5 };
        this.ballElem = ballElem;
        this.speed = initialSpeed;
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
        this.direction = { x: 0.75, y: 0.5 };
        while (Math.abs(this.direction.x) <= 0.2 ||
            Math.abs(this.direction.x) >= 0.9) {
            var heading = randomNumberBetween(0, 2 * Math.PI);
            this.direction = { x: Math.cos(heading), y: Math.sin(heading) };
        }
        this.speed = initialSpeed;
    };
    Ball.prototype.update = function (delta) {
        this.speed += acceleration;
        console.log(this.speed);
        this.x += this.direction.x * this.speed * delta;
        this.y += this.direction.y * this.speed * delta;
        var rect = this.rect();
        if (rect) {
            if (rect.bottom >= window.innerHeight || rect.top <= 0) {
                this.direction.y *= -1;
            }
            if (rect.right >= window.innerWidth || rect.left <= 0) {
                this.direction.x *= -1;
            }
        }
    };
    return Ball;
}());
export { Ball };
