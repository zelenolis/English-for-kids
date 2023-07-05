import cards from './cards.js'
import { creatingLocalStorage, clearLocalStorage, setTrain, setCorrect, setWrong, sortByName, sortByTranslation, sortByTrainClicks, sortByPlayclicks, sortByErrors, sortByPercent, wordArrays, checkHardWords, hardwords } from './statistic.js'

// creating local storage from import:
creatingLocalStorage()

// "Train - Play" Toggler (hidden on home page)

// global const for train-play toggler status
let active = false

const switchOpen = document.getElementById('switch-open')
switchOpen.addEventListener('click', switchPlay)

function switchPlay () {
  const toggle = document.querySelector('.switch-play')
  const text = document.querySelector('.switch-text')
  const switchButton = document.querySelector('.switch')

  if (switchButton.classList.contains('opacity')) { return }

  active = !active

  if (active) {
    toggle.classList.add('switch-active')
    text.innerHTML = 'PLAY'
    creatingPlayPage()
  } else {
    toggle.classList.remove('switch-active')
    text.innerHTML = 'TRAIN'
    creatingPlayPage()
  }
}

// Open-close aside menu toggler
const menuOpen = document.getElementById('toggle')
menuOpen.addEventListener('click', menuToggle)

function menuToggle () {
  const nav = document.getElementById('nav')
  const toggle = document.getElementById('toggle')
  const spans = document.querySelectorAll('.menuicon span')
  nav.classList.toggle('active')
  toggle.classList.toggle('active')
  spans[0].classList.toggle('spanRotate1')
  spans[1].classList.toggle('spanRotate2')
  spans[2].classList.toggle('spanRotate3')
}

// MAIN NAVIGATION BLOCK (Navigations, creating starting and training pages)

// Global consts for navigations and pages creating:

const playbox = document.querySelector('.playbox')
const mainbox = document.querySelector('.mainbox')
const cardButtons = document.querySelectorAll('.mainbox figure')
const nav = document.querySelectorAll('.nav li')
let setName = ''
let setNumber = 0
let gameArray = []
let victory = true

// Redirecting from menu

for (let i = 0; i < nav.length; i++) {
  nav[i].addEventListener('click', linkFromMenu)
}

function linkFromMenu () {
  setName = this.children[0].textContent
  if (setName === 'Home') {
    creatingStartPage()
    menuToggle()
    return
  }
  if (setName === 'Statistic') {
    creatingStatisticPage()
    menuToggle()
    return
  }
  removeOldCards()
  creatingTrainPage()
  menuToggle()
}

// Redirecting from startpage's cards

for (let i = 0; i < cardButtons.length; i++) {
  cardButtons[i].addEventListener('click', linkFromStartpage)
}

function linkFromStartpage () {
  setName = this.children[1].textContent
  creatingTrainPage()
}

// Creating Train-and-game Page

function creatingTrainPage () {
  mainbox.classList.add('visibility')
  playbox.classList.remove('visibility')

  const tableDiv = document.querySelector('.table-section')
  if (tableDiv) { tableDiv.remove() }

  for (let i = 0; i < cards[0].length; i++) {
    if (setName === cards[0][i]) { setNumber = i + 1 }
  }

  for (let i = 0; i < nav.length; i++) {
    nav[i].classList.remove('menu-active')
  }
  nav[setNumber].classList.add('menu-active')

  const playboxMain = document.createDocumentFragment()

  for (let i = 0; i < 8; i++) {
    const firstDiv = document.createElement('div')
    const secondDiv = document.createElement('div')
    const thirdDiv = document.createElement('div')
    const firstImg = document.createElement('img')
    const secondImg = document.createElement('img')
    const firstTxt = document.createElement('p')
    const secondTxt = document.createElement('p')
    const flip = document.createElement('img')

    firstImg.src = '../../assets/image/' + cards[setNumber][i].image
    secondImg.src = '../../assets/image/' + cards[setNumber][i].image
    firstTxt.textContent = cards[setNumber][i].word
    secondTxt.textContent = cards[setNumber][i].translation
    flip.src = '../../assets/image/rotate.svg'

    firstDiv.classList.add('playbox-card-wrapper')
    secondDiv.classList.add('playbox-front-card')
    thirdDiv.classList.add('playbox-back-card')
    firstImg.classList.add('playbox-img')
    secondImg.classList.add('playbox-img')
    firstTxt.classList.add('playbox-txt')
    secondTxt.classList.add('playbox-txt')
    flip.classList.add('flip')

    firstDiv.appendChild(secondDiv)
    firstDiv.appendChild(thirdDiv)
    secondDiv.appendChild(firstImg)
    secondDiv.appendChild(firstTxt)
    secondDiv.appendChild(flip)
    thirdDiv.appendChild(secondImg)
    thirdDiv.appendChild(secondTxt)

    playboxMain.appendChild(firstDiv)
  }

  playbox.appendChild(playboxMain)

  const switchButton = document.querySelector('.switch-play')
  if (switchButton.classList.contains('opacity')) { switchButtonToggle() }
  if (switchButton.classList.contains('switch-active')) { switchPlay() }

  playAudio()
  flipCard()
}

