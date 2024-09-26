// const mongoose = require('mongoose');

// const expenseSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   amount: { type: Number, required: true },
//   category: { type: String, required: true },
//   paymentMethod: { type: String, enum: ['cash', 'credit'], required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date }
// });

// expenseSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// const Expense = mongoose.model('Expense', expenseSchema);
// module.exports = Expense;
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  paymentMethod: { type: String, enum: ['cash', 'credit'], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);