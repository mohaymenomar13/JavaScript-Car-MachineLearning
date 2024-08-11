const canvas = document.getElementById("myCanvas");
canvas.width=200;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width/2, canvas.width*0.9);

const cars = generateCars(100);
let bestCar = cars[0];
if(localStorage.getItem("bestBrain")) {
    for(let i=0;i<cars.length;i++) {
        cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
        console.log("Successfully Installed");
        if(i!=0){
            neuralNetwork.mutate(cars[i].brain, 0.07);
        }
    }
}

const traffic = [
    new Car(road.getLaneIndex(1), 500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneIndex(0), 350, 30, 50, "DUMMY", 2),
    new Car(road.getLaneIndex(2), 350, 30, 50, "DUMMY", 2),
    new Car(road.getLaneIndex(1), 150, 30, 50, "DUMMY", 2),
    new Car(road.getLaneIndex(2), -20, 30, 50, "DUMMY", 2),
    new Car(road.getLaneIndex(1), -80, 30, 50, "DUMMY", 2),
    new Car(road.getLaneIndex(1), -330, 30, 50, "DUMMY", 2),
    new Car(road.getLaneIndex(0), -330, 30, 50, "DUMMY", 2),
    new Car(road.getLaneIndex(2), -530, 30, 50, "DUMMY", 2),
    new Car(road.getLaneIndex(0), -530, 30, 50, "DUMMY", 2),
    new Car(road.getLaneIndex(0), -630, 30, 50, "DUMMY", 2),
    new Car(road.getLaneIndex(2), -830, 30, 50, "DUMMY", 2),
    new Car(road.getLaneIndex(1), -1030, 30, 50, "DUMMY", 2),
    new Car(road.getLaneIndex(0), -1230, 30, 50, "DUMMY", 2),
    new Car(road.getLaneIndex(2), -1230, 30, 50, "DUMMY", 2),
    new Car(road.getLaneIndex(1), -1380, 30, 50, "DUMMY", 2),
    new Car(road.getLaneIndex(1), -1380, 30, 50, "DUMMY", 2),
    new Car(road.getLaneIndex(0), -1530, 30, 50, "DUMMY", 2),
    new Car(road.getLaneIndex(2), -1530, 30, 50, "DUMMY", 2),
    new Car(road.getLaneIndex(1), -1680, 30, 50, "DUMMY", 2),
];

animate();
console.log("comamnds:\nsave()\ndiscard()\nnext()\n");
function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain))
    console.log("Successfully Installed");
}

function discard() {
    localStorage.removeItem("bestBrain");
}

function next() {
    bestCar.damaged = true;
}

function generateCars(N) {
    const cars= [];
    for (let i = 1; i <= N; i++){
        cars.push(new Car(road.getLaneIndex(1), 650, 30, 50, "AI"));
    }
    return cars;
}

function animate(){
    for (let i = 0; i < traffic.length;i++){
        traffic[i].update(road.borders, []);
    }

    for(let i = 0; i < cars.length; i++){
        cars[i].update(road.borders, traffic);
    }

    bestCar = cars.find(l=>l.y==Math.min(...cars.map(l=>l.y)));

    canvas.height=window.innerHeight;

    ctx.save();
    ctx.translate(0, -bestCar.y+canvas.height*0.7);
    road.draw(ctx);

    for (let i=0;i<traffic.length;i++){
        traffic[i].draw(ctx, "red");
    }

    ctx.globalAlpha = 0.2;

    for(let i = 0; i < cars.length; i++){
        cars[i].draw(ctx, "blue");
    }
    ctx.globalAlpha = 1;

    bestCar.draw(ctx, "blue",true);

    ctx.restore();
    requestAnimationFrame(animate);
}