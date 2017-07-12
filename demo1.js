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
}

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
}

Game.prototype.update = function() {
    this.backgroundx += this.backgroundSpeed;
    var self = this;
    setTimeout(function () {
        self.update();
    }, 1000 / 60);
}
Game.prototype.display = function(){
    this.ctx.clearRect(0, 0, this.width, this.height);
    for(var i = 0; i < Math.ceil(this.width / images.background.width) + 1; i++) {
        var loca =  (i - 1) * images.background.width + Math.floor(this.backgroundx % images.background.width);
        this.ctx.drawImage(images.background, loca, 0)
    }
    var self = this;
    requestAnimationFrame(function(){
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
        game.update();
        game.display();
    })

}