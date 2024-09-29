// utils/validateExpense.js
const validateExpense = (expense) => {
    const errors = [];

    if (!expense.title || typeof expense.title !== 'string') {
        errors.push('Title is required and should be a string.');
    }
    if (!expense.amount || isNaN(expense.amount)) {
        errors.push('Amount is required and should be a number.');
    }
    if (!expense.date || isNaN(Date.parse(expense.date))) {
        errors.push('Date is required and should be a valid date.');
    }
    if (!expense.category || typeof expense.category !== 'string') {
        errors.push('Category is required and should be a string.');
    }
    if (!expense.paymentMethod || typeof expense.paymentMethod !== 'string') {
        errors.push('Payment Method is required and should be a string.');
    }
    if (!expense.description || typeof expense.description !== 'string') {
        errors.push('Description is required and should be a string.');
    }

    return errors;
};

module.exports = validateExpense;
