let i = 0;
class Car{
    constructor(x,y,width,heigth, type, maxSpeed=3){
        this.x = x;
        this.y = y;
        this.width = width;
        this.heigth = heigth;
        
        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.02;
        this.angle = 0;
        this.damaged = false;
        this.type = type;

        this.damagedCars = 0;

        this.useBrain = type=="AI";
        
        if(type != "DUMMY") {
            this.sensor = new Sensor(this);
            this.brain=new neuralNetwork([this.sensor.rayCount,6,4]);
        }
        this.controls = new Controls(type, this);
    }

    update(roadBorders, traffic){
        if(!this.damaged){
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
            if (this.damaged) {
                i++;
                if (i == cars.length){
                    let attempt = localStorage.getItem("attempt");
                    save();
                    attempt++;
                    localStorage.setItem("attempt", attempt);
                    location.reload();
                }
            }
        }
        if (this.sensor) {
            this.sensor.update(roadBorders, traffic);
            const offsets=this.sensor.readings.map(
                s=>s==null?0:1-s.offset
            );
            const outputs = neuralNetwork.feedForward(offsets, this.brain);

            if(this.useBrain){
                this.controls.forward=outputs[0];
                this.controls.left=outputs[1];
                this.controls.right=outputs[2];
                this.controls.reverse=outputs[3];
            }
        }
    }

    #assessDamage(roadBorders, traffic) {
        for (let i=0;i<roadBorders.length;i++){
            if(polyIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }

        for (let i=0;i<traffic.length;i++){
            if(polyIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }
        return false;
    }

    #createPolygon(){
        const points = [];
        const rad = Math.hypot(this.width, this.heigth)/2;
        const alpha = Math.atan2(this.width, this.heigth);
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        }); 
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        }); 

        return points;
    }

    #move(){
        if(this.controls.forward) {
            this.speed+=this.acceleration;
        }
        if(this.controls.reverse) {
            this.speed-=this.acceleration;
        }

        if(this.speed>this.maxSpeed) {
            this.speed=this.maxSpeed;
        }
        if(this.speed<-this.maxSpeed/2) {
            this.speed=-this.maxSpeed/2;
        }

        if(this.speed>0) {
            this.speed-=this.friction;
        }
        if(this.speed<0) {
            this.speed+=this.friction;
        }
        if(Math.abs(this.speed)<this.friction){
            this.speed = 0;
        }

        if(this.speed!=0){
            const flip=this.speed>0?1:-1;
            if(this.controls.left){
                this.angle+=0.03*flip;
            }
            if(this.controls.right){
                this.angle-=0.03*flip;
            }
        }

        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
        //console.log("X: "+this.x+" A: "+this.angle);
    }

    draw(ctx, color, sensorDisplay=false){
        if (this.sensor && sensorDisplay) {
            this.sensor.draw(ctx);
        }
        
        if (this.damaged){
            ctx.fillStyle = "gray";
        } else {
            ctx.fillStyle = color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length;i++){
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
    }
}