// Removing old block with train-and-game cards

function removeOldCards () {
  playbox.innerHTML = ''
}

// Switch "Train - Play" Button toggler

function switchButtonToggle () {
  const switchButton = document.querySelector('.switch')
  const switchFunction = document.querySelector('.switch-play')

  switchButton.classList.toggle('opacity')
  switchFunction.classList.toggle('opacity')
}

// Redirecting to start page

function creatingStartPage () {
  playbox.innerHTML = ''
  mainbox.classList.remove('visibility')

  const tableDiv = document.querySelector('.table-section')
  if (tableDiv) { tableDiv.remove() }

  for (let i = 0; i < nav.length; i++) {
    nav[i].classList.remove('menu-active')
  }
  nav[0].classList.add('menu-active')

  const starsBoxCheck = document.querySelector('.stars-box')
  if (starsBoxCheck) { starsBoxCheck.remove() }

  const finalMessage = document.querySelector('.final-message')
  if (finalMessage) { finalMessage.remove() }

  const audioRepeat = document.querySelector('.repeat')
  if (audioRepeat) { audioRepeat.remove() }

  const switchButton = document.querySelector('.switch-play')
  if (switchButton.classList.contains('switch-active')) { switchPlay() }
  switchButtonToggle()
}

// Voice actions

function playAudio () {
  const audio = document.querySelectorAll('.playbox-front-card')
  for (let i = 0; i < audio.length; i++) {
    audio[i].addEventListener('click', () => {
      const audioElement = new Audio('../../assets/' + cards[setNumber][i].audioSrc)
      audioElement.play()
      setTrain(setNumber, i)
    })
  }
}

function removeAudio () {
  const old = document.querySelectorAll('.playbox-front-card')
  for (let i = 0; i < old.length; i++) {
    const clone = old[i].cloneNode(true)
    old[i].parentNode.replaceChild(clone, old[i])
  }
}

// Cards flip

function flipCard () {
  const flip = document.querySelectorAll('.flip')
  const frontflip = document.querySelectorAll('.playbox-front-card')
  const backflip = document.querySelectorAll('.playbox-back-card')
  for (let i = 0; i < flip.length; i++) {
    flip[i].addEventListener('click', () => {
      console.log(i)
      console.log(frontflip[i])
      frontflip[i].classList.add('frontflip')
      backflip[i].classList.add('backflip')
      backflip[i].addEventListener('mouseleave', () => {
        frontflip[i].classList.remove('frontflip')
        backflip[i].classList.remove('backflip')
      })
    })
  }
}

// Creating Playing Page, adding new card's style

function creatingPlayPage () {
  const playingCard = document.querySelectorAll('.playbox-front-card')

  for (let i = 0; i < playingCard.length; i++) {
    playingCard[i].classList.toggle('playbox-front-card-play')
    playingCard[i].children[0].classList.toggle('playbox-img-play')
    playingCard[i].children[1].classList.toggle('visibility')
    playingCard[i].children[2].classList.toggle('visibility')
  }

  startButton()
}

// Creating start-button

function startButton () {
  const startbutton = document.querySelector('.go-button')
  if (startbutton) {
    startbutton.remove()
    const starsBoxCheck = document.querySelector('.stars-box')
    if (starsBoxCheck) { starsBoxCheck.remove() }
    playAudio()
  } else {
    const starsBox = document.createElement('div')
    starsBox.classList.add('stars-box')
    playbox.parentNode.appendChild(starsBox)

    const goButton = document.createElement('button')
    goButton.classList.add('go-button')
    goButton.textContent = 'GO!'
    playbox.parentNode.appendChild(goButton)

    pressStart()
    removeAudio()
  }
}

