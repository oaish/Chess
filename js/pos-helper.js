const isKnightAttacking = (sq, arr) => {
    let pos = []

    pos.push(arr[sq - 21])
    pos.push(arr[sq - 19])

    pos.push(arr[sq - 12])
    pos.push(arr[sq + 8])

    pos.push(arr[sq - 8])
    pos.push(arr[sq + 12])

    pos.push(arr[sq + 21])
    pos.push(arr[sq + 19])

    return pos.filter(p => p !== 100)
}

const isBishopAttacking = (sq, arr) => {
    const diag = {
        TL: [],
        TR: [],
        BL: [],
        BR: [],
    }

    let x = sq
    let count = 1;

    while (true) {
        if (count === 1)
            x -= 11;
        else if (count === 2)
            x -= 9;
        else if (count === 3)
            x += 9;
        else if (count === 4)
            x += 11;

        if (arr[x] === 100) {
            x = sq;
            if (++count === 5) break;
            continue;
        }

        if (count === 1)
            diag.TL.push(arr[x])
        else if (count === 2)
            diag.TR.push(arr[x])
        else if (count === 3)
            diag.BL.push(arr[x])
        else if (count === 4)
            diag.BR.push(arr[x])
    }

    return diag
}

const isRookAttacking = (sq, arr) => {
    const diag = {
        T: [],
        R: [],
        B: [],
        L: [],
    }

    let x = sq
    let count = 1;

    while (true) {
        if (count === 1)
            x -= 10;
        else if (count === 2)
            x += 1;
        else if (count === 3)
            x += 10;
        else if (count === 4)
            x -= 1;

        if (arr[x] === 100) {
            x = sq;
            if (++count === 5) break;
            continue;
        }

        if (count === 1)
            diag.T.push(arr[x])
        else if (count === 2)
            diag.R.push(arr[x])
        else if (count === 3)
            diag.B.push(arr[x])
        else if (count === 4)
            diag.L.push(arr[x])
    }

    return diag
}

const isKingAttacking = (sq, arr) => {
    let pos = []

    pos.push(arr[sq - 11])
    pos.push(arr[sq - 10])
    pos.push(arr[sq - 9])

    pos.push(arr[sq + 1])

    pos.push(arr[sq + 11])
    pos.push(arr[sq + 10])
    pos.push(arr[sq + 9])

    pos.push(arr[sq - 1])

    return pos.filter(p => p !== 100)
}

const getKingMoves = (sq) => {
    let pos = []
    let {pieces: arr} = Board
    sq = parseInt(sq)

    if (arr[sq - 11] === P.EMPTY) pos.push(sq - 11)
    if (arr[sq - 10] === P.EMPTY) pos.push(sq - 10)
    if (arr[sq - 9] === P.EMPTY) pos.push(sq - 9)

    if (arr[sq + 1] === P.EMPTY) pos.push(sq + 1)

    if (arr[sq + 11] === P.EMPTY) pos.push(sq + 11)
    if (arr[sq + 10] === P.EMPTY) pos.push(sq + 10)
    if (arr[sq + 9] === P.EMPTY) pos.push(sq + 9)

    if (arr[sq - 1] === P.EMPTY) pos.push(sq - 1)

    return pos.filter(p => p !== 100)
}

const getPawnMoves = (sq) => {
    let pos = []
    let {pieces: arr} = Board
    sq = parseInt(sq)

    if (PieceCol[arr[sq]] === CLR.W) {
        if (arr[sq - 11] !== P.EMPTY && PieceCol[arr[sq - 11]] !== CLR.W) pos.push(sq - 11)

        if (arr[sq - 10] === P.EMPTY)
            pos.push(sq - 10)
        if (arr[sq - 10] === P.EMPTY && arr[sq - 20] === P.EMPTY && RanksBRD[sq] === R._7)
            pos.push(sq - 20)

        if (arr[sq - 9] !== P.EMPTY && PieceCol[arr[sq - 9]] !== CLR.W) pos.push(sq - 9)
    } else {
        if (arr[sq + 11] !== P.EMPTY && PieceCol[arr[sq + 11]] !== CLR.B) pos.push(sq + 11)

        if (arr[sq + 10] === P.EMPTY)
            pos.push(sq + 10)
        if (arr[sq + 10] === P.EMPTY && arr[sq + 20] === P.EMPTY && RanksBRD[sq] === R._2)
            pos.push(sq + 20)

        if (arr[sq + 9] !== P.EMPTY && PieceCol[arr[sq + 9]] !== CLR.B) pos.push(sq + 9)
    }

    return pos.filter(p => {
        return SQ64(p) !== 125
    })
}

const getKnightMoves = (sq) => {
    let pos = []
    let {pieces: arr} = Board
    sq = parseInt(sq)

    if (arr[sq - 21] === P.EMPTY || PieceCol[arr[sq - 21]] !== PieceCol[arr[sq]]) pos.push(sq - 21)
    if (arr[sq - 19] === P.EMPTY || PieceCol[arr[sq - 19]] !== PieceCol[arr[sq]]) pos.push(sq - 19)

    if (arr[sq - 12] === P.EMPTY || PieceCol[arr[sq - 12]] !== PieceCol[arr[sq]]) pos.push(sq - 12)
    if (arr[sq + 8] === P.EMPTY || PieceCol[arr[sq + 8]] !== PieceCol[arr[sq]]) pos.push(sq + 8)

    if (arr[sq - 8] === P.EMPTY || PieceCol[arr[sq - 8]] !== PieceCol[arr[sq]]) pos.push(sq - 8)
    if (arr[sq + 12] === P.EMPTY || PieceCol[arr[sq + 12]] !== PieceCol[arr[sq]]) pos.push(sq + 12)

    if (arr[sq + 21] === P.EMPTY || PieceCol[arr[sq + 21]] !== PieceCol[arr[sq]]) pos.push(sq + 21)
    if (arr[sq + 19] === P.EMPTY || PieceCol[arr[sq + 19]] !== PieceCol[arr[sq]]) pos.push(sq + 19)

    return pos.filter(p => {
        return SQ64(p) !== 125
    })
}