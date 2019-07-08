var width = window.innerWidth;
var height = window.innerHeight;

var config = {
    type: Phaser.AUTO,
    width: width,
    height: height,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
}

function create ()
{
}
