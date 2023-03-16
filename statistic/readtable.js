const fs = require('fs');

returnLog = (x) => {
    return Math.log(x) / Math.LN10
}

sturges  = (sampleSize) => {
    return returnLog(sampleSize)*3.3 + 1 
}

computeStuff = (mode) => {


fs.readFile('/home/yogi/Documents/js/statistics/statistic/table.txt', 'utf-8', (err, data) => {

    if (err) { 
        console.error(err);
        return
    }
   
    const regex = /(\d+)\s+(\d+)\s+(\d+)/g;
    const string = data;

    // initialize empty table object
    let table = {
        i: {

        }
    };

    const matches = string.match(regex);
    // populate table is with retrieved data
    if (matches) {
        matches.forEach((item, y) => {
          
            const parts = item.split(' ').map(num => Number (num));
            table.i[y] = { li: parts[0], Li: parts[1], Xa: parts[2]};
            table.i[y].Xm = (table.i[y].li+ table.i[y].Li)/2
            // sum all class frequencies to find sample size
            let count = 0;
            for (klass in table.i) {
                
                frequenciesSum += klass.f;
                klass.XaXm = (klass.Xa*klass.Xm); // Xa*Xm (VALOR médio da classe)
                sumXaXm += klass.XaXm;
                // find classe modal
                largestFrequency = 0;
                if (klass.i.Xa> largestFrequency) {

                    largestFrequency = klass.i.Xa;

                    let modal = {
                        index: count,
                        value: klass.i.Xa,
                    }
                   
                }
                count++;
            }

            table.n = frequenciesSum; // tamanho da amostra
            table.XBar = sumXaXm/table.n; // media aritmetica ∑(Xa * Xm) / ∑Xa
            table.lask = table.i[modal.index].li; // limite inferior da classe modal
            table.Lask = table.i[modal.index].Li;// limite superior da classe modal
            table.Mob =  (table.lask + table.Lask)/2 // moda da classe bruta

        });
      } 
        console.log(table.i); 
})

}

computeStuff(); 