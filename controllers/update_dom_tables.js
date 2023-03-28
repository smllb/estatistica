const feedFrequencyTable = () => {

        const propertyOrder = ['li', 'Li', 'f', 'x', 'fr', 'F', 'Fr'];
        const frequencies = computedDataFromSample.frequencies;

        for (let key in frequencies.i) {
            const obj = frequencies.i[key];
            const newObj = {};
          
            for (let propName of propertyOrder) {
              newObj[propName] = obj[propName];
            }
          
            frequencies.i[key] = newObj;
          }
          
          let frequencyTable = document.getElementById('frequencias');

        for (let key in frequencies.i) {
          let obj = frequencies.i[key];
        
          let tr = document.createElement('tr');
          tr.setAttribute('id', key);
        
          for (let propName in obj) {
            let td = document.createElement('td');
            td.textContent = obj[propName];
            tr.appendChild(td);
          }
      
          frequencyTable.appendChild(tr);
        }
     //  make a generic function that receives a property order, a pointing to some table and do the stuff
    
    console.table(frequencies);
    console.table({keys: Object.keys(frequencies.i), data: Object.values(frequencies.i)});
}