function pressStart () {
  const startbutton = document.querySelector('.go-button')
  startbutton.addEventListener('click', () => {
    const audioElement = new Audio('../../assets/audio/game-start.mp3')
    audioElement.play()
    startbutton.classList.add('visibility')
    setTimeout(startGame, 2000)
  })

  const starsBox = document.querySelector('.stars-box')
  starsBox.style.setProperty('padding-left', Math.floor(getCssProperty()) + 'px')
}

// Game, adding "wrong"-class as a sign of unaswered cards

async function startGame () {
  victory = true
  gameArray = [0, 1, 2, 3, 4, 5, 6, 7]
  randomizeArray(gameArray)

  const gameButtons = document.querySelectorAll('.playbox-front-card')
  for (let k = 0; k < gameButtons.length; k++) {
    gameButtons[k].classList.add('wrong')
  }

  const repeat = document.createElement('img')
  repeat.src = '../../assets/image/repeat.png'
  repeat.classList.add('repeat')
  repeat.style.setProperty('margin-right', Math.floor(getCssProperty()) + 'px')
  playbox.parentNode.appendChild(repeat)

  await cardAudio(gameArray[0])
  oneTask()
}

// Fisher Yates Sort

function randomizeArray (arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const k = arr[i]
    arr[i] = arr[j]
    arr[j] = k
  }
  return arr
}

// playing audio from game-mode

function cardAudio (index) {
  const audioElement = new Audio('../../assets/' + cards[setNumber][index].audioSrc)
  audioElement.play()
  return new Promise(function (resolve) {
    audioElement.addEventListener('ended', resolve)
  })
}

// System sounds (correct, error, failure, success, game-start)

function systemSound (sound) {
  const audioElement = new Audio('../../assets/audio/' + sound + '.mp3')
  audioElement.play()
  return new Promise(function (resolve) {
    audioElement.addEventListener('ended', resolve)
  })
}

function oneTask () {
  const allButtons = document.querySelectorAll('.playbox-front-card')
  allButtons[gameArray[0]].classList.add('correct')

  const audioRepeat = document.querySelector('.repeat')
  audioRepeat.addEventListener('click', () => {
    const audioElement = new Audio('../../assets/' + cards[setNumber][gameArray[0]].audioSrc)
    audioElement.play()
  })

  const lightButtons = document.querySelectorAll('.wrong')

  for (let i = 0; i < lightButtons.length; i++) {
    lightButtons[i].addEventListener('click', checkAnswer)
  }
}

async function checkAnswer () {
  const a = cards[setNumber][gameArray[0]].word
  const b = this.children[1].textContent
  if (a === b) {
    setCorrect(setNumber, gameArray[0])
    addstars('star-win')
    this.classList.remove('wrong')
    this.classList.add('correctCard')
    this.removeEventListener('click', checkAnswer)
    await systemSound('correct')
    await ifWin()
  } else {
    setWrong(setNumber, gameArray[0])
    victory = false
    addstars('star')
    await systemSound('error')
  }
}

async function ifWin () {
  gameArray.shift()
  if (gameArray.length === 0) {
    await youWin()
  } else {
    await cardAudio(gameArray[0])
    const allButtons = document.querySelectorAll('.playbox-front-card')
    allButtons[gameArray[0]].classList.add('correct')
  }
}

function addstars (index) {
  const starsBox = document.querySelector('.stars-box')
  const star = document.createElement('img')
  star.src = '../../assets/image/' + index + '.svg'
  starsBox.appendChild(star)
}

async function youWin () {
  playbox.innerHTML = ''
  document.querySelector('.stars-box').innerHTML = ''
  const audioRepeat = document.querySelector('.repeat')
  audioRepeat.remove()

  if (victory) {
    endGame('success', 'PERFECT!')
    await systemSound('success')
  } else {
    endGame('failure', 'you can do better')
    await systemSound('failure')
  }
  creatingStartPage()
}

function endGame (index, message) {
  const win = document.createElement('img')
  win.src = '../../assets/image/' + index + '.png'
  win.style.setProperty('margin', 'auto')
  playbox.appendChild(win)
  const txt = document.createElement('h2')
  txt.textContent = message
  txt.classList.add('final-message')
  playbox.parentNode.appendChild(txt)
}

// function for calculate padding for stars-box in game

function getCssProperty () {
  const elem = document.querySelector('.playbox-img')
  const rect = elem.getBoundingClientRect()
  return rect.left
}

// --------------------- CREATING STATISTIC PAGE ---------------------

