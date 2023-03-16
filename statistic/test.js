const fs = require('fs');

fs.readFile('table.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  let string = data;
  console.log(string);
  
});