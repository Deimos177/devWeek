module.exports = (array) => {
    let currentIndex = array.length
    let temporaryValue
    let randomIndex

    //Enquanto houver elementos ocorre o sorteio
    while(currentIndex !== 0){

        //escolhe elemento aleatório
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        //troca com a posição atual
        temporaryValue = array[currentIndex]
        array[currentIndex] =array[randomIndex]
        array[randomIndex] = temporaryValue
    }

    return array
}