function creatingStatisticPage () {
  creatingStartPage()
  const switchButton = document.querySelector('.switch-play')
  if (!switchButton.classList.contains('opacity')) { switchButtonToggle() }
  if (switchButton.classList.contains('switch-active')) { switchPlay() }
  mainbox.classList.add('visibility')

  for (let i = 0; i < nav.length; i++) {
    nav[i].classList.remove('menu-active')
  }
  nav[9].classList.add('menu-active')

  const wordArray = wordArrays()

  const statisticPage = document.createDocumentFragment()
  const tableHeader = document.createElement('h3')
  const legendDiv = document.createElement('div')
  const clearWrapper = document.createElement('div')
  const hardWrapper = document.createElement('div')
  const hardButton = document.createElement('p')
  const clearStatistic = document.createElement('p')
  const table = document.createElement('table')
  clearWrapper.classList.add('clear-wrapper')
  clearStatistic.classList.add('clear-statistic')
  hardWrapper.classList.add('clear-wrapper')

  if (!checkHardWords()) { hardWrapper.classList.add('visibility') }

  hardButton.classList.add('hard-button')
  hardButton.textContent = 'Train difficult'
  legendDiv.classList.add('table-section')
  tableHeader.classList.add('table-header')
  tableHeader.textContent = 'Statistic Page'
  clearStatistic.textContent = 'Clear Statistic'
  table.classList.add('table')
  hardWrapper.appendChild(hardButton)
  clearWrapper.appendChild(tableHeader)
  clearWrapper.appendChild(clearStatistic)
  legendDiv.appendChild(clearWrapper)
  legendDiv.appendChild(hardWrapper)
  legendDiv.appendChild(table)
  statisticPage.appendChild(legendDiv)
  mainbox.parentNode.appendChild(statisticPage)

  generateTable(wordArray)
}

// consts for forward and reverse sorts

let sortName = false
let sortTranslation = false
let sortTrain = false
let sortCorrect = false
let sortWrong = false
let sortPercent = false

// generating sorted table

function generateTable (wordArray) {
  const tab = document.querySelector('.table')
  tab.innerHTML = ''
  const keys = Object.keys(wordArray[0])

  generateTableBody(tab, wordArray)
  generateTableHeader(tab, keys)

  const statisticButtons = document.querySelectorAll('.table-sort')
  for (let i = 0; i < statisticButtons.length; i++) {
    statisticButtons[i].addEventListener('click', sortbuttons)
    statisticButtons[i].classList.add('table-active')
  }
  const clearStatistic = document.querySelector('.clear-statistic')
  clearStatistic.addEventListener('click', clearStats)
  const trainHard = document.querySelector('.hard-button')
  trainHard.addEventListener('click', trainHardWords)
}

function clearStats () {
  clearLocalStorage()
  const wordArray = wordArrays()
  generateTable(wordArray)
}

function generateTableHeader (tab, keys) {
  const thead = tab.createTHead()
  const row = thead.insertRow()
  for (const key of keys) {
    const th = document.createElement('th')
    const text = document.createTextNode(key)
    th.appendChild(text)
    th.classList.add('table-sort')
    row.appendChild(th)
  }
}

function generateTableBody (tab, wordArray) {
  for (const element of wordArray) {
    const row = tab.insertRow()
    for (const key in element) {
      const cell = row.insertCell()
      if (key === 'word') { cell.classList.add('word') }
      if (key === 'translation') { cell.classList.add('translation') }
      if (key === 'clicks in train mode') { cell.classList.add('train') }
      if (key === 'correct answers') { cell.classList.add('correct') }
      if (key === 'wrong answers') { cell.classList.add('wrong') }
      if (key === '% of correct answers') { cell.classList.add('percent') }
      const text = document.createTextNode(element[key])
      cell.appendChild(text)
    }
  }
}

// buttons for different sorting

