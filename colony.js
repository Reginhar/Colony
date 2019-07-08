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
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('soil', 'assets/soil.png');
}

function create ()
{
    soilGroup = this.physics.add.staticGroup();
    soil = soilGroup.create(width, height, 'soil');
    soil.displayWidth = width;
    soil.displayHeight = height / 2;
    soil.refreshBody();
}
