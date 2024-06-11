$(() => {
    init()
})

const InitFileRanksBrd = () => {
    for (let i = 0; i < BRD_SQ_NUM; i++) {
        FilesBRD[i] = SQ.OFF_BOARD;
        RanksBRD[i] = SQ.OFF_BOARD;
        SquareBRD[i] = SQ.OFF_BOARD
    }

    for (let r = R._1; r < R.NONE; r++) {
        for (let f = F._A; f < F.NONE; f++) {
            const sq = FR2SQ(f, r);
            FilesBRD[sq] = f;
            RanksBRD[sq] = r;
            SquareBRD[sq] = String.fromCharCode('a'.charCodeAt(0) + f) + (r + 1)
        }
    }
}

const InitHashKeys = () => {
    for (let i = 0; i < PieceKeys.length; i++) {
        PieceKeys[i] = RAND_32()
    }

    SideKey = RAND_32()

    for (let i = 0; i < CastleKeys.length; i++) {
        CastleKeys[i] = RAND_32()
    }
}

const InitSQ120To64 = () => {
    let sq = SQ.A1;
    let sq64 = 0;
    for (let r = R._1; r < R.NONE; r++) {
        for (let f = F._A; f < F.NONE; f++) {
            sq = FR2SQ(f, r);
            SQ64To120[sq64] = sq;
            SQ120To64[sq] = sq64;
            sq64 += 1;
        }
    }
}

const init = () => {
    InitFileRanksBrd()
    InitHashKeys()
    InitSQ120To64()
    parseFEN(START_FEN)
}