const fs = require('fs');

returnLog = (x) => {
    return Math.log(x) / Math.LN10
}

sturges  = (sampleSize) => {
    return returnLog(sampleSize)*3.3 + 1 
}
// fetch stuff from arquivo (mandar pro DOM dps)
try {
    data = fs.readFileSync('/home/yogi/Documents/js/estatistica/statistic/table.txt', 'utf-8');
    

} catch (error) {
    console.error(error);

}

computeStuff =  () => {
   
    let inputFromUser = document.getElementById('input-field').value;
    console.log(inputFromUser);

    const str = data;
    const regex = /(\d+)\s+(\d+)\s+(\d+)/g;
    const string = inputFromUser;

    // initialize empty table object
    let table = {
        i: {

        }
    };
    // regex the string to separate matching values
    const matches = string.match(regex);
    // populate classes with retrieved data
    if (matches) {

            matches.forEach((item, y) => {
        
            const parts = item.split(' ').map(num => Number (num));
            table.i[y] = { li: parts[0], Li: parts[1], f: parseInt(parts[2])}; // limite inferior/superior da classe e frequencia simples
            table.i[y].x = Math.floor((table.i[y].li+ table.i[y].Li)/2) // ponto medio da classe x 

        });

            let count = 0;
            let frequenciesSum = 0;
            table.modalClass = {
                klass: {}
            };

            let largestFrequency = 0;
            for (klass in table.i) {
                //  sum tamanho da amostra 
                actualItem = table.i[klass];
                frequenciesSum += actualItem.f; // total = tamanho da amostra
                // find classe modal (classe com maior frequência)
                if (actualItem.f > largestFrequency) {
                    
                    largestFrequency = actualItem.f;
                    table.modalClass.klass = table.i[klass];
                    table.modalClass.index = klass;

                } else { 
                    largestFrequency = largestFrequency;
                }
                count++;
            }
            // define modal stuff
            let tempModal = table.modalClass.klass, modalIndex = parseInt(table.modalClass.index);
            table.modalClass.l_asterisk = tempModal.li;
            table.modalClass.L_asterisk = tempModal.Li; 
            //
            table.Mob =  (table.modalClass.l_asterisk + table.modalClass.L_asterisk)/2; // moda da classe bruta
            table.n = frequenciesSum; // tamanho da amostra (40 nesse caso)
            table.h = table.i[0].Li - table.i[0].li; // amplitude de

            if (typeof(table.i[modalIndex-1]) != "undefined") {
                table.modalClass.d1 = (table.modalClass.klass.f - table.i[modalIndex-1].f)
                table.modalClass.d2 = (table.modalClass.klass.f - table.i[modalIndex+1].f)
                table.Mcz = (table.modalClass.l_asterisk + ((table.modalClass.d1 / (table.modalClass.d1+table.modalClass.d2))*table.h)); // moda de czuber

            } else {
                table.Mcz = 'nulo'
            }
//
            table.Efr = table.Exifi = 0; // soma de frequencias relativas
            let currentAccumulatedFrequency = 0;

            for (klass in table.i) {
                
                actualItem = table.i[klass];
                currentAccumulatedFrequency += actualItem.f; 
                //console.log(`currentAccumulatedFrequency ${currentAccumulatedFrequency} | actualItem.f ${actualItem.f}`)

                actualItem.fr = actualItem.f/table.n // frequencia relativa
                actualItem.F = currentAccumulatedFrequency; // frequencia acumulada
                actualItem.Fr = actualItem.F/table.n; // frequencia RELATIVA acumulada
                actualItem.xifi = actualItem.x*actualItem.f;  // xi.fi p/ media aritmetica 
                table.Exifi += actualItem.xifi;
                table.Efr += actualItem.fr; // soma frequencia relativa
                
            }

            table.x_bar = table.Exifi/table.n;
            table.medianClass = {
                klass: {}
              };
            
            for (item in table.i) {

                actualItem = table.i[item];
                halfSampleSize = table.n/2;

                if (actualItem.F>halfSampleSize) {
                   // console.table(actualItem);
                             table.medianClass.klass = actualItem;
                    console.log(`Freq classe modal atual: ${actualItem.f}`);
                    table.medianClass.FAA = table.i[item-1].F;
                    break
                }

            }
           
            // define median class stuff
            let medianTemp = table.medianClass.klass;
            table.medianClass.l_asterisk = medianTemp.li;
            table.medianClass.f_asterisk = medianTemp.f;
            table.medianClass.h_asterisk = table.h;

            table.Md = table.medianClass.l_asterisk + ((((table.n/2)-table.medianClass.FAA)*table.medianClass.h_asterisk)/table.medianClass.f_asterisk);

      } 
      //console.log(table); 
     // console.log(table)
      return table;
}

UpdateDomTables = (obj) => {

    middle = document.getElementById('middle')
    divsOnMiddle = generalContainer.querySelectorAll('div');

    divsOnMiddle.forEach((item, i) => {
        if (i==2) {
            
        } else {
            rowsOnDiv == document.querySelectorAll('table tr')
            console.log()
         }
        
    });
}


let table = computeStuff(data);
let statisticsObj = {
    generic: {
        n: table.n,
        k: Object.keys(table.i).length,
        Mob: table.Mob,
        Mcz: table.Mcz,
        x_bar: table.x_bar,
    },
    modal : { // dados classe modal
        index: table.modalClass.index,
        l_asterisk: table.modalClass.l_asterisk,
        L_asterisk: table.modalClass.L_asterisk,
        d1: table.modalClass.d1,
        d2: table.modalClass.d2,
        h_asterisk: table.modalClass.klass.Li - table.modalClass.klass.li
    },
    cmediana: {
        FAA: table.medianClass.FAA,
        l_asterisk: table.medianClass.l_asterisk,
        h_asterisk: table.medianClass.h_asterisk
    },
    frequencies: {}

}  

// // frequencias
statisticsObj.frequencies = table.i;
console.log(statisticsObj)