const feedFrequencyTable = () => {

        const propertyOrder = ['i', 'li', 'Li', 'f', 'x', 'fr', 'F', 'Fr', 'xifi', 'xix', 'xix2', 'xix2fi'];
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
    
}
updateGenericElements = () => {

  let order = ['n', 'xbar', 'Mo','MoCzuber', 'md', 'h', 'k', 's', 's2', 'cvp', 'As', 'assimetria' ]

  order.forEach((property, i) => {
      let currentRow = document.getElementById(order[i]);
      let currentElement = document.createElement('td');
      currentElement.textContent = genericData[order[i]];
      currentRow.appendChild(currentElement);
    })
    
}

updateModalClassTable = () => {

  let order = ['im', 'd1', 'd2'];
  let modalTempObj = {

    im: modalClasses.classes[0].class.i,
    d1: modalClasses.classes[0].d1,
    d2: modalClasses.classes[0].d2,
  
  }
  order.forEach((property, i) => {
      let currentRow = document.getElementById(order[i]);
      let currentElement = document.createElement('td');
      currentElement.textContent = modalTempObj[order[i]];
      currentRow.appendChild(currentElement);
    })
  

}

updateMedianClassTable = () => {
  let order = ['imd', 'lmd', 'Lmd', 'FAAmd'];
  let medianaTempObj = {

    imd: medianClasses[0].i,
    lmd: medianClasses[0].li,
    Lmd: medianClasses[0].Li,
    FAAmd: medianClasses[0].FAA
    
  }

  order.forEach((property, i) => {
    let currentRow = document.getElementById(order[i]);
    let currentElement = document.createElement('td');
    currentElement.textContent = medianaTempObj[order[i]];
    currentRow.appendChild(currentElement);
  })
  
}

updateQuartisTable = () => {
  let quartisTable = document.getElementById('quartis');
  genericData.quartis.forEach((quartil, i) => {
    let currentQuartil = document.createElement('td');
    currentQuartil.textContent = quartil;
    quartisTable.appendChild(currentQuartil);
  })
}

updateDecisTable = () => {
  let decisTable = document.getElementById('decis');
  genericData.decis.forEach((decil, i) => {
    let currentDecil = document.createElement('td');
    currentDecil.textContent = decil;
    decisTable.appendChild(currentDecil);
  })
}