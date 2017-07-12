
var game;
var images = {};

var loadImages = function(sources, callback){
    var nb = 0;
    var loaded = 0;
    var imgs = {};
    for(var i in sources){
        nb++;
        imgs[i] = new Image();
        imgs[i].src = sources[i];
        imgs[i].onload = function(){
            loaded++;
            if(loaded == nb){
                callback(imgs);
            }
        }
    }
};
var Pipe = function(json){
    this.x = 0;
    this.y = 0;
    this.width = 50;
    this.height = 40;
    this.speed = 3;

    this.init(json);
};

Pipe.prototype.init = function(json){
    for(var i in json){
        this[i] = json[i];
    }
};

Pipe.prototype.update = function(){
    this.x -= this.speed;
};

Pipe.prototype.isOut = function(){
    if(this.x + this.width < 0){
        return true;
    }
};
var Bird = function(json){
    this.x = 80;
    this.y = 250;
    this.width = 40;
    this.height = 30;

    this.alive = true;
    this.gravity = 0;
    this.velocity = 0.3;
    this.jump = -6;

    this.init(json);
};

Bird.prototype.init = function(json){
    for(var i in json){
        this[i] = json[i];
    }
};

Bird.prototype.flap = function(){
    this.gravity = this.jump;
};

Bird.prototype.update = function(){
    this.gravity += this.velocity;
    this.y += this.gravity;
};

Bird.prototype.isDead = function(height, pipes){
    if(this.y >= height || this.y + this.height <= 0){
        return true;
    }
    for(var i in pipes){
        if(!(
                this.x > pipes[i].x + pipes[i].width ||
                this.x + this.width < pipes[i].x ||
                this.y > pipes[i].y + pipes[i].height ||
                this.y + this.height < pipes[i].y
            )){
            return true;
        }
    }
};

var Game = function(){
    this.canvas = document.querySelector("#flappy");
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.pipes = [];
    this.birds = [];
    this.score = 0;
    this.maxScore = 0;
    this.spawnInterval = 90;
    this.interval = 0;
    this.alives = 0;
    this.backgroundSpeed = 0.5;
    this.backgroundx = 0;
    this.gen = [];
    this.generation = 0;
};
Game.prototype.start = function() {
    this.interval = 0;
    this.score = 0;
    this.pipes = [];
    this.bird = new Bird();
};
Game.prototype.update = function() {
    this.backgroundx += this.backgroundSpeed;
    for(var i = 0; i < this.pipes.length; i++){
        this.pipes[i].update();
        if(this.pipes[i].isOut()){
            this.pipes.splice(i, 1);
            i--;
        }
    }
    this.bird.update();
    if(this.bird.isDead(this.height, this.pipes)) this.start();
    if(this.interval == 0){
        var deltaBord = 50;
        var pipeHoll = 120;
        var random = Math.round(Math.random() * (this.height - deltaBord * 2 - pipeHoll));
        var hollPosition = random +  deltaBord;
        this.pipes.push(new Pipe({x:this.width, y:0, height:hollPosition}));
        this.pipes.push(new Pipe({x:this.width, y:hollPosition+pipeHoll, height:this.height}));
    }

    this.interval++;
    if(this.interval == this.spawnInterval){
        this.interval = 0;
    }
    var self = this;
    setTimeout(function () {
        self.update();
    }, 1000 / 60);
}
Game.prototype.display = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (var i = 0; i < Math.ceil(this.width / images.background.width) + 1; i++) {
        var loca = (i - 1) * images.background.width + Math.floor(this.backgroundx % images.background.width);
        this.ctx.drawImage(images.background, loca, 0)
    }
    for (var i in this.pipes) {
        if (i % 2 == 0) {
            this.ctx.drawImage(images.pipetop, this.pipes[i].x, this.pipes[i].y + this.pipes[i].height - images.pipetop.height, this.pipes[i].width, images.pipetop.height);
        } else {
            this.ctx.drawImage(images.pipebottom, this.pipes[i].x, this.pipes[i].y, this.pipes[i].width, images.pipetop.height);
        }
    }
    this.ctx.fillStyle = "#FFC600";
    this.ctx.strokeStyle = "#CE9E00";
    this.ctx.save();
    this.ctx.translate(this.bird.x + this.bird.width / 2, this.bird.y + this.bird.height / 2);
    this.ctx.rotate(Math.PI / 2 * this.bird.gravity / 20);
    this.ctx.drawImage(images.bird, -this.bird.width / 2, -this.bird.height / 2, this.bird.width, this.bird.height);
    this.ctx.restore();
    var self = this;
    requestAnimationFrame(function () {
        self.display();
    });
};
window.onload = function() {
    loadImages({
        bird: "./img/bird.png",
        background: "./img/background.png",
        pipetop: "./img/pipetop.png",
        pipebottom: "./img/pipebottom.png"
    }, function (imgs) {
        images = imgs;
        game = new Game();
        document.onkeydown = function(event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 32) game.bird.flap();
        }
        game.start();
        game.update();
        game.display();
    })

}