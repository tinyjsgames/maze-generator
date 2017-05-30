globalGameConfig = {
    width: 760,
    height: 480,
    backgroundColor: '#eeeeee',
    grid: {
        h:9,
        v:9
    },
    dimension: {
        length:64,
        width:16
    }
}
globalGameConfig.width = ((globalGameConfig.dimension.length)*globalGameConfig.grid.h)+globalGameConfig.dimension.width;
globalGameConfig.height = ((globalGameConfig.dimension.length)*globalGameConfig.grid.v)+globalGameConfig.dimension.width;
var Boot = function() {

}
Boot.prototype = {
    preload: function() {
        game.stage.backgroundColor = globalGameConfig.backgroundColor;
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
        var wall = this.add.graphics(0,0);
        wall.lineStyle(1,0xffffff,1);
        wall.beginFill(0xffffff);
        wall.drawRect(0, 0, 1,1);
        wall.endFill();
        emptyTexture = wall.generateTexture(1);
        wall.kill();
    },
    create: function() {

        game.state.start('level1');

    },
    update: function() {

    }
}
var level1 = function() {

}
level1.prototype = {
    wallClicked: function(key,game,w) {
        w.tint = 0x777777;
        if(w.gridData.active) {
            w.gridData.active = false;
            w.alpha = 0.2;
        } else {
            w.gridData.active = true;
            w.alpha = 1;
        }
    },
    wallHoverIn: function(key,game,w) {
        if(w.gridData.active) {
            w.tint = 0xff3333;
        } else {
            w.tint = 0x33ff33;

        }

    },
    wallHoverOut: function(key,game,w) {
        w.tint = 0x777777;
    },
    generateWall: function(x,y,width,height) {
        var w = game.add.tileSprite(x,y,width,height, emptyTexture);
        w.tint = 0x777777;


        return w;
    },
    loadGrid: function(width,height,data) {
        grid = {
            h:new Array(),
            v:new Array()
        };
        open = {
            h:new Array(),
            v:new Array()
        };
        dimensions = {
            h:globalGameConfig.dimension.length,
            v:globalGameConfig.dimension.width,
        };
        padding = {
            h:0,
            v:0,
        };
        for(var i=0; i<=height; i++) {
            grid.h[i] = new Array();
            var j=0;
            while(j<width) {
                var x = "" + i + "," + j;
                var posx = (j*(dimensions.h))+padding.h;
                var posy = (i*(dimensions.h))+padding.h;
                if(open.h.indexOf(x) < 0) {
                    var tilecount = 1;
                    j++;
                    /*
                    while(j<width) {
                        var x2 = "" + i + "," + j;
                        if(open.h.indexOf(x2) < 0) {
                            j++;
                            tilecount++;
                        } else {

                            break;
                        }
                    }
                    */
                    var wallwidth = (dimensions.h)*tilecount;
                    var wallheight = dimensions.v;
                    var w = this.generateWall(posx,posy,wallwidth,wallheight);
                    w.gridData = {
                        type:'h',
                        i:i,
                        j:j,
                        active: true,
                    };
                    w.inputEnabled = true
                    w.events.onInputDown.add(this.wallClicked, this, 0 , w);
                    w.events.onInputOver.add(this.wallHoverIn, this, 0 , w);
                    w.events.onInputOut.add(this.wallHoverOut, this, 0 , w);
                    grid.h[i][j] = w;

                } else {
                    j++;
                }

            }
        }
        for(var i=0; i<=width; i++) {
            grid.v[i] = new Array();
            var j=0;
            while(j<height) {
                var x = "" + i + "," + j;
                var posx = (i*(dimensions.h))+padding.h;
                var posy = padding.h+(j*(dimensions.h));
                if(open.v.indexOf(x) < 0) {
                    var tilecount = 1;
                    j++;
                    /*
                    while(j<height) {
                        var x2 = "" + i + "," + j;
                        if(open.v.indexOf(x2) < 0) {
                            j++;
                            tilecount++;
                        } else {
                            break;
                        }
                    }
                    */
                    var wallheight = (dimensions.h)*tilecount + dimensions.v;
                    var wallwidth = dimensions.v;
                    var w = this.generateWall(posx,posy,wallwidth,wallheight);
                    w.gridData = {
                        type:'v',
                        i:i,
                        j:j,
                        active: true,
                    };
                    w.inputEnabled = true
                    w.events.onInputDown.add(this.wallClicked, this, 0 , w);
                    w.events.onInputOver.add(this.wallHoverIn, this, 0 , w);
                    w.events.onInputOut.add(this.wallHoverOut, this, 0 , w);
                    grid.v[i][j] = w;

                } else {
                    j++;
                }

            }
        }


        /*
        for(var i=0; i<height; i++) {
            var x = this.add.sprite(padding.h+(width*(dimensions.h))-dimensions.v/2,padding.h+(i*(dimensions.h+dimensions.v))+dimensions.v,this.game.textures.vertical);
            x.scale.setTo(0.5,1);
        }*/

    },
    preload: function() {
        /*
        //Generate the Outer Frame!
        dimensions = {
            h:64,
            v:8
        };
        this.generateWall(0,0,game.width,dimensions.v);
        this.generateWall(0,game.height-dimensions.v,game.width,dimensions.v);
        this.generateWall(0,0,dimensions.v,game.height);
        this.generateWall(game.width-dimensions.v,0,dimensions.v,game.height);

        */
        //Load The Full grid!

        this.loadGrid(globalGameConfig.grid.h,globalGameConfig.grid.v);
    },
    create: function() {

    }

}


$(function(){
    game = new Phaser.Game(globalGameConfig.width,globalGameConfig.height, Phaser.AUTO, 'game');
    game.state.add('boot',Boot);
    game.state.add('preload',Preload);
    game.state.add('level1',level1);
    game.state.start('boot');
});
