module.exports = function(app) {
  const transactions = require('../controllers/transaction.controller.js');

  // Create a new User
  app.post('/api/transactions', transactions.create);

  // Retrieve all User
  app.get('/api/transactions', transactions.findAll);

  app.get(
    '/api/transactions/recipient/:transactionRecipientId',
    transactions.findAllByIdRecipient,
  );

  app.get(
    '/api/transactions/sender/:transactionSenderId',
    transactions.findAllByIdSender,
  );

  // Update a User with Id
  app.put('/api/transactions/:transactionId', transactions.update);

  // Delete a User with Id
  app.delete('/api/transactions/:transactionId', transactions.delete);
};
