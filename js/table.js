globalGameConfig = {
    width: 760,
    height: 480,
    backgroundColor: '#eeeeee',
    grid: {
        h:20,
        v:20
    },
    dimension: {
        length:64,
        width:16
    }
}
globalGameConfig.width = ((globalGameConfig.dimension.length)*globalGameConfig.grid.h)+globalGameConfig.dimension.width;
globalGameConfig.height = ((globalGameConfig.dimension.length)*globalGameConfig.grid.v)+globalGameConfig.dimension.width;
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}


var MazeGame = function(selector) {

    this.table = $(selector);
    this.grid = new Array();
    this.generator = false;
    this.colors = {
        wall: '#111111',
    };
    this.player = $('<span class="ball player"></span>');
    this.door = $('<span class="ball green door"></span>');
    //Represents the Starting Cell in the Grid
    this.startingPosition = {
        i:1,
        j:1
    };
    //Represents the Endign Cell in the Grid
    this.endingPosition = {
        i:39,
        j:39
    };
    this.ball = {
        object: this.player,
        j:this.startingPosition.j,
        i:this.startingPosition.i
    }
}
/** Maze Game Maze Generation Logic */

MazeGame.prototype.start = function() {
    if(!this.generator) {
        this.table.addClass('maze-playing');
    } else {
        this.table.addClass('maze-creating');
    }
    this.generateMaze();
}

MazeGame.prototype.generateMaze = function() {
    for(var i=0;i<globalGameConfig.grid.v; i++) {
        this.grid[i*2] = new Array();
        this.grid[(i*2)+1] = new Array();
        this.generateWallRow(i*2);
        this.generateRow((i*2)+1);
    }
    this.grid[i*2] = new Array();
    this.generateWallRow(i*2);
}

MazeGame.prototype.generateWallRow = function (i) {
    var newrow = $('<tr></tr>');
    this.table.append(newrow);
    for(var j=0;j<globalGameConfig.grid.v; j++) {
        this.generateJointCell(newrow,i,j*2);
        this.generateWallCellHorizontal(newrow,i,(j*2)+1);
    }
    this.generateJointCell(newrow,i,j*2);
}

