let genericData = computedDataFromSample.genericData;
let frequencies = computedDataFromSample.frequencies;

const returnLog = (x) => {
    return Math.log(x) / Math.LN10
}

const sturges  = (sampleSize) => {
    return returnLog(sampleSize)*3.3 + 1 
}

const computeInput = (userInput) => {
    
    
}

let computedDataFromSample = {
    genericData: {},
    modalClass: {},
    medianClass: {},
    frequencies: {
        i: {}
    }
}

processInput = (userInput, selectedMode) => {

    let sample;
    

    switch(selectedMode) {
        case 'dadosBrutos':
            sample = userInput.split(',').sort((a, b) => {return a - b; }); // comparison function
            //define initial generic data from brute sample
            genericData.AA = findAmplitudeTotalAMostra(sample); // AMPLITUDE TOTAL DA AMOSTRA 
            genericData.sample = sample; // amostra
            genericData.n = (sample.length) // tamanho da amostra
            genericData.k = sturges(sample.length); // quantidade de classes a partir da regra de sturges
            genericData.h = (genericData.AA/genericData.k) // Amplitude da classe

            //Popular obj com classes geradas, ver numeros unicos, assimilar nas frequencias, etc
            // continuar de um mesmo ponto do de baixo dps...
        break;
        case 'classeIntervalo':
            const matchesFromUserInput = userInput.match(regex);
            createFrequenciesTable(matchesFromUserInput);

        break;
    }
}

const createFrequenciesTable = (matchesFromUserInput) => {
    matchesFromUserInput.forEach((item, y) => {
        const parts = item.split(' ').map(num => Number (num));
        frequencies.i[y] = { li: parts[0], Li: parts[1], f: parseInt(parts[2])};
        frequencies.i[y].x = findPontoMedioClasse();
    });

}
const findPontoMedioClasse = (Li, li) => {
    return Math.floor((Li + li)/2);
}
const findAmplitudeTotalAMostra = (sample) => {
    // AA = Xmax - Xmin (Maior numero da amostra - menor numero da amostra)
    let AA = (sample[sample.length-1] - sample[0]);
    return AA;

}