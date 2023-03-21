let sample = '186,170,193,180,192,183,177,167,176,158,174,185,154,156,170,168,176,178'
let sampleFiltered = sample.split(',');

// console.log(sampleFiltered);

// console.log(`${sample.length} | ${sample[sample.length-1]}`);

let freq = {
    description: ''
}
freq.frequencies = 0;
freq.frequencies++
console.log(freq.frequencies);

console.log('split')
const arr = [4,9,11];
const indexesToDelete = [0,1]; // indexes to be deleted
indexesToDelete.sort((a, b) => b - a); // sort in descending order

console.log(indexesToDelete);
indexesToDelete.forEach(index => {
  arr.splice(index, 1);
});

console.log(arr); // [1, 3, 5]
