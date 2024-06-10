$(() => {
    init()
})

const initFileRanksBrd = () => {
    for (let i = 0; i < BRD_SQ_NUM; i++) {
        FilesBRD[i] = SQ.OFF_BOARD;
        RanksBRD[i] = SQ.OFF_BOARD;
    }

    for (let r = R._1; r < R.NONE; r++) {
        for (let f = F._A; f < F.NONE; f++) {
            const sq = FR2SQ(f, r);
            FilesBRD[sq] = f;
            RanksBRD[sq] = r;
        }
    }
}

const init = () => {
    initFileRanksBrd()
}