MazeGame.prototype.generateRow = function (i) {
    var newrow = $('<tr></tr>');
    this.table.append(newrow);
    for(var j=0;j<globalGameConfig.grid.v; j++) {
        this.generateWallCellVertical(newrow,i,j*2);
        this.generateCell(newrow,i,(j*2+1));
    }
    this.generateWallCellVertical(newrow,i,j*2);
}
MazeGame.prototype.generateCell = function(newrow,i,j) {
    var newcell = $('<td></td>');
    newcell.data('i',i);
    newcell.data('j',j);
    this.grid[i][j] = newcell;
    newrow.append(newcell);
    if(this.startingPosition.i == i && this.startingPosition.j == j ) {
        newcell.append(this.player);
    }
    if(this.endingPosition.i == i && this.endingPosition.j == j ) {
        newcell.append(this.door);
    }
    return newcell;
}
MazeGame.prototype.generateJointCell = function (newrow,i,j) {
    var newcell = this.generateCell(newrow,i,j);
    newcell.addClass('joint');
}
MazeGame.prototype.generateWallCell = function (newrow,i,j) {
    var newcell =  this.generateCell(newrow,i,j);
    newcell.addClass('wall');

    if(this.generator) {
        var mazegame = this;
        newcell.click(function() {
            mazegame.wallClicked($(this),mazegame);
        });
    }
    return newcell;
}
MazeGame.prototype.generateWallCellHorizontal = function (newrow,i,j) {
    var newcell = this.generateWallCell(newrow,i,j);
    newcell.addClass('horizontal');
}
MazeGame.prototype.generateWallCellVertical = function (newrow,i,j) {
    var newcell = this.generateWallCell(newrow,i,j);
    newcell.addClass('vertical');
}
MazeGame.prototype.wallClicked = function (clickedwall, mazegame) {
    clickedwall.toggleClass('inactive');
    //this.urlInactiveCells();
    mazegame.generateURL();
}
MazeGame.prototype.loadInactiveCells = function() {
    grid = this.grid;
    var inactivedump = new Array();
    var activedump = new Array();
    for(var i=0; i<grid.length;i++) {
        for(var j=0; j<grid[i].length;j++) {
            if(grid[i][j].hasClass('wall')) {
                if(grid[i][j].hasClass('inactive')) {
                    inactivedump.push({
                        'i':i,
                        'j':j
                    })
                } else {
                    activedump.push({
                        'i':i,
                        'j':j
                    })
                }
            }

        }
    }
    return {inactive: inactivedump, active: activedump} ;
}
MazeGame.prototype.renderInactiveCells = function () {
    var griddata = this.loadInactiveCells();
    var x = JSON.stringify(griddata.inactive);
    $('.debugdata').html(x);
}
MazeGame.prototype.compressedCellData = function () {
    var griddata = this.loadInactiveCells();
    var str = "";
    if(griddata.inactive.length > griddata.active.length) {
        x = griddata.active;
        str = "o";

    } else {
        x = griddata.inactive;
        str = "i";
    }
    for(var i=0;i<x.length;i++) {
        var xi = x[i].i<10 ? "0"+x[i].i : ""+x[i].i;
        var xj = x[i].j<10 ? "0"+x[i].j : ""+x[i].j;
        str += "" + xi + xj;
    }

    return str;
    //split string in chunks of 4 each
    //

}
MazeGame.prototype.generateURL = function () {
    var string = this.compressedCellData();
    var l = document.location.href;
    var link = document.createElement("a");
    link.href = l;
    var url = link.protocol + "//" + link.host + "/" + link.pathname + "?d=" + string;
    $('.debugdata').html(url);
    return url;
    /* Load Merge Data Inside a URL */
}
MazeGame.prototype.disableAllButWalls = function(walldata) {
    var grid = this.grid;
    for(var i=0; i<grid.length;i++) {
        for(var j=0; j<grid[i].length;j++) {
            if(grid[i][j].hasClass('wall')) {
                var stri = i < 10 ? "0"+i: ""+ i;
                var strj = j < 10 ? "0"+j: ""+ j;
                if(walldata.indexOf(stri+strj)>=0) {
                    grid[i][j].removeClass('inactive');
                } else {
                    grid[i][j].addClass('inactive');
                }
            }

        }
    }
}
MazeGame.prototype.enableAllButWalls = function(walldata) {
    var grid = this.grid;
    for(var i=0; i<grid.length;i++) {
        for(var j=0; j<grid[i].length;j++) {
            if(grid[i][j].hasClass('wall')) {
                var stri = i < 10 ? "0"+i: ""+ i;
                var strj = j < 10 ? "0"+j: ""+ j;
                if(walldata.indexOf(stri+strj)>=0) {
                    grid[i][j].addClass('inactive');
                } else {
                    grid[i][j].removeClass('inactive');
                }
            }
        }
    }
}
MazeGame.prototype.enableAllWalls = function() {
    var grid = this.grid;
    for(var i=0; i<grid.length;i++) {
        for(var j=0; j<grid[i].length;j++) {
            if(grid[i][j].hasClass('wall')) {
                if(grid[i][j].hasClass('inactive')) {
                    grid[i][j].removeClass('inactive')
                }
            }

        }
    }
}
MazeGame.prototype.disableAllWalls = function() {
    var grid = this.grid;
    for(var i=0; i<grid.length;i++) {
        for(var j=0; j<grid[i].length;j++) {
            if(grid[i][j].hasClass('wall')) {
                if(!grid[i][j].hasClass('inactive')) {
                    grid[i][j].addClass('inactive')
                }
            }

        }
    }
}
MazeGame.prototype.loadFromURL = function() {
    var data = getQueryVariable("d");

    if(data) {
        var type = data.substring(0,1);
        var griddata = data.substring(1);
        var processeddata = new Array();
        var array = griddata.match(/.{1,4}/g);
        if(array!==null) {
            for(var k=0; k<array.length; k++) {
                var item = array[k];
                var indexes = item.match(/.{1,2}/g);
                if(indexes.length==2) {
                    processeddata.push(item);
                }
            }
        }
        if(type=="i") {
            // Data Represents which grid items are disabled
            this.enableAllButWalls(processeddata);
        } else {
            this.disableAllButWalls(processeddata);
            //Data Represents which grid items are enabled

        }
    }


}
MazeGame.prototype.startInput = function() {
    var mazegame = this;
    $(document).on('keypress',function(event){
        if(event.keyCode==37) {
            mazegame.moveBallLeft();
        }
        if(event.keyCode==38) {
            mazegame.moveBallUp();
        }
        if(event.keyCode==39) {
            mazegame.moveBallRight();
        }
        if(event.keyCode==40) {
            mazegame.moveBallDown();
        }
    })
}
MazeGame.prototype.moveBallUp = function() {
    var newposi = this.ball.i-2;
    var newposj = this.ball.j;
    var walli = this.ball.i-1;
    var wallj = this.ball.j;
    if(this.grid[walli][wallj].hasClass('inactive'))
    this.moveBall(newposi,newposj);
}
MazeGame.prototype.moveBallLeft = function() {
    var newposi = this.ball.i;
    var newposj = this.ball.j-2;
    var walli = this.ball.i;
    var wallj = this.ball.j-1;
    if(this.grid[walli][wallj].hasClass('inactive'))
    this.moveBall(newposi,newposj);
}
MazeGame.prototype.moveBallDown = function() {
    var newposi = this.ball.i+2;
    var newposj = this.ball.j;
    var walli = this.ball.i+1;
    var wallj = this.ball.j;
    if(this.grid[walli][wallj].hasClass('inactive'))
    this.moveBall(newposi,newposj);
}
MazeGame.prototype.moveBallRight = function() {

    var newposi = this.ball.i;
    var newposj = this.ball.j+2;
    var walli = this.ball.i;
    var wallj = this.ball.j+1;
    if(this.grid[walli][wallj].hasClass('inactive'))
    this.moveBall(newposi,newposj);

}
MazeGame.prototype.moveBall = function(newposi, newposj) {
    if(typeof(this.grid[newposi]) !=='undefined' && typeof(this.grid[newposi][newposj])!=='undefined') {
        this.grid[newposi][newposj].append(this.ball.object);
        this.ball.i = newposi;
        this.ball.j = newposj;
    }
}
$(function(){
    var game = new MazeGame('#game table tbody');
    game.generator = false;
    game.start();
    game.loadFromURL();
    game.startInput();
});
