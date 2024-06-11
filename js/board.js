let Board = {
    pieces: Array(BRD_SQ_NUM).fill(SQ.OFF_BOARD),
    totalMoves: 0,
    castePerm: 0,
    fiftyMove: 0,
    side: CLR.W,
    moves: 0,
    enPas: 0,
    posKey: 0,
    moveListStart: Array(MAX_DEPTH),
    pceNum: Array(13).fill(0),
    material: Array(2).fill(0),
    pList: Array(14 * 10).fill(0),
    moveList: Array(MAX_DEPTH * MAX_POSITION_MOVES),
    moveScores: Array(MAX_DEPTH * MAX_POSITION_MOVES),
};

const generatePosKey = () => {
    let finalKey = 0;
    let piece = P.EMPTY;

    for (let sq = 0; sq < BRD_SQ_NUM; sq++) {
        piece = Board.pieces[sq];
        if (piece !== P.EMPTY && piece !== SQ.OFF_BOARD) {
            finalKey ^= PieceKeys[(piece * 120) + sq]
        }
    }

    if (Board.side === CLR.W) {
        finalKey ^= SideKey
    }

    if (Board.enPas !== SQ.NO_SQ) {
        finalKey ^= CastleKeys[Board.enPas]
    }

    finalKey ^= CastleKeys[Board.castePerm]

    return finalKey
}

const resetBoard = () => {
    Board = {
        ...Board,
        pieces: Array(BRD_SQ_NUM).fill(SQ.OFF_BOARD),
        side: CLR.BOTH,
        fiftyMove: 0,
        totalMoves: 0,
        moves: 0,
        enPas: SQ.NO_SQ,
        posKey: 0,
        castePerm: 0,
    }

    Board.moveListStart[Board.moves] = 0;
    for (let i = 0; i < 64; i++) {
        Board.pieces[SQ120(i)] = P.EMPTY
    }
}

const printPieceList = () => {
    for (let piece = P.wP; piece <= P.bK; piece++) {
        for (let pceNum = 0; pceNum < Board.pceNum[piece]; pceNum++) {
            console.log(PIECE_NAMES[piece], 'on', SquareBRD[Board.pList[PIECE_INDEX(piece, pceNum)]])
        }
    }
}

const updateListsMaterial = () => {
    let piece, sq, color;

    Board = {
        ...Board,
        pceNum: Array(13).fill(0),
        material: Array(2).fill(0),
        pList: Array(14 * 10).fill(P.EMPTY),
    }

    for (let i = 0; i < 64; i++) {
        sq = SQ120(i);
        piece = Board.pieces[sq];
        if (piece !== P.EMPTY) {
            color = PieceCol[piece];
            Board.material[color] += PieceVal[piece];

            Board.pList[PIECE_INDEX(piece, Board.pceNum[piece])] = sq;
            Board.pceNum[piece]++;
        }
    }
}

const printBoardToUI = (arr) => {
    let sq = -1;
    let i = 0;
    let squares = $('.board').children()

    for (let r = R._1; r < R.NONE; r++) {
        for (let f = F._A; f < F.NONE; f++) {
            sq = arr.length === 64 ? sq + 1 : FR2SQ(f, r)
            squares[i++].innerHTML = arr[sq] !== 0 ? `<img style='width:50px; height: 50px' src="${getChessPiece(arr[sq])}" alt="" />` : ''
        }
    }
}

const getChessPiece = (pce) => {
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

const parseFEN = (fenStr) => {
    resetBoard()

    const parts = fenStr.split(' ')

    const fen = parts[0]
    const side = parts[1]
    const castlePerm = parts[2]
    const enPas = parts[3]

    let rank = R._8
    let file = F._A
    let fenCnt = 0
    let count = 0
    let piece = 0

    const isEmpty = (data) => {
        return data === undefined || data === '' || data?.length === 0
    }

    if (isEmpty(fen) || isEmpty(side) || isEmpty(castlePerm) || isEmpty(enPas) || fen.split('/').length < 8 || (enPas !== '-' && enPas.length !== 2)) {
        console.error('Fen String is Invalid')
        return
    }

    while (rank >= R._1 && fenCnt < fen.length) {
        count = 1;

        let ch = fen[fenCnt]
        switch (ch) {
            case 'p':
                piece = P.wP;
                break;
            case 'n':
                piece = P.wN;
                break;
            case 'b':
                piece = P.wB;
                break;
            case 'r':
                piece = P.wR;
                break;
            case 'q':
                piece = P.wQ;
                break;
            case 'k':
                piece = P.wK;
                break;

            case 'P':
                piece = P.bP;
                break;
            case 'N':
                piece = P.bN;
                break;
            case 'B':
                piece = P.bB;
                break;
            case 'R':
                piece = P.bR;
                break;
            case 'Q':
                piece = P.bQ;
                break;
            case 'K':
                piece = P.bK;
                break;

            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
                piece = P.EMPTY
                count = parseInt(ch)
                break;

            case '/':
                rank--;
                file = F._A;
                fenCnt++;
                continue;

            default:
                console.error('Something went wrong')
        }

        for (let i = 0; i < count; i++) {
            Board.pieces[FR2SQ(file, rank)] = piece;
            file += 1;
        }
        fenCnt++;
    }

    for (let i = 0; i < castlePerm.length; i++) {
        switch (castlePerm[i]) {
            case 'K':
                Board.castePerm |= CASTLE.BKCA;
                break;
            case 'Q':
                Board.castePerm |= CASTLE.BQCA;
                break;
            case 'k':
                Board.castePerm |= CASTLE.WKCA;
                break;
            case 'q':
                Board.castePerm |= CASTLE.WQCA;
                break;
        }
    }

    if (enPas !== '-' && enPas.length === 2) {
        file = enPas[0].charCodeAt(0) - 'a'.charCodeAt(0)
        rank = enPas[1].charCodeAt(0) - '0'.charCodeAt(0) - 1
        Board.enPas = FR2SQ(file, rank)
    }

    Board.side = side === 'w' ? CLR.W : CLR.B
    Board.posKey = generatePosKey()

    updateListsMaterial()
    printBoardToUI(Board.pieces)
}