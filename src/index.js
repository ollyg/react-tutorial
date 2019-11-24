import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={props.classes} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        classes={this.props.winning.includes(i) ? 'square winning' : 'square'}
      />
    );
  }

  render() {
    return (
      <div>
        { [0,1,2].map((r) => {
          return (
            <div key={r} className="board-row">
              { [0,1,2].map((c) => this.renderSquare((r*3)+c)) }
            </div>
          )
        }) }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: '',
      }],
      stepNumber: 0,
      xIsNext: true,
      movesAscending: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const location = '('+ (((i - (i % 3)) / 3) + 1) +','+ ((i % 3) + 1) +')'
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        location: location,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  toggleMovesOrder() {
    this.setState({ movesAscending: !this.state.movesAscending });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + current.squares[winner[0]];
    }
    else {
      if (this.state.stepNumber === 9) {
        status = 'A draw!';
      }
      else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
    }

    let moves = history.map((step, move) => {
      const label = move ?
        'Go to move #' + move :
        'Go to game start';
      const desc = (this.state.stepNumber === move) ?
        <b>{label}</b> :
        <span>{label}</span>;
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button> {step.location}
        </li>
      );
    })
    moves = this.state.movesAscending ? moves : moves.reverse();

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winning={winner || []}
          />
        </div>

        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggleMovesOrder()}>reverse moves</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
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
      return lines[i];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