function sortbuttons () {
  if (this.textContent === 'word') {
    const wordArray = sortByName(sortName)
    generateTable(wordArray)
    sortName = !sortName
    sortTranslation = false
    sortTrain = false
    sortCorrect = false
    sortWrong = false
    sortPercent = false
    tableColoring('.word')
  }
  if (this.textContent === 'translation') {
    const wordArray = sortByTranslation(sortTranslation)
    generateTable(wordArray)
    sortTranslation = !sortTranslation
    sortName = false
    sortTrain = false
    sortCorrect = false
    sortWrong = false
    sortPercent = false
    tableColoring('.translation')
  }
  if (this.textContent === 'clicks in train mode') {
    const wordArray = sortByTrainClicks(sortTrain)
    generateTable(wordArray)
    sortTrain = !sortTrain
    sortName = false
    sortTranslation = false
    sortCorrect = false
    sortWrong = false
    sortPercent = false
    tableColoring('.train')
  }
  if (this.textContent === 'correct answers') {
    const wordArray = sortByPlayclicks(sortCorrect)
    generateTable(wordArray)
    sortCorrect = !sortCorrect
    sortName = false
    sortTranslation = false
    sortTrain = false
    sortWrong = false
    sortPercent = false
    tableColoring('.correct')
  }
  if (this.textContent === 'wrong answers') {
    const wordArray = sortByErrors(sortWrong)
    generateTable(wordArray)
    sortWrong = !sortWrong
    sortName = false
    sortTranslation = false
    sortTrain = false
    sortCorrect = false
    sortPercent = false
    tableColoring('.wrong')
  }
  if (this.textContent === '% of correct answers') {
    const wordArray = sortByPercent(sortPercent)
    generateTable(wordArray)
    sortPercent = !sortPercent
    sortName = false
    sortTranslation = false
    sortTrain = false
    sortCorrect = false
    sortWrong = false
    tableColoring('.percent')
  }
}

// Coloring sorted column
function tableColoring (type) {
  const coloredHead = document.querySelectorAll('.table-active')
  coloredHead.forEach((item) => item.classList.remove('colored-cell'))

  const coloredCell = document.querySelectorAll('.colored-cell')
  coloredCell.forEach((item) => item.classList.remove('colored-cell'))

  const selectedColumn = document.querySelectorAll(type)
  selectedColumn.forEach((item) => item.classList.add('colored-cell'))

  if (type === '.word') { coloredHead[0].classList.add('colored-cell') }
  if (type === '.translation') { coloredHead[1].classList.add('colored-cell') }
  if (type === '.train') { coloredHead[2].classList.add('colored-cell') }
  if (type === '.correct') { coloredHead[3].classList.add('colored-cell') }
  if (type === '.wrong') { coloredHead[4].classList.add('colored-cell') }
  if (type === '.percent') { coloredHead[5].classList.add('colored-cell') }
}

// --------------------- TRAIN HARD PAGE ---------------------

function trainHardWords () {
  // HardWords generates from statistic page using wrong-answer sort (and using all over the train page)
  const hardWords = hardwords()

  // Clear old pages, an hiding all switches
  creatingStartPage()
  nav[0].classList.remove('menu-active')
  mainbox.classList.add('visibility')
  playbox.classList.remove('visibility')
  const switchButton = document.querySelector('.switch-play')
  if (!switchButton.classList.contains('opacity')) { switchButtonToggle() }

  // creating new page using "hardWords" array
  const playboxMain = document.createDocumentFragment()

  for (let i = 0; i < hardWords.length; i++) {
    const firstDiv = document.createElement('div')
    const secondDiv = document.createElement('div')
    const thirdDiv = document.createElement('div')
    const firstImg = document.createElement('img')
    const secondImg = document.createElement('img')
    const firstTxt = document.createElement('p')
    const secondTxt = document.createElement('p')
    const flip = document.createElement('img')

    firstImg.src = '../../assets/image/' + hardWords[i].image
    secondImg.src = '../../assets/image/' + hardWords[i].image
    firstTxt.textContent = hardWords[i].word
    secondTxt.textContent = hardWords[i].translation
    flip.src = '../../assets/image/rotate.svg'

    firstDiv.classList.add('playbox-card-wrapper')
    secondDiv.classList.add('playbox-front-card')
    thirdDiv.classList.add('playbox-back-card')
    firstImg.classList.add('playbox-img')
    secondImg.classList.add('playbox-img')
    firstTxt.classList.add('playbox-txt')
    secondTxt.classList.add('playbox-txt')
    flip.classList.add('flip')

    firstDiv.appendChild(secondDiv)
    firstDiv.appendChild(thirdDiv)
    secondDiv.appendChild(firstImg)
    secondDiv.appendChild(firstTxt)
    secondDiv.appendChild(flip)
    thirdDiv.appendChild(secondImg)
    thirdDiv.appendChild(secondTxt)

    playboxMain.appendChild(firstDiv)
  }

  playbox.appendChild(playboxMain)

  playTrainAudio(hardWords)
  flipCard()
}

// Audio for hardWords

function playTrainAudio (hardWords) {
  const audio = document.querySelectorAll('.playbox-front-card')
  for (let i = 0; i < audio.length; i++) {
    audio[i].addEventListener('click', () => {
      const audioElement = new Audio('../../assets/' + hardWords[i].audioSrc)
      audioElement.play()
    })
  }
}
