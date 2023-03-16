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
            table.i[y] = { li: parts[0], Li: parts[1], f: parts[2], Xm: ((parts[0] + parts[1])/2), };

        });
      }
        console.log(table.i); 
})

}

computeStuff(); 