const getSqFromId = (str) => {
    if (str.startsWith('_'))
        return parseInt(str.slice(1))
    else
        return parseInt(str.split('_')[1])
}

const handlePieceClick = (pce) => {
    if (Board.current) {
        const oldPceClr = PieceCol[Board.pieces[getSqFromId(Board.current.id)]]
        const newPceClr = PieceCol[Board.pieces[getSqFromId(pce.id)]]
        if (oldPceClr === newPceClr) {
            Board.parentDiv.append(Board.current)
            Board.current.id = SquareBRD[getSqFromId(Board.parentDiv.id)] + '_' + getSqFromId(Board.parentDiv.id)
            console.log('Same Colors')
            Board.parentDiv = Board.current = null;
        } else {
            handlePieceRelease(pce.parentNode, pce)
            console.log('Different Colors')
        }
        return
    }
    const div = pce.parentNode
    div.removeChild(pce)
    Board.parentDiv = div
    Board.current = pce;
    calculateMoves(pce.id)
    const float = $('.float')
    float.append(pce)
    float.css('display', 'block')
}

const handleMouseMove = (e) => {
    $('.float').css('translate', `${e.clientX - 30}px ${e.clientY - 30}px`)
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

const handlePieceRelease = (div, pce = null) => {
    const {pieces} = Board

    if (div.classList.contains('active')) {
        const oldSq = getSqFromId(Board.current.id)
        const newSq = getSqFromId(div.id)

        console.log(oldSq, newSq, pce)

        if (pce !== null) {
            div.removeChild(pce)
        }
        div.append(Board.current)
        Board.current.id = SquareBRD[newSq] + '_' + newSq

        pieces[newSq] = pieces[oldSq]
        pieces[oldSq] = 0
    } else {
        Board.parentDiv.append(Board.current)
        Board.current.id = SquareBRD[getSqFromId(Board.parentDiv.id)] + '_' + Board.parentDiv.id.slice(1)
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
            pwnMoves.forEach((pwn) => {
                board[SQ64(pwn)].classList.add('active')
            })
            break

        case P.wK:
        case P.bK:
            const kiMoves = getKingMoves(sq)
            console.log(kiMoves)
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

        case P.wB:
        case P.bB:
            const biMoves = getBishopMoves(sq)
            biMoves.forEach((bi) => {
                board[SQ64(bi)].classList.add('active')
            })
            break

        case P.wR:
        case P.bR:
            const rkMoves = getRookMoves(sq)
            rkMoves.forEach((rk) => {
                board[SQ64(rk)].classList.add('active')
            })
            break

        case P.wQ:
        case P.bQ:
            const qnMoves = [...getRookMoves(sq), ...getBishopMoves(sq)]
            qnMoves.forEach((qn) => {
                board[SQ64(qn)].classList.add('active')
            })
            break

        default:
            console.error('No Moves Possible', Board.pieces[sq])
    }
}


