// var board;
// var game;
//
// //setup my socket client
// const socket = io();
//
// // window.onload = () => {
// //   initGame();
// // }
//
// function initGame(){
//   const cfg = {
//     draggable: true
//     , position: "start"
//     , onDrop: handleMove
//   };
//   board = new ChessBoard("gameBoard", cfg);
//   game = new Chess();
// }
//
// function handleMove(source, target){
//   let move = game.move({from: source, to: target});
//
//   if(move === null) return "snapback";
//   else socket.emit("move", move);
// }
//
// socket.on("move", msg => {
//   game.move(msg);
//   board.position(game.fen());
// });
