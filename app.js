class Hyperspace {
    constructor(canvas, cfg) {
        if (!canvas instanceof HTMLCanvasElement) throw Error("Element is not canvas");
        this.stars = [];
        this.hyperspace = false;

        this.opt = {
            ...{
                quantity : 600,
                maxSpeed : 20,
                minSpeed : 1,
                speedChange: 0.001,
                bgColor : "#000",
                bgColorHyperspace : `rgba(0,0,0,0.1)`,
                starColor : 'rgba(255,255,255,1)',
            },
            ...cfg
        }

        this.quantity = this.opt.quantity;
        this.minSpeed = this.opt.minSpeed;
        this.maxSpeed = this.opt.maxSpeed;
        this.speed = this.minSpeed;
        this.speedChange = this.opt.speedChange;
        this.colorRatio = 0;
        this.bgColor = this.opt.bgColor;
        this.bgColorHyperspace = this.opt.bgColorHyperspace;
        this.starColor = this.opt.starColor;

        this.w = canvas.width;
        this.h = canvas.height;
        this.x = Math.round(this.w / 2);
        this.y = Math.round(this.h / 2);
        this.z = (this.w + this.h) / 2;
        this.ctx = canvas.getContext("2d");

        this.#setStars();
        this.animate();
    }

    startHyperspace() {
        this.hyperspace = true;
    }

    stopHyperspace() {
        this.hyperspace = false;
    }

    #setStars() {
        this.stars = new Array(this.quantity);
        for (var i = 0; i < this.quantity; i++) {
            this.stars[i] = new Array(8);

            this.stars[i][0] = Math.random() * this.w * 2 - this.x * 2;
            this.stars[i][1] = Math.random() * this.h * 2 - this.y * 2;
            this.stars[i][2] = Math.round(Math.random() * this.z);
            this.stars[i][3] = 0;
            this.stars[i][4] = 0;
            this.stars[i][5] = 0; // prev x
            this.stars[i][6] = 0; // prev y
            this.stars[i][7] = true; // test var
        }
    }

    #compSpeed() {
        if (this.hyperspace) {
            this.speed = this.speed + this.speedChange;
            this.speed = Math.min(this.speed, this.maxSpeed);
        } else {
            this.speed = this.speed - this.speedChange;
            this.speed = Math.max(this.speed, this.minSpeed);
        }
        return {
            lyph: this.speed
            //lyph: this.hyperspace ? this.speed * this.warpFactor : this.speed,
        }
    }

    #colors() {
        return {
            fill: this.hyperspace ? this.bgColorHyperspace : this.bgColor,
        }
    }

    #ratio() {
        return {
            computed: this.quantity / 2,
        }
    }

    #calculate() {
        if (this.stars.length > 0) {
            for (let el of this.stars) {
                el[7] = true;
                el[5] = el[3];
                el[6] = el[4];

                // X coords
                if (el[0] > this.x << 1) {
                    el[0] -= this.w << 1;
                    el[7] = false;
                }
                if (el[0] < -this.x << 1) {
                    el[0] += this.w << 1;
                    el[7] = false;
                }

                // Y coords
                if (el[1] > this.y << 1) {
                    el[1] -= this.h << 1;
                    el[7] = false;
                }
                if (el[1] < -this.y << 1) {
                    el[1] += this.h << 1;
                    el[7] = false;
                }

                // Z coords
                el[2] -= this.#compSpeed().lyph;
                if (el[2] > this.z) {
                    el[2] -= this.z;
                    el[7] = false;
                }
                if (el[2] < 0) {
                    el[2] += this.z;
                    el[7] = false;
                }

                el[3] = this.x + (el[0] / el[2]) * this.#ratio().computed;
                el[4] = this.y + (el[1] / el[2]) * this.#ratio().computed;
            }
        }
    }

    #draw() {
        this.ctx.fillStyle = this.#colors().fill;
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.ctx.strokeStyle = this.starColor;

        if (this.stars.length) {
            for (let el of this.stars) {
                if (
                    el[5] > 0 &&
                    el[5] < this.w &&
                    el[6] > 0 &&
                    el[6] < this.h &&
                    el[7]
                ) {
                    this.ctx.lineWidth = (1 - this.colorRatio * el[2]) * 1.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(el[5], el[6]);
                    this.ctx.lineTo(el[3], el[4]);
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
            }
        }
    }

    animate(timeStamp) {
        this.#calculate();
        this.#draw();
        window.requestAnimationFrame(this.animate.bind(this));
    }
}

const canvas1 = document.querySelector("#left");
const box1 = canvas1.parentElement.getBoundingClientRect();
canvas1.width = box1.width;
canvas1.height = box1.height;

const canvas2 = document.querySelector("#right");
const box2 = canvas2.parentElement.getBoundingClientRect();
canvas2.width = box2.width;
canvas2.height = box2.height;

const hyper1 = new Hyperspace(canvas1);
const hyper2 = new Hyperspace(canvas2, {
    speedChange : 0.003,
    quantity : 200,
    minSpeed : 1,
    bgColor: "rgb(3,18,41)",
    bgColorHyperspace: "rgb(3,18,41, 0.3)"
});

document.addEventListener("mousedown", e => {
    hyper1.startHyperspace();
    hyper2.startHyperspace();
})
document.addEventListener("mouseup", e => {
    hyper1.stopHyperspace();
    hyper2.stopHyperspace();
})