let computedDataFromSample = {
    genericData: {},
    modalClasses: {},
    medianClasses: {},
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
    feedInitialDataToFrequencies(userInput)
    feedGenericFrequencyDataToFrequencies();
    findModalClassFromFrequenciesTable();
}

const feedInitialDataToFrequencies = (userInput) => {
    
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
            const matchesFromUserInput = userInput.match(classesWithIntervalRegex);
            feedFrequenciesTable(matchesFromUserInput);

            genericData.k = Object.keys(frequencies.i).length;
            genericData.n = findNFromFrequenciesTable();
        break;
    }
}
const feedGenericFrequencyDataToFrequencies = () => {
    let currentAccumulatedFrequency = 0;
    let EXiFi = 0; // soma de pontos medios de cada classe
    for (klass in frequencies.i) {
        actualClass = frequencies.i[klass];
        currentAccumulatedFrequency += actualClass.f;
        
        actualClass = frequencies.i[klass];
        actualClass.x = (actualClass.Li+actualClass.li)/2; // Ponto médio da classe
        EXiFi += actualClass.x; // xi.fi para media aritmetica
        actualClass.fr = actualClass.f/genericData.n; // Frequencia simples acumulada
        actualClass.F = currentAccumulatedFrequency; // Frequencia relativa
        actualClass.Fr = actualClass.F/genericData.n; // Frequencia relativa acumulada
    }

    genericData.xbar = EXiFi/genericData.n; // media aritmetica Σxi.fi/Σfi (Σfi = n)

}
    let modalClasses = {
        classes: [],
        biggestFrequency: 0
    }

const populateCandidatesArrayAndFindBiggestFrequency = () => {
    let biggestFrequencySeen = 0;
    for (klass in frequencies.i) {
        
        let actualClass = frequencies.i[klass];
        let actualClassFrequency = actualClass.f;
        // check for the biggest frequency AND populate modalClasses with biggest frequencies related data
        if (actualClassFrequency >= biggestFrequencySeen) {
            biggestFrequencySeen = actualClassFrequency;

            let actualClassData = {
                class: actualClass,
                f: actualClass.f
            }
            modalClasses.classes.push(actualClassData); 
        }
    }
    modalClasses.biggestFrequency = biggestFrequencySeen;
}

const deleteLesserCandidatesFromCandidatesArray = () => {
    let indexesToBeRemoved = []
    // find lesser candidate indexes to be removed
    modalClasses.classes.forEach((item, i) => {
        if (item.f < modalClasses.biggestFrequency) {
            indexesToBeRemoved.push(i);
        }
    })
    indexesToBeRemoved.sort((a, b) => b - a); // sort in descending order

    console.log('classes current arr ' + modalClasses.classes.map(obj => `${obj.f}`).join(', '));
    //remove them from array
    indexesToBeRemoved.forEach(index => {
        modalClasses.classes.splice(index, 1)
    })
}
const populateModalClassesToMainObject = () => {
    modalClasses.classes.forEach((item, i) => {
        computedDataFromSample.modalClasses[i] = {  item }

    }) 
}
const findModalClassFromFrequenciesTable = () => {
    
    populateCandidatesArrayAndFindBiggestFrequency()
    deleteLesserCandidatesFromCandidatesArray()
    populateModalClassesToMainObject()

    console.log('FInaL MODALCLASSES.CLASSES ' + JSON.stringify(modalClasses.classes))

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
        
        genericData.ROL.forEach((item, i) => {

            if (item >= currentClassli && item < currentClassLi) {
                    frequencies.i[klass].f++; 
                    console.log(`Adding frequency to ${currentClassFrequency} | comparison of (${item} >=  ${currentClassli} && ${item} < ${currentClassLi})`);
            
                }
        })
    }
}

const feedLimitsOfClass = () => {
    let Xmin = genericData.ROL[0]
    let currentSmallestLimit = Xmin;

    //assign li/Li to classes 
    for (let y=0;y<genericData.n;y++) {
        frequencies.i[y] = { li: currentSmallestLimit, Li: currentSmallestLimit+=genericData.h }
    }
    
}

const generateClassesAndFrequencies = () => {

    feedLimitsOfClass();
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