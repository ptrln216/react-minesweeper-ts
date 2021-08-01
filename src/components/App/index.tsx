import React, { useState } from 'react'
import './App.scss'
import NumberDisplay from '../NumberDisplay'
import Button from '../Button'
import { generateCells } from '../../utils'

const App: React.FC = () => {
  const [cells, setCells] = useState(generateCells())

  const renderCells = () => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => <Button key={`${rowIndex}-${colIndex}`} />)
    )
  }

  return (
    <div className="App">
      <div className="Header">
        <NumberDisplay value={0} />
        <div className="Face">😃</div>
        <NumberDisplay value={23} />
      </div>
      <div className="Board">{renderCells()}</div>
    </div>
  )
}

export default App
