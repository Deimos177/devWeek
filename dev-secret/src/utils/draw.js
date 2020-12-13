const shuffle = require('./shuffle')

module.exports = (participants) => {
    const result = []
    const shuffled = shuffle(participants)
    const total = shuffled.length

    for (let shuffledIndex = 0; shuffledIndex < total -1 ; shuffledIndex++) {
        result.push(
            {
                giver: shuffled[shuffledIndex],
                receiver: shuffled[shuffledIndex + 1]
            }
        )
    }

    result.push({
        giver: shuffled[total -1],
        receiver: shuffled[0]
    })

    return result
}