let sampleBase = [186,170,193,180,192,183,177,167,176,158,174,185,154,156,170,168,176,178]

returnLog = (x) => {
    return Math.log(x) / Math.LN10
}

sturges  = (sampleSize) => {
    return returnLog(sampleSize)*3.3 + 1 
}


// sample object


FeedSampleData = (sample) => {

    sample = sample.sort();
    sampleSize = sample.length;
    k = Math.round(sturges(sampleSize));
    Xmax = sample[sampleSize-1];
    Xmin = sample[0];
    AA = Xmax - Xmin;
    h = Math.round(AA/k);

    let sampleData = {} 

    sampleData = {
        sample: sample,
        sampleSize: sampleSize,
        k: k,
        Xmax: Xmax,
        Xmin: Xmin,
        AA: AA,
        h: h,
        classes: ""
    }

    return sampleData

}

let sampleData = FeedSampleData(sampleBase);



// class handling 


classes = {
    i: {}
}

GenerateClasses = () => {

    let startingPoint = sampleData.sample[0]

    for(let i=0;i<5;i++) {
        let Xi = (startingPoint +  (startingPoint+sampleData.h)) / 2
        let iClass = {
            li: startingPoint,
            Li: startingPoint+=sampleData.h,
            f: 0,
            Fr: 0,
            F: 0,
            Xi: Xi
            
        }
        classes["i"][i] = iClass;
    
    }
    console.log('Classes generated')
}

CheckFrequency = (list) => {
    console.log('Checking frequencies\n')
    for (let item in list.i) {
       
        const classItem = classes.i[item];
  
      for(let y=0;y<sampleData.sampleSize;y++) {

       if (sampleData.sample[y] >= classItem.li && sampleData.sample[y] < classItem.Li) {

        classItem.f++;

       }
      }
     }
     
}

GenerateRelativeFrequency = (list) => {

    for (let item in list.i) {
       
        const classItem = classes.i[item];
        classItem.fr = classItem.f/sampleData.sampleSize; 
        //console.log(`Generating as ${classItem.f/sampleData.sampleSize}`)

     }
}
GenerateAcumulatedFrequency = (list) => {
    
        list.i[0].F = list.i[0].f;
        let Fi = list.i[0].F; //starting point
        let listLength = Object.keys(list.i).length;
        
        for(let y=1;y<listLength;y++) {

            let currentItem = list.i[y].f; 
            Fi += currentItem;
            list.i[y].F = Fi;
            // console.log(`Adding ${Fi} (accumulated Fr) to class ${y}`)
            
        }


}

GenerateRelativeFrequencyAccumulated = (list) => {
    
    let listLength = Object.keys(list.i).length;
    
    for(let y=0;y<listLength;y++) {
        F = list.i[y].F;
        Ef = sampleData.sampleSize;
        list.i[y].Fr = (F/Ef).toFixed(3);
    }

}

//Results

LogClass = (classes) => {

    
for (let item in classes.i) {

    console.log(`Class ${parseInt(item)} | ${classes.i[item].li}-${classes.i[item].Li} | frequency (f): ${classes.i[item].f} | xi: ${classes.i[item].Xi}  | fr: ${classes.i[item].fr.toFixed(4)}  | Fi ${classes.i[item].F} | Fr ${classes.i[item].Fr}`);

  }

}

DoOperation = () => {

    FeedSampleData(sampleBase);
    console.log(sampleData)
    GenerateClasses();
    CheckFrequency(classes);
    GenerateRelativeFrequency(classes);
    GenerateAcumulatedFrequency(classes);
    GenerateRelativeFrequencyAccumulated(classes);

    LogClass(classes);
    
    

}


DoOperation();


console.log(`\nUtilizando a metodologia de Sturges para uma amostra de 800: ${sturges(800).toFixed(4)}, aproximadamente ${Math.round(sturges(800))} classes.`)
console.log(`Teste da raiz para 800:  ${Math.sqrt(800).toFixed(4)}`)