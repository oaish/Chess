const PIECE_NAMES = ['', 'White Pawn', 'White Knight', 'White Bishop', 'White Rook', 'White Queen', 'White King',
    'Black Pawn', 'Black Knight', 'Black Bishop', 'Black Rook', 'Black Queen', 'Black King']

const P = {
    EMPTY: 0, wP: 1, wN: 2, wB: 3, wR: 4, wQ: 5, wK: 6,
    bP: 7, bN: 8, bB: 9, bR: 10, bQ: 11, bK: 12
};

const BRD_SQ_NUM = 120;

const F = {
    _A: 0, _B: 1, _C: 2, _D: 3,
    _E: 4, _F: 5, _G: 6, _H: 7, NONE: 8
};

const R = {
    _1: 0, _2: 1, _3: 2, _4: 3,
    _5: 4, _6: 5, _7: 6, _8: 7, NONE: 8
};

const CLR = {W: 0, B: 1, BOTH: 2};

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBKQBNR w - -'

const CASTLE = {WKCA: 1, WQCA: 2, BKCA: 4, BQCA: 8}

const MAX_GAME_MOVES = 2048;
const MAX_POSITION_MOVES = 256;
const MAX_DEPTH = 64;

const SQ = {
    A1: 21, B1: 22, C1: 23, D1: 24, E1: 25, F1: 26, G1: 27, H1: 28,
    A8: 91, B8: 92, C8: 93, D8: 94, E8: 95, F8: 96, G8: 97, H8: 98,
    NO_SQ: 99, OFF_BOARD: 100
};

const FilesBRD = []
const RanksBRD = []
const SquareBRD = []

const FR2SQ = (f, r) => {
    return ((21 + f) + (r * 10))
}

const PieceBig = [false, false, true, true, true, true, true, false, true, true, true, true, true];
const PieceMaj = [false, false, false, false, true, true, true, false, false, false, true, true, true];
const PieceMin = [false, false, true, true, false, false, false, false, true, true, false, false, false];
const PieceVal = [0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000];
const PieceCol = [CLR.BOTH, CLR.W, CLR.W, CLR.W, CLR.W, CLR.W, CLR.W, CLR.B, CLR.B, CLR.B, CLR.B, CLR.B, CLR.B];

const PiecePawn = [false, true, false, false, false, false, false, true, false, false, false, false, false];
const PieceKnight = [false, false, true, false, false, false, false, false, true, false, false, false, false];
const PieceKing = [false, false, false, false, false, false, true, false, false, false, false, false, true];
const PieceRookQueen = [false, false, false, false, true, true, false, false, false, false, true, true, false];
const PieceBishopQueen = [false, false, false, true, false, true, false, false, false, true, false, true, false];
const PieceSlides = [false, false, false, true, true, true, false, false, false, true, true, true, false];

const RAND_32 = () => {
    return (Math.floor((Math.random() * 255) + 1) << 23) || (Math.floor((Math.random() * 255) + 1) << 16) || (Math.floor((Math.random() * 255) + 1) << 8) || Math.floor((Math.random() * 255) + 1)
}

let SideKey = 0;
const PieceKeys = new Array(14 * 120)
const CastleKeys = new Array(16)

const SQ64To120 = new Array(64).fill(65);
const SQ120To64 = new Array(BRD_SQ_NUM).fill(125);

const SQ64 = (sq120) => {
    return SQ120To64[sq120]
}

const SQ120 = (sq64) => {
    return SQ64To120[sq64]
}

const PIECE_INDEX = (pce, pceNum) => {
    return (pce * 10 + pceNum)
}

/*
0000 0000 0000 0000 0000 0111 1111 -> From 0x7F
0000 0000 0000 0011 1111 1000 0000 -> To >> 7, 0x7F
0000 0000 0011 1100 0000 0000 0000 -> Captured >> 14, 0xF
0000 0000 0100 0000 0000 0000 0000 -> EP 0x40000
0000 0000 1000 0000 0000 0000 0000 -> Pawn Start 0x80000
0000 1111 0000 0000 0000 0000 0000 -> Promoted Piece >> 20, 0xF
0001 0000 0000 0000 0000 0000 0000 -> Castle 0x1000000
*/

const FROM_SQ = m => (m & 0x7F);

const TO_SQ = m => ((m >> 7) & 0x7F);

const CAPTURED = m => ((m >> 14) & 0xF);

const PROMOTED = m => ((m >> 20) & 0xF);

let MF_EP = 0x40000;
let MF_PS = 0x80000;
let MF_CA = 0x100000;

let MF_CAP = 0x7C000;
let MF_PROM = 0xF00000;

let NO_MOVE = 0;

