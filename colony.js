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
    this.load.image('anthill', 'assets/anthill.png');
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
    anthill = soilGroup.create(width / 2, height / 2, 'anthill').setOrigin(0.5, 1);

    ants = [];
    for (i = 0; i < 5; i++) {
        ant = this.physics.add.sprite(width / 2, height / 2, 'ant').setOrigin(0.5, 1);
        ant.setCollideWorldBounds(true);
        antAgent = {
            sprite: ant,
            isCarryingFood: false,
            isGoingHome: false,
            justDeliveredFood: true
        };
        ant.agent = antAgent;
        ants[i] = antAgent;
    }

    // Add some food
    foods = this.physics.add.group();
    for (i = 0; i < 10; i++) {
        foods.create(Phaser.Math.Between(0, width), height / 2, 'food').setOrigin(0.5, 1);
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

    for (i = 0; i < ants.length; i++) {
        this.physics.add.overlap(ants[i].sprite, foods, collectFood, null, this);
        this.physics.add.overlap(ants[i].sprite, anthill, deliverFood, null, this);
    }
}

function update () {
    for (i = 0; i < ants.length; i++) {
        antAgent = ants[i];
        if (antAgent.isCarryingFood && !antAgent.isGoingHome) {
            antX = antAgent.sprite.getCenter().x;
            anthillX = anthill.getCenter().x;
            if (antX < anthillX) {
                antAgent.sprite.setVelocityX(100);
                antAgent.sprite.anims.play('right', true);
            } else if (anthillX < antX) {
                antAgent.sprite.setVelocityX(-100);
                antAgent.sprite.anims.play('left', true);
            }
            antAgent.isGoingHome = true;
        } else if (!antAgent.isCarryingFood) {
            // TODO currently this depends on the update rate, which is bad
            random = Phaser.Math.FloatBetween(0.0, 1.0);
            if (random < 0.01 || antAgent.justDeliveredFood) {
                antAgent.justDeliveredFood = false;
                velocity = Phaser.Math.Between(-300, 300);
                antAgent.sprite.setVelocityX(velocity);
                if (velocity < 0) {
                    antAgent.sprite.anims.play('left', true);
                } else if (velocity == 0) {
                    antAgent.sprite.anims.play('stationary');
                } else {
                    antAgent.sprite.anims.play('right', true);
                }
            }
        }
    }
}

function collectFood (ant, food) {
    if (!ant.agent.isCarryingFood) {
        food.disableBody(true, true);
        ant.agent.isCarryingFood = true;
    }
}

function deliverFood(ant) {
    if (ant.agent.isCarryingFood) {
        ant.agent.isCarryingFood = false;
        ant.agent.isGoingHome = false;
        ant.agent.justDeliveredFood = true;
    }
}
