import React from 'react';
import './App.css';


function Title ()  {
  return <div>
  <h1> 
      Conway's Game of life
    </h1>
    <ol>
      <li>Click on the cells to set the initial condition</li>
      <li>Click on play</li>
      <li>(Optional) if you want to reset the game click on Reset</li>
    </ol>
  </div>
}

class Cell extends React.Component {
  constructor(props){
    super(props)
    this.handleClickCell = this.handleClickCell.bind(this)
  }

  handleClickCell (pos,cellState) {
    this.props.onCellClick(pos,cellState)
  }


  render () {
    const {alive,position} = this.props
    const isAlive = (alive === true) ? 'square-alive' : 'square-dead';
    return <button className={"square " + isAlive } onClick={() => this.handleClickCell(position,alive)}></button>
  }
}

class Board extends React.Component {

  handleCellClicked(pos,cellState) {
    this.props.onBoardChange(pos,cellState)
  }

  render () {
    const cells = this.props.cells
  
    return <div>
              {cells.map((row, x) => (
                  <div key={x} className="board-row">
                     {row.map((state,y) => <Cell alive={state} key={x + "-" + y} position={[x,y]} onCellClick={(pos,cellState) => this.handleCellClicked(pos,cellState)}/>)}
                  </div>
                )
              )
              }
          </div>
  }
}

class PlayButton extends React.Component {
  constructor(props) {
    super(props)

    this.handlePlayClickBtn = this.handlePlayClickBtn.bind(this)
  }
  handlePlayClickBtn (e) {
    e.preventDefault();
    this.props.onClicked()
  }

  render () {
    const {children} = this.props 
    return <button onClick={this.handlePlayClickBtn}>{children}</button>
  }
  
}


function setNextGrid (grid) {
  let newCellGrid = Array(grid.length).fill(false).map(() => new Array(grid.length).fill(false))
  let nbrVoisinAlive = 0;
  const neighborhood = [[-1,-1],[-1,0],[-1,+1],[0,+1],[+1,+1],[+1,0],[+1,-1],[0,-1]]
  
  grid.map((row,i) => row.map((cell,j) => {
      nbrVoisinAlive = 0;
      
      for (const element of neighborhood) {
        let rowNeighbour  = i+element[0];
        let colNeighbour  = j+element[1];

        if(rowNeighbour >= 0 && rowNeighbour < grid.length && colNeighbour < row.length && colNeighbour >= 0) {

          if (typeof grid[rowNeighbour][colNeighbour] !== 'undefined') {
            
            let voisinCurrentCase = grid[rowNeighbour][colNeighbour];
            if(voisinCurrentCase === true){
              nbrVoisinAlive++
            }
          }
        }
      }

      if(nbrVoisinAlive === 3){
        newCellGrid[i][j] = true
      }
      else if (nbrVoisinAlive === 2){
        newCellGrid[i][j] = cell
      }
      else if(nbrVoisinAlive > 3 || nbrVoisinAlive < 2 ){
        newCellGrid[i][j] = false
      }
      return newCellGrid[i][j];
    }))
  return newCellGrid
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.columns = parseInt(this.props.col)
    this.row = parseInt(this.props.row)
    this.state = {
      cells : Array(this.columns).fill(false).map(() => new Array(this.row).fill(false)),
      generation : 0
    }
    this.handlePlayClick = this.handlePlayClick.bind(this)
    this.handleResetClick = this.handleResetClick.bind(this)
    
  }

  handleBoardChange (pos,cellState) {
    const cells = this.state.cells.slice();
    const [x,y] = pos
    cells[x][y] = !cellState
    this.setState({cells: cells})
  }

  handleResetClick() {
    window.clearInterval(this.timer)
    this.setState({cells:  Array(this.columns).fill(false).map(() => new Array(this.row).fill(false)),generation : 0})
  }

  handlePlayClick() {
    this.timer = window.setInterval(() => {// mettre ici le calcul de la prochaine etape
      const nextCellGrid = setNextGrid(this.state.cells)
      this.setState({cells : nextCellGrid ,generation : this.state.generation + 1 })
    },500)
    
  }

  render () {
    return <div>
              <Board col={this.columns} row={this.row} cells={this.state.cells} onBoardChange={(pos,cellState) => this.handleBoardChange(pos,cellState)}/>
              <PlayButton onClicked={this.handlePlayClick}>Play</PlayButton>
              <PlayButton onClicked={this.handleResetClick}>Reset</PlayButton>
              <span>{this.state.generation}</span>
      </div>

  }
}

function App() {
  return (
    <div className="App">
        <Title/>
        <Game col="20" row="20"/>
    </div>
  );
}

export default App;
