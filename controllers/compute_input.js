let computedDataFromSample = {
    genericData: {
        quartis: [],
        decis: []
    },
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
    let exifi = 0; // soma de pontos medios de cada classe
    let exix = 0;
    let exix2 = 0;
    let exix2fi = 0;
    for (klass in frequencies.i) {
        actualClass = frequencies.i[klass];
        currentAccumulatedFrequency += actualClass.f;
        actualClass.x = (actualClass.Li+actualClass.li)/2; // Ponto médio da classe
        actualClass.xifi = actualClass.x*actualClass.f; // frequencia * ponto médio da classe
        exifi += actualClass.x*actualClass.f; // xi.fi para media aritmetica
        

        actualClass.fr = +(actualClass.f/genericData.n).toFixed(4); // Frequencia simples acumulada
        actualClass.F = currentAccumulatedFrequency; // Frequencia relativa
        actualClass.Fr = +(actualClass.F/genericData.n).toFixed(4); // Frequencia relativa acumulada
        actualClass.i = +klass+1;
        //console.log(`àt class ${actualClass.i} sum of Li ${actualClass.Li} + li ${actualClass.li}: ${actualClass.Li+actualClass.li} | after /2 ${(actualClass.Li+actualClass.li)/2}`);

    }
    genericData.exifi = exifi;
    genericData.xbar = +(exifi/genericData.n).toFixed(2); // media aritmetica Σxi.fi/Σfi (Σfi = n)
    

    for (klass in frequencies.i) {
        actualClass = frequencies.i[klass];
        
        actualClass.xix = +(actualClass.x - genericData.xbar).toFixed(2);     exix+= actualClass.xix; // x - xbar
        actualClass.xix2 = +(Math.pow(actualClass.xix, 2)).toFixed(2);        exix2+= actualClass.xix2; // x - xbar ^ 2
        actualClass.xix2fi = +(actualClass.xix2*actualClass.f).toFixed(2);    exix2fi += actualClass.xix2fi; // (x - xbar )^2)*f


    }

    genericData.exix = +exix.toFixed(2);
    genericData.exix2 = +exix2.toFixed(2);
    genericData.exix2fi = +exix2fi.toFixed(2);

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
                index: +klass
                
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
        genericData.MoCzuber = +(modc.class.li + ((modc.d1/(modc.d1+modc.d2))*genericData.h)).toFixed(2);
    
    }
}

const findModalClassFromFrequenciesTable = () => { 
    populateCandidatesArrayAndFindBiggestFrequency()
    deleteLesserCandidatesFromCandidatesArray()
    populateModalClassesToMainObject()
    findModaFromCzuberLaw();
    genericData.Mo = (modClass[0].item.class.li+modClass[0].item.class.Li)/2;
          //  i must redo this entire object lol
    
}

//generic function to be used on the job of calculating quartis/decis/percentis
findClassGivenPercentage = (times, percentage) => {
    let frequencyResult = (times*genericData.n)/percentage, foundClass;
    generalClassObj = {};
    for (let klass in frequencies.i) {
        let actualClass = frequencies.i[klass];

        if (actualClass.F > frequencyResult) {
            
            foundClass = actualClass;
            break;
        }
    }
    generalClassObj.klass = foundClass;
    generalClassObj.frequencyResult = frequencyResult;
    
    return generalClassObj;
}
// quartis,decis,percentil
const findQuartisAndAssignResults = () => {

    for (i=1;i<4;i++) {
        quartisClass = findClassGivenPercentage(i, 4);
        currentClassPosition = quartisClass.klass.i-1;
        FAA = frequencies.i[currentClassPosition-1].F; // Fac anterior a classe atual
        genericData.quartis.push(+(quartisClass.klass.li + (((quartisClass.frequencyResult-FAA)*genericData.h)/ quartisClass.klass.f)).toFixed(2));  

    }

}

