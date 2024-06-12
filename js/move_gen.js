const MOVE = (from, to, captured, promoted, flag) => {
    return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag)
}

const GenerateMoves = () => {
    const {moveListStart, moves} = Board;

    moveListStart[moves + 1] = moveListStart[moves]
}