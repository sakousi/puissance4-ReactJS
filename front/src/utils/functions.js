// import { Connect4GameContext } from "../context/Connect4GameContext";

export function updateCurrentPlayer(gameContext, player) {
  gameContext.setCurrentPlayer({player});
}

export function createBoard(numColumns, numCircles) {
  const board = [];
  for (let i = 0; i < numColumns; i++) {
    const column = Array(numCircles).fill(0);
    board.push(column);
  }
  return board;
}