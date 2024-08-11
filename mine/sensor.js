var LtoM = false;
var LtoR = false;
var RtoM = false;
var RtoL = false;
var MtoR = false;
var MtoL = false;
var MtoRR = false;
class Sensor{
    constructor(car){
        this.car = car
        this.rayCount = 30;
        this.rayLength = 150;
        this.raySpread = Math.PI*2;

        this.rays = [];
        this.readings = [];
    }

    update(roadBorders, traffic){
        this.#castRays();

        this.readings = [];
        for (let i = 0; i < this.rays.length; i++){
            this.readings.push(this.#getReadings(this.rays[i], roadBorders, traffic));
        }
        
        if (this.car.type == "myAiCar") {
            this.#mycarctrl(this.readings);
        }
    }

    #mycarctrl(rds){
        this.car.controls.forward = true;
        //Left to Middle
        if (this.car.x < 50 && rds[2] !== null && rds[3] == null) {
            if (rds[2].offset < 0.6) {
                LtoM = true;
            }
        }

        if (LtoM) {
            if (this.car.angle > -0.4 && this.car.x <= 92) {
                this.car.controls.right = true;
            } else if (this.car.angle < -0.01 && this.car.x >= 92) {
                this.car.controls.left = true;
            } else {
                this.car.controls.right = false;
                this.car.controls.left = false;
            }
            if (this.car.angle > -0.001 && this.car.x > 100) {
                LtoM = false;
                console.log("YES");
            }
        }

        //Left to Right
        if (this.car.x < 50 && rds[2] !== null && rds[3] !== null) {
            if (rds[3].offset < 0.8) {
                LtoR = true;
            }
        }

        if (LtoR) {
            if (this.car.angle > -0.4 && this.car.x <= 152) {
                this.car.controls.right = true;
            } else if (this.car.angle < -0.01 && this.car.x >= 152) {
                this.car.controls.left = true;
            } else {
                this.car.controls.right = false;
                this.car.controls.left = false;
            }
            if (this.car.angle > -0.001 && this.car.x > 160) {
                LtoR = false;
            }
        }

        //Right to Middle
        if (this.car.x > 150 && rds[2] !== null && rds[1] == null) {
            if (rds[2].offset < 0.6) {
                RtoM = true;
            }
        }

        
        if (RtoM) {
            if (this.car.angle < 0.4 && this.car.x >= 108) {
                this.car.controls.left = true;
            } else if (this.car.angle > 0.01 && this.car.x <= 109) {
                this.car.controls.right = true;
            } else {
                this.car.controls.right = false;
                this.car.controls.left = false;
            }
            if (this.car.angle < 0.01 && this.car.x > 90) {
                RtoM = false;
            }
        }

        //Right to Left
        if (this.car.x > 150 && rds[2] !== null && rds[1] !== null) {
            if (rds[1].offset < 0.8) {
                RtoL = true;
            }
        }

        if (RtoL) {
            if (this.car.angle < 0.4 && this.car.x >= 49) {
                this.car.controls.left = true;
            } else if (this.car.angle > 0.01 && this.car.x <= 49) {
                this.car.controls.right = true;
            } else {
                this.car.controls.right = false;
                this.car.controls.left = false;
            }
            if (this.car.angle < 0.01 && this.car.x > 40) {
                RtoL = false;
            }
        }

        //Middle to Right
        if (this.car.x > 90 && rds[1] !== null && rds[2] !== null && rds[3] == null) {
            if (rds[1].offset < 0.8) {
                MtoR = true;
            }
        }

        if (MtoR) {
            if (this.car.angle > -0.4 && this.car.x <= 152) {
                this.car.controls.right = true;
            } else if (this.car.angle < -0.01 && this.car.x >= 152) {
                this.car.controls.left = true;
            } else {
                this.car.controls.right = false;
                this.car.controls.left = false;
            }
            if (this.car.angle > -0.001 && this.car.x > 160) {
                MtoR = false;
            }
        }

        //Middle to Left
        if (this.car.x > 90 && rds[1] == null && rds[2] !== null && rds[3] !== null) {
            if (rds[3].offset < 0.8) {
                MtoL = true;
            }
        }

        if (MtoL) {
            if (this.car.angle < 0.4 && this.car.x >= 49) {
                this.car.controls.left = true;
            } else if (this.car.angle > 0.01 && this.car.x <= 49) {
                this.car.controls.right = true;
            } else {
                this.car.controls.right = false;
                this.car.controls.left = false;
            }
            if (this.car.angle < 0.01 && this.car.x < 41) {
                MtoL = false;
                RtoM = false;
            }
        }

        //Middle to Left
        if (this.car.x > 90 && rds[2] !== null) {
            if (rds[2].offset < 0.5) {
                MtoRR = true;
            }
        }

        if (MtoRR) {
            if (this.car.angle > -0.4 && this.car.x <= 152) {
                this.car.controls.right = true;
            } else if (this.car.angle < -0.01 && this.car.x >= 152) {
                this.car.controls.left = true;
            } else {
                this.car.controls.right = false;
                this.car.controls.left = false;
            }
            if (this.car.angle > -0.001 && this.car.x > 160) {
                MtoRR = false;
            }
        }
    }

    #getReadings(ray, roadBorders, traffic) {
        let touches = [];

        if (this.car.type !== "myAiCar") {
            for (let i = 0; i < roadBorders.length; i++){
                const touch = getIntersection(
                    ray[0],
                    ray[1],
                    roadBorders[i][0],
                    roadBorders[i][1]
                );
                if(touch){
                    touches.push(touch);
                }
            }
        }

        for (let i=0;i<traffic.length;i++){
            const poly = traffic[i].polygon;
            for (let j=0;j<poly.length;j++){
                const value = getIntersection(
                    ray[0],
                    ray[1],
                    poly[j],
                    poly[(j+1)%poly.length]
                );
                if(value){
                    touches.push(value);
                }
            }
        }

        if (touches.length == 0){
            return null;
        } else {
            const offsets = touches.map(e=>e.offset);
            const minOffSet = Math.min(...offsets);
            return touches.find(e=>e.offset==minOffSet);
        }
    }

    #castRays() {
        this.rays = [];
        for(let i = 0; i < this.rayCount; i++) {
            const rayAngle = lerp(this.raySpread/2, -this.raySpread/2, i/(this.rayCount-1))+this.car.angle;

            const start = {x:this.car.x, y:this.car.y};
            const end = {x:this.car.x-Math.sin(rayAngle)*this.rayLength, y:this.car.y-Math.cos(rayAngle)*this.rayLength};
            this.rays.push([start, end]);
        };
    }

    draw(ctx){
        for (let i = 0; i < this.rayCount; i++){
            let end = this.rays[i][1];
            if(this.readings[i]){
                end = this.readings[i];
            }
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(
                this.rays[i][0].x, 
                this.rays[i][0].y);
            ctx.lineTo(
                end.x, 
                end.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.moveTo(
                this.rays[i][1].x, 
                this.rays[i][1].y);
            ctx.lineTo(
                end.x, 
                end.y);
            ctx.stroke();
        }
    }
}