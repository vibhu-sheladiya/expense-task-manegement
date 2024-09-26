const csv = require('csv-parser');
const { Readable } = require('stream');

/**
 * Parses a CSV file buffer and returns a promise with the parsed data.
 * @param {Object} file - The file object with a buffer property.
 * @returns {Promise<Array<Object>>} - A promise that resolves with an array of parsed CSV data.
 */
const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
        const results = [];
        const stream = Readable.from(file.buffer.toString('utf-8')); // Convert buffer to string with UTF-8 encoding

        stream.pipe(csv())
            .on('data', (data) => {
                // Example validation: Ensure each row has required fields
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