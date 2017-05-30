globalGameConfig = {
    width: 760,
    height: 480,
    backgroundColor: '#eeeeee',
    grid: {
        h:10,
        v:10
    },
    dimension: {
        length:64,
        width:16
    }
}
globalGameConfig.width = ((globalGameConfig.dimension.length)*globalGameConfig.grid.h)+globalGameConfig.dimension.width;
globalGameConfig.height = ((globalGameConfig.dimension.length)*globalGameConfig.grid.v)+globalGameConfig.dimension.width;



var MazeGame = function(selector) {

    this.table = $(selector);
    this.grid = new Array();
    this.generator = false;
    this.colors = {
        wall: '#111111',
    };
    //Represents the Starting Cell in the Grid
    this.start = {
        i:1,
        j:1
    };
    //Represents the Endign Cell in the Grid
    this.end = {
        i:1,
        j:7
    };
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
    return newcell;
}
MazeGame.prototype.generateJointCell = function (newrow,i,j) {
    var newcell = this.generateCell(newrow,i,j);
    newcell.addClass('joint');
}
MazeGame.prototype.generateWallCell = function (newrow,i,j) {
    var newcell =  this.generateCell(newrow,i,j);
    newcell.addClass('wall');
    var game = this;
    if(this.generator) {
        newcell.click(this.wallClicked);
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
MazeGame.prototype.wallClicked = function () {
    $(this).toggleClass('inactive');
    //this.urlInactiveCells();
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
MazeGame.prototype.urlInactiveCells = function () {
    var griddata = this.loadInactiveCells();
    var str = "";
    if(griddata.inactive.length > griddata.active.length) {
        x = griddata.active;

    } else {
        x = griddata.inactive;
        str = "i";
    }
    for(var i=0;i<x.length;i++) {
        var xi = x[i].i<10 ? "0"+x[i].i : ""+x[i].i;
        var xj = x[i].j<10 ? "0"+x[i].j : ""+x[i].j;
        str += "" + xi + xj;
    }
    $('.debugdata').html(str);
    //split string in chunks of 4 each
    var array = str.match(/.{1,4}/g);
    console.log(array);
}
$(function(){
    var game = new MazeGame('#game table tbody');
    game.generator = true;
    game.start();
});
