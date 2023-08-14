var confing = {
    type: phaser.AUTO,
    width: 1000,
    height:700,
    physics : {
        default: "arcade",
        arcade: {
            gravity : { y : 350},
            debug: false,
        }
    },


    scene: {
        preload: preload,
        create: create,
        update: update,

    }

};
var score= 0 ;
var scoreText;
var gameOver= false;

var game= new Phaser.Game(confing);

function preload() {
    this.load.image("sky","assets/fondo.png")
    this.load.image("ground","assets/platform.png")
    this.load.image("star","assets/star.png")
    this.load.image("bomb","assets/bomb.png")
    this.load.spritesheet("dude","assets/dude.png",{frameWidth:32,frameHeight:48})
}
function create() {
    this.add.image(500,350,"sky")
    
    
    platforms=this.physics.add.staticGroup();
    
    platforms.create(200,150,"ground");
    platforms.setTint(0xff00ff);
    platforms.create(800,200,"ground");
    platforms.setTint(0xff00ff);
    platforms.create(600,300,"ground");
    platforms.setTint(0xff00ff);
    platforms.create(200,400,"ground");
    platforms.setTint(0xff00ff);
    platforms.create(400,500,"ground");
    platforms.setTint(0xff00ff);
    platforms.create(600,600,"ground");
    platforms.setTint(0xff00ff);
    platforms.create(400,630,"ground").setScale(4.2).refreshBody();


    player = this.physics.add.sprite(50,0,"dude");

    player.setCollideWorldBounds(true);
    player.setBounce(0.1);
    this.anims.create({
        key: "left",
        frames :this.anims.generateFrameNumbers("dude",{start: 0, end: 3}),
        frameRate: 15,
        repeat:-1,
    });
    this.anims.create({
        key: "turn",
        frames :[{key:"dude",frame:4}],
        frameRate: 20
    });
    this.anims.create({
        key: "right",
        frames :this.anims.generateFrameNumbers("dude",{start: 5,end : 8}),
        frameRate: 15,
        repeat:-1,
    });
    player.body.setGravityY(3000); 

    this.physics.add.collider(player,platforms);


    cursors = this.input.keyboard.createCursorKeys();

   stars=this.physics.add.group({
        key: "star",
        repeat: 11,
        setXY:{x:12,y:0,stepX:70}
    });
    stars.children.iterate(function(child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.8,1));
        child.setCollideWorldBounds(true);
        child.setVelocity(Phaser.Math.Between(-200,200), 0);
        
    });
    this.physics.add.collider(stars,platforms);
   
    this.physics.add.overlap(player,stars,collectStar,null,true);

    scoreText = this.add.text(650,600,"score: 0", {fontSize:"40px",fill: "#000"})
    
    bombs = this.physics.add.group();
    this.physics.add.collider(bombs,platforms);
    this.physics.add.collider(player,bombs,hitBomb,null,this);
}

function update() {
if(gameOver){
    return
}
if(cursors.left.isDown){
    player.setVelocityX(-400 );
    player.anims.play("left",true);
} else if(cursors.right.isDown){
    player.setVelocityX(400 );
    player.anims.play("right",true);
}else{
    player.setVelocityX(0);
    player.anims.play("turn")
}

    if(cursors.up.isDown && player.body.touching.down){
        player.setVelocityY(-1100);
    }


}
function collectStar(player,star) {
    star.disableBody(true,true);
    score +=10;
    scoreText.setText("score: "+ score);
    if(stars.countActive(true)===0){
        stars.children.iterate(function(child){
            child.enableBody(true,child.x,0,true,true);
        });
        var x = (player.x<400) ? Phaser.Math.Between(700,1000) : Phaser.Math.Between(0,400);
    var bomb = bombs.create(x,16 , "bomb");
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
   bomb.setVelocity(Phaser.Math.Between(-300,300), 20);
    }
    
}

function hitBomb(player,bomb){
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play("turn");
    gameOver= true;
}