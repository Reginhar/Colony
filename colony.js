var width = window.innerWidth;
var height = window.innerHeight;

var config = {
    type: Phaser.AUTO,
    width: width,
    height: height,
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('soil', 'assets/soil.png');
    this.load.image('food', 'assets/food.png');
    this.load.spritesheet('ant', 'assets/ant.png', {frameWidth: 32, frameHeight: 23});
}

function create ()
{
    soilGroup = this.physics.add.staticGroup();
    soil = soilGroup.create(width, height, 'soil');
    soil.displayWidth = width;
    soil.displayHeight = height / 2;
    soil.refreshBody();

    ant = this.physics.add.sprite(width / 2, height / 2, 'ant');

    // Add some food
    foods = this.physics.add.group();
    for (i = 0; i < 10; i++) {
        foods.create(Phaser.Math.Between(0, width), height / 2, 'food');
    }

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('ant', {start: 0, end: 3 }),
        frameRate: 20,
        repeat: -1
    });
    this.anims.create({
        key: 'stationary',
        frames: [{key: 'ant', frame: 4}],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('ant', {start: 5, end: 8}),
        frameRate: 20,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.overlap(ant, foods, collectFood, null, this);
}

function update () {
    if (cursors.left.isDown) {
        ant.setVelocityX(-200);
        ant.anims.play('left', true);
    } else if (cursors.right.isDown) {
        ant.setVelocityX(200);
        ant.anims.play('right', true);
    } else {
        ant.setVelocityX(0);
        ant.anims.play('stationary');
    }
}

function collectFood (ant, food) {
    food.disableBody(true, true);
}
