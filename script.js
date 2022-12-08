'use strict'

const gridContainer = document.querySelector('.grid-container')
const rowCount = 12;
const colCount = 12;
const secondsEachGrid = 24 * 60 * 60 / rowCount / colCount;
const gridsEachHourCount = rowCount * colCount / 24;

function createGridItems() {
  const newGridItem = document.createElement('div')
  newGridItem.className = 'grid-item'
  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < colCount; col++) {
      gridContainer.append(newGridItem.cloneNode())
    }
  }
}

function renderGridItems() {
  let secondsTillNow = Math.floor((Date.now() - new Date().setHours(0, 0, 0, 0)) / 1000)
  const gridItems = document.querySelectorAll('.grid-container .grid-item')
  gridItems.forEach(item => {
    if (secondsTillNow >= secondsEachGrid) {
      item.removeAttribute('style')
      item.classList.add('grid-time-passed')
    } else if (secondsTillNow <= 0) {
      item.removeAttribute('style')
      item.classList.remove('grid-time-passed')
    } else {
      // item.classList.add('grid-time-passed')
      const passedPercentage = Math.round(10000 * secondsTillNow / secondsEachGrid) / 100;
      item.style.background = `linear-gradient(to right, var(--green) ${passedPercentage}%, transparent 0%)`
      item.style.borderColor = 'var(--gold)'
    }
    secondsTillNow -= secondsEachGrid
  })
}

function enableFullScreenMode() {
  const search = new URLSearchParams(document.location.search)
  const textContainer = document.querySelector('.text-container')
  const returnContainer = document.querySelector('.return-container')
  console.log(search)
  if (search.get('full_screen') === 'true') {
    textContainer.hidden = true
    returnContainer.hidden = false
  } else {
    textContainer.hidden = false
    returnContainer.hidden = true
  }
}

function addListenerForListItems() {
  const gridItemsArray = Array.from(document.querySelectorAll('.grid-container .grid-item'))
  const listItems = document.querySelectorAll('li.js-hover')
  listItems.forEach( element => {
    element.addEventListener('mouseover', () => {
      let gridsRenderedCount = Math.floor(parseFloat(element.dataset.hours) * gridsEachHourCount)
      for (let index = 0; gridsRenderedCount > 0; gridsRenderedCount--) {
        gridItemsArray[index].classList.add('grid-time-example')
        index++
      }
    })
    element.addEventListener('mouseleave', () => {
      gridItemsArray.forEach( element => {
        element.classList.remove('grid-time-example')
      })
    })
  })
}

document.addEventListener('DOMContentLoaded', () => {
  enableFullScreenMode()
  createGridItems()
  addListenerForListItems()

  renderGridItems()
  setInterval(renderGridItems, 500)
})
