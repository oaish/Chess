let Board = {
    pieces: Array(BRD_SQ_NUM).fill(SQ.OFF_BOARD),
    totalMoves: 0,
    castePerm: 0,
    fiftyMove: 0,
    side: CLR.W,
    moves: 0,
    enPas: 0,
    posKey: 0,
    current: null,
    parentDiv: null,
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

const SqAttacked = (sq, side) => {
    const {pieces} = Board

    console.log('Piece is', PIECE_NAMES[pieces[sq]])

    if (side === CLR.W) {
        if (pieces[sq + 11] === P.wP || pieces[sq + 9] === P.wP) {
            console.log(PIECE_NAMES[P.wP], 'is attacking')
            return true
        }
    } else {
        if (pieces[sq - 11] === P.bP || pieces[sq - 9] === P.bP) {
            console.log(PIECE_NAMES[P.bP], 'is attacking')
            return true
        }
    }

    let knPos = isKnightAttacking(sq, pieces)
    let biPos = isBishopAttacking(sq, pieces)
    let rkPos = isRookAttacking(sq, pieces)
    let kiPos = isKingAttacking(sq, pieces)

    for (let i = 0; i < knPos.length; i++) {
        if (side === PieceCol[knPos[i]] && PieceKnight[knPos[i]]) {
            console.log(PIECE_NAMES[side === CLR.W ? P.wN : P.bN], 'is attacking')
            return true
        }
    }

    for (const pos in biPos) {
        const bi = biPos[pos]
        for (let i = 0; i < bi.length; i++) {
            if (side === PieceCol[bi[i]] && PieceBishopQueen[bi[i]]) {
                console.log(PIECE_NAMES[side === CLR.W ? P.wB : P.bB], 'or Queen', 'is attacking')
                return true
            } else if (bi[i] !== P.EMPTY) {
                break
            }
        }
    }

    for (const pos in rkPos) {
        const rk = rkPos[pos]
        for (let i = 0; i < rk.length; i++) {
            if (side === PieceCol[rk[i]] && PieceRookQueen[rk[i]]) {
                console.log(PIECE_NAMES[side === CLR.W ? P.wR : P.bR], 'or Queen', 'is attacking')
                return true
            } else if (rk[i] !== P.EMPTY) {
                break
            }
        }
    }

    for (let i = 0; i < kiPos.length; i++) {
        if (side === PieceCol[kiPos[i]] && PieceKing[kiPos[i]]) {
            console.log(PIECE_NAMES[side === CLR.W ? P.wK : P.bK], 'is attacking')
            return true
        }
    }

    return false
}

const generateFEN = () => {
    const {pieces, side, castePerm, enPas} = Board;
    let sq = 0;
    let pce = 0;
    let cnt = 0;
    let fen = '';

    for (let r = R._8; r >= R._1; r--) {
        for (let f = F._A; f < F.NONE; f++) {
            sq = FR2SQ(f, r);
            pce = pieces[sq];
            if (pce !== P.EMPTY) {
                if (cnt > 0) {
                    console.log('Count', cnt)
                    fen += cnt
                    cnt = 0
                }
                fen += getChessPieceForFEN(pce)
            } else if (pce === P.EMPTY) {
                cnt++
                if (f === F._H) {
                    fen += cnt
                    cnt = 0
                }
            }
        }

        if (r !== R._1) fen += '/'
    }

    let nibble = castePerm.toString(2)
    let castleBit = ''
    castleBit += nibble.charAt(0) === '1'? 'K' : ''
    castleBit += nibble.charAt(1) === '1'? 'Q' : ''
    castleBit += nibble.charAt(2) === '1'? 'k' : ''
    castleBit += nibble.charAt(3) === '1'? 'q' : ''

    fen += ' ' + (side === '1'? 'b' : 'w')
    fen += ' ' + (castleBit ? castleBit : '-')
    fen += ' ' + (enPas !== SQ.NO_SQ ? '1' : '-')

    return fen
}
