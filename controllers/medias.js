 //let sample = [2, 3, 3, 4, 5, 2, 2, 5, 6, 8, 7, 9, 3, 4, 6, 7, 8, 9, 6, 8, 5, 6, 8, 6, 7]
//let sample = [1, 2, 3, 3, 4, 5, 6, 7, 8, 8, 2, 3, 4, 8, 9, 7, 6, 5, 6, 7, 10, 10, 9, 8, 7, 6, 5, 4, 5, 6]
let sample = [186,170,193,180,192,183,177,167,176,158,174,185,154,156,170,168,176,178]
sample = sample.sort(function(a, b) {return a - b; });


FindUniqueNumbers = (sample) => {

    // gera array com numeros unicos da amostra
    let diffNumbers = []; 
    sample.forEach((item, i) => {
        isEqual = false;
        for(let y=0;y<diffNumbers.length;y++) {
            if (item == diffNumbers[y]) {
                isEqual = true;
            }
        }
        if(!isEqual) {
            diffNumbers.push(item)
        }
    })

    sample.forEach((item, i) => {

    })
    return diffNumbers

}

FindModa = (arr, sample) => {
    largestFrequency = {
        number: 0,
        freq: 0
    }
    arr.forEach((ArrItem, i) => {

        let currentFrequencyCounter = 0;

        sample.forEach((sampleItem, y)=> {
           
            if (sampleItem == ArrItem) {
                
                currentFrequencyCounter++
            }
            
            if (currentFrequencyCounter>largestFrequency.freq) {

                lastFreq = currentFrequencyCounter;
                largestFrequency.number = ArrItem;
                largestFrequency.freq = currentFrequencyCounter;
                
            };
            
        })
    })
    return largestFrequency
}

SumAllNumbersOnArray = (sample) => {
    let sum = 0;
    sample.forEach((item, i) => {

        sum +=item

    })
    
    return sum/sample.length

}

FindMediana = (sample) => {

    size = sample.length;
    rounded = Math.round(size/2-1)

    let mediana = sample[rounded]
    return mediana

}

FindDesvioPadrão = (sample, media) => {
let totalSum = 0;
    sample.forEach((item, i) => {
        
        subtracted = (item-media).toFixed(2);
        let square = Math.pow(subtracted,2).toFixed(4)
        totalSum += parseFloat(square)
        
    })
    let desvio = totalSum/ (sample.length-1);

    return desvio
}

FindCoeficienteVar = (desvio, media) => {

    coefVar = (desvio/media)*100
    return coefVar
    Moda
}

let moda = FindModa(FindUniqueNumbers(sample), sample);
let media = SumAllNumbersOnArray(sample).toFixed(2);
let mediana = FindMediana(sample)
let desvioPadrao = FindDesvioPadrão(sample, media)
let coeficienteVariacao = FindCoeficienteVar(desvioPadrao,media)

console.log(`Amostra: ${sample}`)
console.log(`Moda: ${moda.number} (${moda.freq} vezes)`)
console.log(`Media: ${media}`)
console.log(`Mediana: ${mediana}`)
console.log(`Desvio padrão: ${desvioPadrao.toFixed(2)}`)
console.log(`Coeficiente de variação aprox: ${coeficienteVariacao.toFixed(2)}%`)