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
let medianClasses = computedDataFromSample.medianClasses;
let modClass = computedDataFromSample.modalClasses;

const returnLog = (x) => {
    return Math.log(x) / Math.LN10
}

const sturges  = (sampleSize) => {
    return returnLog(sampleSize)*3.3 + 1 
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
            genericData.h = frequencies.i[0].Li-frequencies.i[0].li;
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
        EXiFi += actualClass.x*actualClass.f; // xi.fi para media aritmetica
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
                f: actualClass.f,
                index: klass
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

const checkCzuberSuitabilityAndAssignData = () => {
    let modalRef = modClass[0].item;
    let modalIndex = modalRef.index;

    if (modalIndex >=1) {
        modalRef.d1 = modalRef.class.f - frequencies.i[parseInt(modalIndex)-1].f;
        modalRef.d2 = modalRef.class.f - frequencies.i[parseInt(modalIndex)+1].f;

        return true
    }

    return false

}

const findModaFromCzuberLaw = () => {
    let modc = modClass[0].item;
    const isAbleToPerformThroughCzuber = checkCzuberSuitabilityAndAssignData();

    if (isAbleToPerformThroughCzuber) {
        genericData.MoCzuber = modc.class.li + ((modc.d1/(modc.d1+modc.d2))*genericData.h);
    
    }
}

const findModalClassFromFrequenciesTable = () => {
    
    populateCandidatesArrayAndFindBiggestFrequency()
    deleteLesserCandidatesFromCandidatesArray()
    populateModalClassesToMainObject()
    findModaFromCzuberLaw();
    genericData.Mo = (modClass[0].item.class.li+modClass[0].item.class.Li)/2;

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
const findMedianClass = () => {

    let halfSizeOfSample = genericData.n/2;
    let medianClassCounter = -1;
    let temporaryClassFrequenciesArr = [];
    //create temporary array with frequency/class index
    for (let klass in frequencies.i) {
        let actualClass = frequencies.i[klass];
        let temporaryClass = {
            F: actualClass.F,
            index: klass
        };
        temporaryClassFrequenciesArr[klass] = temporaryClass;
    
    }
    temporaryClassFrequenciesArr.sort((a,b) => a.F - b.F);
    for (let y = 0; y < temporaryClassFrequenciesArr.length; y++) {
        if (temporaryClassFrequenciesArr[y].F > halfSizeOfSample) {
            medianClasses[++medianClassCounter] = frequencies.i[y];
            medianClasses[medianClassCounter].FAA = frequencies.i[--y].F; //   freqüência acumulada da classe anterior à classe mediana
            medianClasses[medianClassCounter].h = medianClasses[medianClassCounter].Li-medianClasses[medianClassCounter].li;
            break
        }
    }

}

const calculateMediana = () => {
    // Md = l* + [(- FAA ) x h*] / f*
    let mdc = medianClasses[0];
    genericData.md = mdc.li + ((((genericData.n/2) - mdc.FAA ) * mdc.h)/ mdc.f);

} 

const findPontoMedioClasse = (Li, li) => {
    return Math.floor((Li + li)/2);
}

const findAmplitudeTotalAMostra = (sample) => {
    // AA = Xmax - Xmin (Maior numero da amostra - menor numero da amostra)
    let AA = (sample[sample.length-1] - sample[0]);
    return AA;

}

const computeInput = (userInput) => {
    feedInitialDataToFrequencies(userInput)
    feedGenericFrequencyDataToFrequencies();
    findModalClassFromFrequenciesTable();
    findMedianClass();
    calculateMediana();

}

