const csv = require('csv-parser');
const { Readable } = require('stream');

/**
 * @param {Object} file 
 * @returns {Promise<Array<Object>>} 
 */
const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
        const results = [];
        const stream = Readable.from(file.buffer.toString('utf-8'));

        stream.pipe(csv())
            .on('data', (data) => {
                if (data.title && data.amount && data.date && data.category && data.paymentMethod && data.description) {
                    results.push(data);
                } else {
                    console.warn('Skipped row due to missing fields:', data);
                }
            })
            .on('end', () => {
                if (results.length === 0) {
                    reject(new Error('No valid expenses found in the file'));
                } else {
                    resolve(results);
                }
            })
            .on('error', (err) => reject(err));
    });
};

module.exports = parseCSV;
