import React from 'react';
import ReactDOM from 'react-dom/client';
import './app.css';

function Square(props) {
      return (
        <button 
        className={"square " + (props.isWinning ? "square--winning" : null)}
        onClick={props.onClick}
        >
          {props.value}
        </button>
      );
    }
  
  class Board extends React.Component {
    renderSquare(i) {
      return <Square 
      isWinning={this.props.winningSquares.includes(i)}
      key={i}
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
       />;
    }
  
    render() {  
        let rows = [];
        let boxes= [];
        let square_num = 0;

        for(var i = 0;i<3;i++) {
            for(var b = 0;b<3;b++) {
                boxes.push(this.renderSquare(square_num))
                square_num++
            }
            rows.push([<div key={i} className="board-row">{boxes}</div>]);
            boxes = [];
        }
      return (
        <div>
            {rows}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                position: {"col": null, "row": null},
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        }
        this.baseState = this.state;
    }
    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                position: checkPosition(i),
                squares:squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }
    jumpTo(step) {
        if(step === 0){
        this.setState(this.baseState);
        }
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
      }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? "Move: " + move + " (Col: "+ step.position.col + " Row: "+ step.position.row + ")" : "Restart";
            let className = "";
            if(this.state.stepNumber === move){
                className = "bold"
            }
            return (
                <li key={move}>
                    <button className={className} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if(winner){
            status = 'Winner: ' + winner.winner;
        } else if(!winner && this.state.stepNumber === 9) {
            status = 'Draw!';
        } else{
            status = 'Next player: ' + (this.state.xIsNext ? 'X':'O');
        }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
            winningSquares={winner ? winner.boxes : []}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>
                {moves}
            </ol>
          </div>
        </div>
      );
    }
  }

  function checkPosition(box){
    let row = null;
    let col = null;

    const boradRows = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
    ]
    const boardCols = [
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
    ]

    boradRows.forEach(e => {
        if (e.includes(box)) {
            row = boradRows.indexOf(e) + 1;
        }
    });
    boardCols.forEach(e => {
        if (e.includes(box)) {
            col = boardCols.indexOf(e) + 1;
        }
    });
    return {"row": row, "col": col}
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {"winner":squares[a], "boxes": lines[i]};
      }
    }
    return null;
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  