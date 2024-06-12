const printPieceList = () => {
    for (let piece = P.wP; piece <= P.bK; piece++) {
        for (let pceNum = 0; pceNum < Board.pceNum[piece]; pceNum++) {
            console.log(PIECE_NAMES[piece], 'on', SquareBRD[Board.pList[PIECE_INDEX(piece, pceNum)]])
        }
    }
}

const printBoard = (arr) => {
    let str = ''
    let sq = -1

    for (let r = R._1; r < R.NONE; r++) {
        str = ''
        for (let f = F._A; f < F.NONE; f++) {
            sq = arr.length === 64 ? sq + 1 : FR2SQ(f, r)
            str += arr[sq] + '\t'
        }
        console.log(str)
    }
}

const printBoardTable = (arr) => {
    let str = '<table>'
    let sq = -1

    for (let r = R._1; r < R.NONE; r++) {
        str += '<tr>'
        for (let f = F._A; f < F.NONE; f++) {
            sq = arr.length === 64 ? sq + 1 : FR2SQ(f, r)
            str += '<td style="">'
            str += (arr[sq] !== 0 ? arr[sq] : '-')
            str += '</td>'
        }
        str += '</tr>'
    }
    str += '</table>'
    const float = document.querySelector('.print-table');
    float.style.display = 'flex';
    float.innerHTML += str;
}

const printBoardTable120 = (arr) => {
    let str = '<table>'
    let sq = -1

    for (let r = 0; r < 12; r++) {
        str += '<tr>'
        for (let f = 0; f < 10; f++) {
            sq += 1
            str += '<td style="">'
            str += (arr[sq] !== 0 ? arr[sq] : '-')
            str += '</td>'
        }
        str += '</tr>'
    }
    str += '</table>'
    const float = document.querySelector('.print-table');
    float.style.display = 'flex';
    float.innerHTML += str;
}

const printBoardToUI = (arr) => {
    let sq = -1;
    let i = 0;
    let files = 'abcdefgh';
    let ranks = '87654321';
    let squares = $('.board').children()

    for (let r = R._1; r < R.NONE; r++) {
        for (let f = F._A; f < F.NONE; f++) {
            sq = arr.length === 64 ? sq + 1 : FR2SQ(f, r)
            let div = ''
            if (f === F._A)
                div += `<div class="rank">${ranks[r]}</div>`

            if (r === R._8)
                div += `<div class="file">${files[f]}</div>`

            if (arr[sq] !== 0)
                div += `<img id="${SquareBRD[sq]}_${sq}" style='width:58px; height: 58px' 
                        class="${PieceCol[arr[sq]] === CLR.W? 'whitePce': 'blackPce'}"
                        onmousedown="handlePieceClick(this)" 
                        onmouseup="handleMouseOut(this)"
                        draggable="false"
                        src="${getChessPieceIcon(arr[sq])}" 
                        alt="${getChessPieceForFEN(arr[sq])}" />`

            squares.toggleClass('piece')
            squares[i++].innerHTML = div
        }
    }
}

const getChessPieceIcon = (pce) => {
    switch (pce) {
        case P.wP:
            return 'https://assets-themes.chess.com/image/ejgfv/150/wp.png'
        case P.bP:
            return 'https://assets-themes.chess.com/image/ejgfv/150/bp.png'
        case P.wN:
            return 'https://assets-themes.chess.com/image/ejgfv/150/wn.png'
        case P.bN:
            return 'https://assets-themes.chess.com/image/ejgfv/150/bn.png'
        case P.wB:
            return 'https://assets-themes.chess.com/image/ejgfv/150/wb.png'
        case P.bB:
            return 'https://assets-themes.chess.com/image/ejgfv/150/bb.png'
        case P.wR:
            return 'https://assets-themes.chess.com/image/ejgfv/150/wr.png'
        case P.bR:
            return 'https://assets-themes.chess.com/image/ejgfv/150/br.png'
        case P.wQ:
            return 'https://assets-themes.chess.com/image/ejgfv/150/wq.png'
        case P.bQ:
            return 'https://assets-themes.chess.com/image/ejgfv/150/bq.png'
        case P.wK:
            return 'https://assets-themes.chess.com/image/ejgfv/150/wk.png'
        case P.bK:
            return 'https://assets-themes.chess.com/image/ejgfv/150/bk.png'
        default:
            return ''
    }
}

const getChessPieceForFEN = (pce) => {
    switch (pce) {
        case P.wP:
            return 'p'
        case P.bP:
            return 'P'
        case P.wN:
            return 'n'
        case P.bN:
            return 'N'
        case P.wB:
            return 'b'
        case P.bB:
            return 'B'
        case P.wR:
            return 'r'
        case P.bR:
            return 'R'
        case P.wQ:
            return 'q'
        case P.bQ:
            return 'Q'
        case P.wK:
            return 'k'
        case P.bK:
            return 'K'
        default:
            return ''
    }
}