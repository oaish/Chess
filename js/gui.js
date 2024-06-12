const handlePieceClick = (pce) => {
    if (Board.current) {
        Board.parentDiv.append(Board.current)
        Board.current.id = SquareBRD[parseInt(Board.parentDiv.id.slice(1))] + '_' + Board.parentDiv.id.slice(1)
        Board.parentDiv = Board.current = null
    }
    const div = pce.parentNode
    div.removeChild(pce)
    Board.parentDiv = div
    Board.current = pce;
    console.log(pce.id)
    calculateMoves(pce.id)
    const float = $('.float')
    float.append(pce)
    float.css('display', 'block')
}

const handleMouseMove = (e) => {
    const float = $('.float')
    float.css('translate', `${e.clientX - 30}px ${e.clientY - 30}px`)
}

const handleMouseOut = () => {
    if (!Board.current) return
    $('.float').innerHTML = ''
    Board.parentDiv.append(Board.current)
    Board.current.id = Board.parentDiv.id
    Board.parentDiv = Board.current = null
}

const handleSquareClick = (div) => {
    if (Board.current) {
        handlePieceRelease(div)
    }
}

const handlePieceRelease = (div) => {
    if (div.classList.contains('active')) {
        div.append(Board.current)
        Board.current.id = SquareBRD[parseInt(div.id.slice(1))] + '_' + div.id.slice(1)
    } else {
        Board.parentDiv.append(Board.current)
        Board.current.id = SquareBRD[parseInt(Board.parentDiv.id.slice(1))] + '_' + Board.parentDiv.id.slice(1)
    }
    Board.current = Board.parentDiv = null
    const board = document.querySelectorAll('.board > div')
    board.forEach(sq => {
        sq.classList.remove('active')
    })
}

const calculateMoves = (id) => {
    // const move = id.split('_')[0]
    const sq = id.split('_')[1]
    const board = document.querySelectorAll('.board > div')

    switch (Board.pieces[sq]) {
        case P.wP:
        case P.bP:
            const pwnMoves = getPawnMoves(sq)
            console.log(pwnMoves)
            pwnMoves.forEach((pwn) => {
                board[SQ64(pwn)].classList.add('active')
            })
            break

        case P.wK:
        case P.bK:
            const kiMoves = getKingMoves(sq)
            kiMoves.forEach((ki) => {
                board[SQ64(ki)].classList.add('active')
            })
            break

        case P.wN:
        case P.bN:
            const knMoves = getKnightMoves(sq)
            knMoves.forEach((kn) => {
                board[SQ64(kn)].classList.add('active')
            })
            break

        default:
            console.error('No Moves Possible', Board.pieces[sq])
    }
}


