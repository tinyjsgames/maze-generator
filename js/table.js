globalGameConfig = {
    width: 760,
    height: 480,
    backgroundColor: '#eeeeee',
    grid: {
        h:20,
        v:15

    },
}
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
    this.onChange = null;
    this.grid = new Array();
    this.generator = false;
    this.hasPath = false;
    this.moves = 0;
    this.minmoves = 0;
    this.gridsize = {
        h:globalGameConfig.grid.h,
        v:globalGameConfig.grid.v
    }
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
        i:29,
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
    for(var i=0;i<this.gridsize.v; i++) {
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
    for(var j=0;j<this.gridsize.h; j++) {
        this.generateJointCell(newrow,i,j*2);
        this.generateWallCellHorizontal(newrow,i,(j*2)+1);
    }
    this.generateJointCell(newrow,i,j*2);
}

MazeGame.prototype.generateRow = function (i) {
    var newrow = $('<tr></tr>');
    this.table.append(newrow);
    for(var j=0;j<this.gridsize.h; j++) {
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

    var path =  mazegame.pathFind(mazegame.startingPosition, mazegame.endingPosition);
    if(path !== false) {

    } else {

    }
    if(this.onChange !== null) {
        this.onChange(this);
    }
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

        str += this.nodeToString(x[i]);
    }

    return str;
    //split string in chunks of 4 each
    //

}
MazeGame.prototype.generateURL = function () {
    var string = this.compressedCellData();
    var sizeh = this.gridsize.h < 10 ? "0"+this.gridsize.h : ""+this.gridsize.h;
    var sizev = this.gridsize.v < 10 ? "0"+this.gridsize.v : ""+this.gridsize.v;
    var start = this.nodeToString(this.startingPosition);
    var end = this.nodeToString(this.endingPosition);
    var str = sizeh+sizev+start+end+string;
    var l = document.location.href;
    var link = document.createElement("a");
    link.href = l;
    var host = link.host.toString();
    if(host.substring(host.length-1,host.length)!= "/" && link.pathname.substring(0,1)!= "/") {
        var url = link.protocol + "//" + host + "/" + link.pathname + "?d=" + str;
    } else {
        var url = link.protocol + "//" + host + link.pathname + "?d=" + str;

    }
    url = url.replace('make','play');
    return url;
    /* Load Merge Data Inside a URL */
}
MazeGame.prototype.disableAllButWalls = function(walldata) {
    var grid = this.grid;
    for(var i=0; i<grid.length;i++) {
        for(var j=0; j<grid[i].length;j++) {
            if(grid[i][j].hasClass('wall')) {
                var str = this.nodeToString({i:i,j:j});
                if(walldata.indexOf(str)>=0) {
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
MazeGame.prototype.loadGridInfoFromURL = function() {
    var string = getQueryVariable("d");
    if(string) {
        this.gridsize.h = parseInt(string.substring(0,2));
        this.gridsize.v = parseInt(string.substring(2,4));
        this.startingPosition.i = parseInt(string.substring(4,6));
        this.startingPosition.j = parseInt(string.substring(6,8));
        this.endingPosition.i = parseInt(string.substring(8,10));
        this.endingPosition.j = parseInt(string.substring(10,12));
    }

}
MazeGame.prototype.loadFromURL = function() {
    var string = getQueryVariable("d");
    if(string) {
        var data = string.substring(12);
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


}
MazeGame.prototype.loadGridInfoFromString = function(string) {

    if(string) {
        this.gridsize.h = parseInt(string.substring(0,2));
        this.gridsize.v = parseInt(string.substring(2,4));
        this.startingPosition.i = parseInt(string.substring(4,6));
        this.startingPosition.j = parseInt(string.substring(6,8));
        this.endingPosition.i = parseInt(string.substring(8,10));
        this.endingPosition.j = parseInt(string.substring(10,12));
    }

}
MazeGame.prototype.loadFromString = function(string) {
    if(string) {
        var data = string.substring(12);
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


}
MazeGame.prototype.startInput = function() {
    var mazegame = this;
    $(document).on('keydown',function(event){
        console.log(event.keyCode)
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
        if(!this.generator) {
            this.moves++;
        }
    }
}
MazeGame.prototype.adjacentNodeOpenCheck = function(wall,adjnode) {
    var grid = this.grid;
    if(typeof(grid[wall.i])!=='undefined' && typeof(grid[wall.i][wall.j])!=='undefined') {
        if(grid[wall.i][wall.j].hasClass('inactive')) {
            if(typeof(grid[adjnode.i])!=='undefined' && typeof(grid[adjnode.i][adjnode.j])!=='undefined') {
                return true;
            }
        }
    }
    return false;
}

MazeGame.prototype.adjacentNodes = function(node) {

        var grid = this.grid;
        var adj = new Array(); //Array of Adjacent Nodes
        if(typeof(grid[node.i])!=='undefined' && typeof(grid[node.i][node.j])!=='undefined') {
            //Node Exists
            //Check if the node above is conncected
            if(this.adjacentNodeOpenCheck({i:node.i-1,j: node.j},{i:node.i-2,j:node.j})) {
                adj.push({i: node.i-2,j:node.j})
            }
            //Check if the node bellow is conncected
            if(this.adjacentNodeOpenCheck({i:node.i+1,j: node.j},{i:node.i+2,j:node.j})) {
                adj.push({i: node.i+2,j:node.j})
            }
            //Check if the node to right is conncected
            if(this.adjacentNodeOpenCheck({i:node.i,j: node.j+1},{i:node.i,j:node.j+2})) {
                adj.push({i: node.i,j:node.j+2})
            }
            //Check if the node to left is conncected
            if(this.adjacentNodeOpenCheck({i:node.i,j: node.j-1},{i:node.i,j:node.j-2})) {
                adj.push({i: node.i,j:node.j-2})
            }
        }
        return adj;
};


MazeGame.prototype.pathFind = function(source, destination) {

    /*
        Find Path from Source to Desitination.
        We treat the grid as a graph with cells as vertices and Inactive walls as edges.
        We use BFS (Breadth First Search)
    */
    this.clearGraphData();
    var queue = new Array();
    source.d = 0;
    queue.push(source);
    var mazegame = this;
    var count = 0;
    while(queue.length > 0) {
        count++;
        var node = queue.shift();
        var gridcell = mazegame.getNode(node);
        if(gridcell.data('graphdepth') == null || typeof(gridcell.data('graphdepth'))=='undefined') {
            gridcell.data('graphdepth',node.d);
            var adjacents = mazegame.adjacentNodes(node);
            for( var k = 0;k < adjacents.length; k++) {
                var nextnode = adjacents[k];
                var nextgridcell = mazegame.getNode(nextnode);
                if(nextgridcell.data('graphdepth') == null || typeof(gridcell.data('graphdepth'))=='undefined') {
                    nextnode.d = node.d+1;
                    queue.push(nextnode);
                    nextgridcell.data('graphparent',node)
                }

            }
        }

    }

    var des = this.getNode(destination);

    if(des.data('graphdepth') == null || typeof(des.data('graphdepth'))=='undefined') {
        mazegame.paintPath(false);
        mazegame.hasPath = false;
        mazegame.minmoves = -1;
        return false;
    } else {
        // Build an array of nodes representing a path from destination to source
        var path = new Array();
        var node = destination;
        while(1) {
            path.push(node);
            var des = this.getNode(node);
            if(typeof(des.data('graphparent')) == 'undefined' || des.data('graphparent') == null) {
                break;
            } else {
                var node = des.data('graphparent');
            }

        }
        mazegame.hasPath = true;
        mazegame.minmoves = path.length-1;
        mazegame.paintPath(path);
        return path;
    }
}
MazeGame.prototype.paintPath = function (path) {
    $('td').removeClass('green');
    if(path!==false) {
        for(var k=0;k<path.length;k++) {
            var gridcell = this.getNode(path[k]);
            gridcell.addClass('green');
        }
    }

}
MazeGame.prototype.clearGraphData = function() {
    var grid = this.grid;
    for(var i=1; i<grid.length;i+=2) {
        for(var j=1; j<grid[i].length;j+=2) {
            grid[i][j].data('graphdepth',null);
        }
    }
}
MazeGame.prototype.getNode = function(node) {
    return this.grid[node.i][node.j];
}
MazeGame.prototype.nodeToString = function(node) {
    var stri = node.i < 10 ? "0"+node.i: ""+ node.i;
    var strj = node.j < 10 ? "0"+node.j: ""+ node.j;
    return stri+strj;
}
