document.addEventListener("DOMContentLoaded",()=>{
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-btn')
    const Width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
        'url(images/red.png)',
        'url(images/orange.png)',
        'url(images/yellow.png)',
        'url(images/green.png)',
        'url(images/blue.png)',
        'url(images/purple.png)',
        'url(images/gray.png)'
    ]

    //Tetrominoes
    const jTetromino = [
        [1, Width + 1, Width*2 + 1, 2],
        [Width, Width + 1, Width + 2, Width*2 + 2],
        [1, Width + 1, Width*2 + 1, Width*2],
        [Width, Width*2, Width*2 + 1, Width*2 + 2]
    ]
    const lTetromino = [
        [0, 1, Width + 1, Width*2 + 1],
        [Width, Width + 1, Width + 2, Width*2],
        [1, Width + 1, Width*2 + 1, Width*2 + 2],
        [Width*2, Width*2 + 1, Width*2 + 2, Width + 2]
    ]
    const sTetromino = [
        [0, Width,Width + 1,Width*2 + 1],
        [Width + 1, Width + 2, Width * 2, Width *2 + 1 ],
        [0, Width,Width + 1,Width*2 + 1],
        [Width + 1, Width + 2, Width * 2, Width *2 + 1 ]
    ]
    const zTetromino = [
        [1, Width, Width + 1, Width*2],
        [Width, Width + 1, Width*2 + 1, Width*2 + 2],
        [1, Width, Width + 1, Width*2],
        [Width, Width + 1, Width*2 + 1, Width*2 + 2]
    ]
    const tTetromino = [
        [1, Width, Width + 1, Width + 2],
        [1, Width + 1, Width + 2, Width*2 + 1],
        [Width, Width + 1, Width + 2, Width*2 + 1],
        [1, Width, Width + 1, Width*2 + 1]
    
    ]
    const oTetromino = [
        [0, 1, Width, Width + 1],
        [0, 1, Width, Width + 1],
        [0, 1, Width, Width + 1],
        [0, 1, Width, Width + 1]
    ]
    const iTetromino = [
        [1, Width + 1, Width*2 + 1, Width*3 + 1],
        [Width, Width + 1, Width + 2, Width + 3],
        [1, Width + 1, Width*2 + 1, Width*3 + 1],
        [Width, Width + 1, Width + 2, Width + 3]
    ]

    const theTetrominoes = [jTetromino,lTetromino,sTetromino,zTetromino,tTetromino,oTetromino,iTetromino]

    let currentPosition = 4;
    let currentRotation = 0;

    //Randomly select a Tetromino and its first rotation
    let random = Math.floor(Math.random()*theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation];

    //Draw Tetromino

    function draw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundImage = colors[random]
        })
    }

    //Undraw Tetromino

    function undraw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundImage = 'none'
        })
    }


    //Moving the Tetrominoes down every second

    // timerId = setInterval(moveDown, 1000)

    //Assign function to keyCodes

    function control(e){
        if(e.keyCode === 37){
            moveLeft()
        } else if(e.keyCode === 38){
            rotate()
        } else if(e.keyCode === 39){
            moveRight()
        } else if(e.keyCode === 40){
            moveDown()
        }
    }
    document.addEventListener('keydown',control)
    

    //Move down function

    function moveDown(){
        undraw()
        currentPosition += Width
        draw()
        freeze()
    }

    function freeze(){
        if(current.some(index => squares[currentPosition + index + Width].classList.contains('taken')) ){
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))

            //Start a new Tetromino falling
            random = nextRandom
            nextRandom= Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            //speedUp()
            gameOver()
        }
    }

    //Move the Tetromino to the left unless there is a blockage 

    function moveLeft(){
        undraw()
        const LeftEdge = current.some(index => (currentPosition + index) % Width === 0)

        if(!LeftEdge) {currentPosition -=1}

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition +=1
        }

        draw()
    }

    //Move the Tetromino to the right unless there is a blockage 

    function moveRight(){
        undraw()
        const RightEdge = current.some(index => (currentPosition + index) % Width === Width - 1)

        if(!RightEdge) {currentPosition +=1}

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition -=1
        }

        draw()
    }

    //Rotate the Tetromino
 
    function rotate(){
        undraw()
        currentRotation ++
        if(currentRotation === current.length){  //if current rotation gets to 4, we go back to 0
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        draw()
    }

    //Show up next Tetromino in Mini-Grid

    const displaySquares = document.querySelectorAll(".mini-grid div")
    const displayWidth = 4
    let displayIndex = 0

    //Tetrominoes without rotation

    let upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth*2 + 1, 2], //J Tetromino
        [0, 1, displayWidth + 1, displayWidth*2 + 1], //L Tetromino 
        [0, displayWidth, displayWidth + 1, displayWidth*2 + 1], //S Tetromino
        [1, displayWidth, displayWidth + 1, displayWidth*2], //Z Tetromino
        [1, displayWidth, displayWidth +1, displayWidth + 2], //T Tetromino
        [0, 1, displayWidth, displayWidth + 1], //O Tetromino
        [1, displayWidth + 1, displayWidth*2 + 1, displayWidth*3 + 1] //I Tetromino
    ]

    //Display the shape in the Mini-Grid

    function displayShape(){
      //Remove traces of a Tetromino from the entire grid  
      displaySquares.forEach(square => {
          square.classList.remove('tetromino')
          square.style.backgroundImage = 'none'
      }) 

      upNextTetrominoes[nextRandom].forEach(index => {
          displaySquares[displayIndex + index].classList.add('tetromino')
          displaySquares[displayIndex + index].style.backgroundImage = colors[nextRandom]
      })
    }

    //Customize the button

    startBtn.addEventListener('click',()=>{
        if(timerId){
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown,1000)
            displayShape()
        }
    })


    //Add score

    function addScore(){
        for(let i = 0; i < 199; i+=Width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
            
            if(row.every(index => squares[index].classList.contains('taken'))){
                score +=100
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundImage = 'none'
                    })
                const squaresRemoved = squares.splice(i,Width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
                }
            }
        }


    //Speed-up

    /*
    function speedUp(){
        if(score >= 1000){
            timerId = setInterval(moveDown,950)
        }
    }
    */   

    //Game over
    
    function gameOver(){
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = " END"
            clearInterval(timerId)
            upNextTetrominoes = ""           
            }
    }

    











})

