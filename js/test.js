let arr = [
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
    100, 21, 22, 23, 24, 25, 26, 27, 28, 100,
    100, 31, 32, 33, 34, 35, 36, 37, 38, 100,
    100, 41, 42, 43, 44, 45, 46, 47, 48, 100,
    100, 51, 52, 53, 54, 55, 56, 57, 58, 100,
    100, 61, 62, 63, 64, 65, 66, 67, 68, 100,
    100, 71, 72, 73, 74, 75, 76, 77, 78, 100,
    100, 81, 82, 83, 84, 85, 86, 87, 88, 100,
    100, 91, 92, 93, 94, 95, 96, 97, 98, 100,
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100
]

const bin = (ans) => {
    let str = ans.toString(2).padStart(7 * 4, '0')
    let s = ''
    let x = 0
    for (let i = str.length - 1; i >= 0; i--) {
        s += str[x++]
        if (i%4 === 0)
            s += ' '
    }
    return s
}

const hex = (ans) => {
    return ans.toString(16)
}