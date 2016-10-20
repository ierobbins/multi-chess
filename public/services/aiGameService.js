angular.module("chessApp")
.service("aiGameService", function(){

    let game;
    let board;
    let userSide;
    let side;
    const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    const files = {"a": 0, "b": 1, "c": 2, "d": 3, "e": 4, "f": 5, "g": 6, "h": 7};
    const ranks = {"1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6, "8": 7};

    this.getGame = function(){
        return game;
    }

    this.getBoard = function(){
        return board;
    }

    this.onDragStart = function(source, piece, position, orientation){
        console.log(source);
        let cont = game.getGameController();
        let gb   = game.getGameBoard();
            if(cont.GameOver  === 1 ||
               (gb.side === 0 && piece.search(/^b/) !== -1) ||
               (gb.side === 1 && piece.search(/^w/) !== -1) ||
               gb.side !== side){
                   console.log("WHY IS THIS HAPPENING??");
                   return false;
            }
    }

    this.onSnapEnd = function(){
        board.position(game.generateFen());
    }

    this.onDrop = function(source, target, piece, newPos, oldPos, orientation){

        let gb = game.getGameBoard();
        if(gb.side === side){
            let sourceArray = source.split("");
            let targetArray = target.split("");
            console.log(sourceArray, targetArray);
            let parseSQ = game.getFR2SQ();
            let newSource = parseSQ(files[sourceArray[0]], ranks[sourceArray[1]]);
            let newTarget = parseSQ(files[targetArray[0]], ranks[targetArray[1]]);

            game.setUserMove(newSource, newTarget);
            console.log("SOURCE", source, newSource);
            console.log("TARGET", target, newTarget);
            game.MakeUserMove();
            console.log(gb);


            if(game.MakeUserMove() === null) { return "snapback"; }

            let thinkTime = game.getSearchTime() + 500;

            console.log(game.generateFen());

            if(gb.ply === 1){
                setTimeout(function(){
                    board.position(game.generateFen());
                    console.log(gb);
                }, 3000);
            }

            setTimeout(function(){
                board.position(game.generateFen());
                console.log(gb);
            }, thinkTime);
        }

    }

    this.createBoard = function(colorSide){
        userSide = colorSide;
        side = (colorSide === "white") ? 0 : 1;
        game = new chessAI(side);
        game.init()
        game.NewGame(START_FEN);
        let gb = game.getGameBoard();
        const cfg = {
            draggable: true
            , position: "start"
            , moveSpeed: "slow"
            , onDragStart: this.onDragStart
            , onSnapEnd: this.onSnapEnd
            , onDrop: this.onDrop
            , snapbackSpeed: 500
            , snapSpeed: 150
            , orientation: userSide
        };
        board = new ChessBoard("gameBoard", cfg);
        console.log(game.getGameBoard())
        if(gb.side !== side){
            game.preSearch();
            setTimeout(function(){
                board.position(game.generateFen());
                console.log(gb);
            }, 3000);
        }
    }

})
