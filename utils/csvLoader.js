const fs = require('fs');
const csv = require('csv-parser');  

const parseCSV = (filePath, mapperFn) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
        .on('data', (row) => results.push(mapperFn ? mapperFn(row) : row))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
};