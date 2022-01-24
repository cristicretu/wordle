'use strict'

let grid = document.getElementById('grid')

function createGrid() {
  for (let i = 0; i < 6; ++i) {
    let line = document.createElement('div')

    for (let j = 0; j < 5; ++j) {
      let col = document.createElement('div')
      col.className = 'col'

      line.appendChild(col)
    }

    grid.appendChild(line)
  }
}

let count = 1

function changeGrid() {
  for (let i = 0; i < 6; ++i) {
    let line = grid.children[i]
    for (let j = 0; j < 5; ++j) {
      let col = line.children
      col[j].innerHTML = count++
    }
  }
}

document.addEventListener('click', changeGrid)

createGrid()
