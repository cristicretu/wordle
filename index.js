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
      col[j].innerHTML = 'A'
    }
  }
}

const words = ['masaj', 'avion', 'vecin', 'casti']

function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)]
}

// let word = getRandomWord()
let word = 'knoll'

function findColor(parent, child, index, line) {
  if (parent[index] === child[index]) {
    return 'rgb(96, 138, 84)'
  }

  let char = child[index]
  for (let i = 0; i < parent.length; ++i) {
    if (
      parent[i] == char &&
      line.children[i].style.backgroundColor !== 'rgb(96, 138, 84)'
    ) {
      return 'rgb(177, 160, 76)'
    }
  }

  if (char !== undefined) return 'rgb(58,58,60)'
}

function renderPastAttempt(row, attempt) {
  let line = grid.children[row]
  for (let i = 0; i < 5; ++i) {
    let col = line.children[i]
    col.style.backgroundColor = findColor(word, attempt, i, line)
    col.style.border =
      attempt[i] !== undefined
        ? `2.5px solid ${col.style.backgroundColor}`
        : '2.5px solid rgb(58,58,60)'
    col.innerHTML = attempt[i] ?? '<div style="opacity: 0">X<div>'
  }
}

function renderCurrentAttempt(row, attempt) {
  let line = grid.children[row]
  for (let i = 0; i < 5; ++i) {
    let col = line.children[i]
    col.innerHTML = attempt[i] ?? '<div style="opacity: 0">X<div>'
  }
}

createGrid()

let attempt = 0
let currentAttempt = ''

function logKey(e) {
  let char = e.key
  console.log(char.match(/[a-zA-Z]/g))
  if (char === 'Backspace') {
    currentAttempt = currentAttempt.slice(0, -1)
    renderCurrentAttempt(attempt, currentAttempt)
  } else if (char === 'Enter') {
    renderPastAttempt(attempt, currentAttempt)
    attempt += 1
    currentAttempt = ''
  } else if (
    char.match(/[a-zA-Z]/) &&
    currentAttempt.length < 5 &&
    char.length === 1
  ) {
    currentAttempt += char
    renderCurrentAttempt(attempt, currentAttempt)
  }
}

document.addEventListener('keydown', logKey)
