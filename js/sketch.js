let blobs = [];

let slither;

let score = 0;

let zoom = 1;

let minWidth, maxWidth, minHeight, maxHeight;

let blobRadius = 3;

function setup() {
    createCanvas(windowWidth - 20, windowHeight - 20);
    slither = new Slither();

    minWidth = -width * 3;
    maxWidth = width * 3;
    minHeight = -height * 3;
    maxHeight = height * 3;

    for (let i = 0; i <= 8000; i++) {
        blobs.push(new Blob(createVector(random(minWidth + blobRadius, maxWidth - blobRadius), random(minHeight + blobRadius, maxHeight - blobRadius)), random(150, 255), random(150, 255), random(150, 255)));
    }
}

function draw() {
    background(25);

    translate(width / 2, height / 2);
    let newzoom = 30 / slither.r;
    zoom = lerp(zoom, newzoom, 0.1);
    scale(zoom);
    translate(-slither.pos.x, -slither.pos.y);

    for (let blob of blobs) {
        blob.render();
    }

    slither.render();
    slither.update();

    fill(255);
    textSize(slither.r);
    textAlign(CENTER);
    text("Score: " + floor(score), slither.pos.x, slither.pos.y - 10);

    // top barrier
    strokeWeight(2);
    stroke(255);
    line(minWidth, minHeight, maxWidth, minHeight);
    // right barrier
    line(maxWidth, minHeight, maxWidth, maxHeight);
    // bottom barrier
    line(maxWidth, maxHeight, minWidth, maxHeight);
    // left barrier
    line(minWidth, maxHeight, minWidth, minHeight);


}

class Slither {
    constructor() {
        this.pos = createVector(0, 0);
        this.r = 7;
        this.red = random(150, 255);
        this.green = random(150, 255);
        this.blue = random(150, 255);
        this.zoomred = this.red + 25;
        this.zoomgreen = this.green + 25;
        this.zoomblue = this.blue + 25;
        this.vel = createVector(0, 0);

        this.total = 10;
        this.tail = [];

        this.eyeSeparationVal = 0;

        this.zooming = false;

    }

    render() {

        if (!this.zooming) {
            fill(this.red, this.green, this.blue);
        } else {
            fill(this.zoomred, this.zoomgreen, this.zoomblue);
        }

        if (this.tail.length > 0) {
            let amt = 0;
            for (let i = this.tail.length - 1; i >= 0; i--) {
                strokeWeight(1);
                stroke(25, 25);

                ellipse(this.tail[i].x, this.tail[i].y, this.r * 2);


            }
        }

        ellipse(this.pos.x, this.pos.y, this.r * 2);

        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.vel.heading());

        this.eyeSeparationVal = lerp(this.eyeSeparationVal, floor(score / 50), 0.05);

        noStroke();

        fill(255);
        ellipse(2, -2 - this.eyeSeparationVal, (this.r / 2));
        ellipse(2, 2 + this.eyeSeparationVal, (this.r / 2));
        fill(0)
        ellipse(2, -2 - this.eyeSeparationVal, (this.r / 5));
        ellipse(2, 2 + this.eyeSeparationVal, (this.r / 5));
        pop();
    }

    update() {

        this.pos.x = constrain(this.pos.x, minWidth + this.r, maxWidth - this.r);
        this.pos.y = constrain(this.pos.y, minHeight + this.r, maxHeight - this.r);

        let newvel = createVector(mouseX - width / 2, mouseY - height / 2);
        newvel.setMag(3);
        this.vel.lerp(newvel, 0.2);
        this.pos.add(this.vel);

        for (let blob of blobs) {
            let d = p5.Vector.dist(this.pos, blob.pos);

            if (d < this.r + blob.r) {
                score += 1;

                blob.pos = createVector(random(minWidth + blobRadius, maxWidth - blobRadius), random(minHeight + blobRadius, maxHeight - blobRadius));
            }
        }

        this.r = lerp(this.r, 7 + (blobs[0].r * floor(score / 50) / 2), 0.05);

        if (this.tail.length === this.total) {
            this.tail.pop();
        } else if (this.tail.length > this.total) {
            let amt = this.tail.length - this.total;
            this.tail = this.tail.slice(0, amt + 1);
        }

        if (this.total >= 10) {
            this.tail.unshift(createVector(this.pos.x, this.pos.y));
        }

        if (score >= 25 && (keyIsDown(32) || mouseIsPressed)) {

            this.zooming = true;

            this.vel.mult(1.17);

            score -= 1;

            if (score % 3 === 0) {
                blobs.push((new Blob(this.tail.slice(-1)[0], this.red, this.green, this.blue)));
            }

        } else {
            this.zooming = false;
        }

        if (score >= 10) {
            this.total = score;
        }

    }
}

class Blob {
    constructor(pos, red, green, blue) {
        this.pos = pos;
        this.r = blobRadius;
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    render() {

        strokeWeight(blobRadius);
        stroke(this.red, this.green, this.blue, 100);
        fill(this.red, this.green, this.blue, 225);
        ellipse(this.pos.x, this.pos.y, this.r * 2);
    }
}