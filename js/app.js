globalGameConfig = {
    width: 1900,
    height: 480,
    backgroundColor: '#222222',
}
var Boot = function() {

}
Boot.prototype = {
    preload: function() {

    },
    create: function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.state.start('preload');
    }
}

var Preload = function() {

}
Preload.prototype = {

    preload: function() {

    },
    create: function() {


    },
    update: function() {

    }
}


$(function(){
    game = new Phaser.Game(globalGameConfig.width,globalGameConfig.height, Phaser.AUTO, 'game');
    game.state.add('boot',Boot);
    game.state.add('preload',Preload);
    game.state.start('boot');
});
