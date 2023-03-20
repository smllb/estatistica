let computedDataFromSample = {
    genericData: {},
    modalClass: {},
    medianClass: {},
    frequencies: {
        i: {}
    }
}

let genericData = computedDataFromSample.genericData;
let frequencies = computedDataFromSample.frequencies;

const returnLog = (x) => {
    return Math.log(x) / Math.LN10
}

const sturges  = (sampleSize) => {
    return returnLog(sampleSize)*3.3 + 1 
}

const computeInput = (userInput) => {
    processInput(userInput)

    
}



const processInput = (userInput) => {
    
    let sample;
    switch(selectedMode) {
        case 'dadosBrutos':
            ROL = userInput.split(',').sort((a, b) => {return a - b; }); // comparison function
            //define initial generic data from brute sample
            genericData.AA = findAmplitudeTotalAMostra(ROL); // AMPLITUDE TOTAL DA AMOSTRA 
            genericData.ROL = ROL; // amostra
            genericData.n = (ROL.length) // tamanho da amostra
            genericData.k = sturges(ROL.length); // quantidade de classes a partir da regra de sturges
            genericData.h = (genericData.AA/genericData.k) // Amplitude da classe

            generateClassesAndFrequencies();
            // continuar de um mesmo ponto do de baixo dps...
        break;
        case 'classeIntervalo':
            const matchesFromUserInput = userInput.match(regex);
            feedFrequenciesTable(matchesFromUserInput);

            genericData.k = Object.keys(frequencies.i).length;
            genericData.n = findNFromFrequenciesTable();
        break;
    }
}
const findNFromFrequenciesTable = () => { 
    let n = 0;
    
    for (let klass in frequencies.i){ 
        currentClassFrequency = frequencies.i[klass].f;
        n += currentClassFrequency;
    }

    return n
}
const findUniqueNumbersOnSample = () => {

    // gera array com numeros unicos da amostra
    let diffNumbers = []; 
    ROL.forEach((item, i) => {
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

    return diffNumbers

}
const findClassFrequency = () => {

    for (let klass in frequencies.i) {

        currentClassLi = frequencies.i[klass].Li;
        currentClassli = frequencies.i[klass].li;
        currentClassFrequency = frequencies.i[klass].f = 0; 
        
        genericData.sample.forEach((item, i) => {

            if (item >= currentClassli && item < currentClassLi) {
                    frequencies.i[klass].f++; 
                    console.log(`Adding frequency to ${currentClassFrequency} | comparison of (${item} >=  ${currentClassli} && ${item} < ${currentClassLi})`);
            
                }
        })
    }
}

const feedLimitsOfClass = () => {
    let Xmin = genericData.sample[0]
    let currentSmallestLimit = Xmin;

    //assign li/Li to classes 
    for (let i=0;i<genericData.n;i++) {
        frequencies.i[y] = { li: currentSmallestLimit, Li: currentSmallestLimit+=genericData.h }
    }
    
}

const generateClassesAndFrequencies = () => {

    feedInferiorAndSuperiorLimitsOfClass();
    findClassFrequency(); 

}

const feedFrequenciesTable = (matchesFromUserInput) => { // function to be used on class with interval mode 
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