const findDecisAndAssignResults = () => {
    for (i=1;i<10;i++) {
        decisClass = findClassGivenPercentage(i, 10);
        currentClassPosition = decisClass.klass.i-1;
       // console.log(currentClassPosition )
        console.log()
        if (typeof frequencies.i[(currentClassPosition - 1)] === 'undefined') {
            FAA = decisClass.klass.F;
          
        } else {
            FAA = frequencies.i[currentClassPosition-1].F; // Fac anterior a classe atual
        }
        genericData.decis.push(+(decisClass.klass.li + (((decisClass.frequencyResult-FAA)*genericData.h)/ decisClass.klass.f)).toFixed(2));  

    }
}

const findAnyPercentil = (percentage) => {
    percentilClass = findClassGivenPercentage(percentage, 100);
    currentClassPosition = percentilClass.klass.i-1;
    if (typeof frequencies.i[(currentClassPosition - 1)] === 'undefined') {
        FAA = percentilClass.klass.F;
      
    } else {
        FAA = frequencies.i[currentClassPosition-1].F; // Fac anterior a classe atual
    }

    let percentilResult = percentilClass.klass.li + (((percentilClass.frequencyResult-FAA)*genericData.h)/ percentilClass.klass.f);
    console.log(`O percentil ${percentage} é: ${percentilResult}`);
    return percentilResult;

}

const calculateDesvioPadraoAndAssignResult = () => {
    let desvioPadrao;
    desvioPadrao = +Math.sqrt(genericData.exix2fi/(genericData.n-1)).toFixed(2);
    genericData.s =desvioPadrao; // desvio padrao
}

const calculateVarianciaAndAssignResult = () => {
    genericData.s2 = +(Math.pow(genericData.s, 2)).toFixed(2); // variancia = s2 (s^2)

}

const findNFromFrequenciesTable = () => { // n = total da amostra
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
    genericData.md = +(mdc.li + ((((genericData.n/2) - mdc.FAA ) * mdc.h)/ mdc.f)).toFixed(1);

} 

const findPontoMedioClasse = (Li, li) => {
    return Math.floor((Li + li)/2);
}

const findAmplitudeTotalAMostra = (sample) => {
    // AA = Xmax - Xmin (Maior numero da amostra - menor numero da amostra)
    let AA = (sample[sample.length-1] - sample[0]);
    return AA;

}
const calculatePearsonVariation = () => {
    genericData.cvp = +((genericData.s/genericData.xbar)*100).toFixed(2);

}
const calculateThorndikeVariation = () => {
    genericData.cvt = (genericData.s/genericData.md) * 100;

}
const calculateAsimmetryMeasurement = () => {
    genericData.As = +((3*(genericData.xbar - genericData.md))/genericData.s).toFixed(3);
    
}
const defineAssimetria = () => {

    const fixedValue = 0.15;
    if (genericData.As < fixedValue ) {
        genericData.assimetria = 'Assimetria pequena';
    } else if (genericData.As < 1 && genericData.As > fixedValue) {
        genericData.assimetria = 'Assimetria moderada';
    } else if (genericData.As > 1) {
        genericData.assimetria = 'Assimetria elevada';
    } 
    
}
const findCoeficienteCurtose = () => {
    let p90 = findAnyPercentil(90);
    let p10 = findAnyPercentil(10);
    let c1 = +((genericData.quartis[2]-genericData.quartis[0])/(2*(p90-p10))).toFixed(3);
    genericData.c1 = c1;

    if ( c1 == 0.263 ) {
        genericData.curva = 'mesocúrtica';
    } else if ( c1 < 0.263 ) {
        genericData.curva = 'leptocúrtica';
    } else if ( c1 > 0.263 ) {
        genericData.curva = 'platicúrtica';
    }
    
}
const computeInput = (userInput) => {

    feedInitialDataToFrequencies(userInput)
    feedGenericFrequencyDataToFrequencies();
    findModalClassFromFrequenciesTable();
    findQuartisAndAssignResults();
    calculateDesvioPadraoAndAssignResult();
    findDecisAndAssignResults();
    calculateVarianciaAndAssignResult();
    calculatePearsonVariation();
    //calculateThorndikeVariation();
    findMedianClass();
    calculateMediana();
    calculateAsimmetryMeasurement();
    defineAssimetria();
    findCoeficienteCurtose();

}
