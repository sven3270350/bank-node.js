/* eslint-disable no-lonely-if */
/* eslint-disable no-else-return */
const db = require('../config/db.config.js');
const User = db.users;
const Bill = db.bills;
const Additional = db.additionals;
const Transaction = db.transactions;
const Currency = db.currency;

module.exports = (req, res, next) => {
  function getTodayDate() {
    const today = new Date();
    return today;
  }

  function setAuthorizationStatus(status) {
    const authorizationStatus = status;
    return authorizationStatus;
  }

  async function getCurrencyId(id_owner) {
    const isCurrency = await Bill.findOne({
      where: {
        id_owner,
      },
    });
    return isCurrency.id_currency;
  }

  async function setAvailableFunds(
    recipientId,
    recipientAvailableFunds,
    amountMoney,
    transferCurrencyId,
  ) {
    await addAvailableFunds(
      recipientAvailableFunds,
      amountMoney,
      recipientId,
      transferCurrencyId,
    );
  }

  async function addAvailableFunds(
    recipientAvailableFunds,
    amountMoney,
    recipientId,
    transferCurrencyId,
  ) {
    const recipientCurrencyId = await getCurrencyId(recipientId);

    if (recipientCurrencyId === transferCurrencyId) {
      Bill.update(
        {
          available_funds: (
            parseFloat(recipientAvailableFunds) + parseFloat(amountMoney)
          ).toFixed(2),
        },
        { where: { id_owner: recipientId } },
      ).then(() => {
        setWidgetStatus(
          recipientId,
          false,
          recipientCurrencyId,
          transferCurrencyId,
        );
      });
    } else {
      Currency.findOne({
        where: {
          id: recipientCurrencyId,
        },
      }).then(isRecipientCurrencyId => {
        if (isRecipientCurrencyId) {
          const mainCurrency = isRecipientCurrencyId.main_currency;
          const recipientCurrencyExchangeRate =
            isRecipientCurrencyId.currency_exchange_rate;

          Currency.findOne({
            where: {
              id: transferCurrencyId,
            },
          }).then(isTransferCurrencyId => {
            if (isTransferCurrencyId) {
              const transferCurrencyExchangeRate =
                isTransferCurrencyId.currency_exchange_rate;

              if (mainCurrency) {
                const convertedAmountMoney =
                  amountMoney / transferCurrencyExchangeRate;

                Bill.update(
                  {
                    available_funds: (
                      parseFloat(recipientAvailableFunds) +
                      parseFloat(convertedAmountMoney)
                    ).toFixed(2),
                  },
                  { where: { id_owner: recipientId } },
                ).then(() => {
                  setWidgetStatus(
                    recipientId,
                    convertedAmountMoney,
                    recipientCurrencyId,
                    transferCurrencyId,
                  );
                });
              } else {
                const convertedAmountMoney =
                  (amountMoney / transferCurrencyExchangeRate) *
                  recipientCurrencyExchangeRate;
                Bill.update(
                  {
                    available_funds: (
                      parseFloat(recipientAvailableFunds) +
                      parseFloat(convertedAmountMoney)
                    ).toFixed(2),
                  },
                  { where: { id_owner: recipientId } },
                ).then(() => {
                  setWidgetStatus(
                    recipientId,
                    convertedAmountMoney,
                    recipientCurrencyId,
                    transferCurrencyId,
                  );
                });
              }
            }
          });
        }
      });
    }
  }

  async function setTransferHistory(
    senderId,
    recipientId,
    amountMoney,
    transferTitle,
    authorizationKey,
  ) {
    return Transaction.create({
      id_sender: senderId,
      id_recipient: recipientId,
      date_time: getTodayDate(),
      amount_money: amountMoney,
      id_currency: await getCurrencyId(senderId),
      transfer_title: transferTitle,
      authorization_key: authorizationKey,
      authorization_status: setAuthorizationStatus(1),
    });
  }

  function setWidgetStatus(
    recipientId,
    convertedAmountMoney,
    recipientCurrencyId,
    transferCurrencyId,
  ) {
    Additional.findOne({
      where: {
        id_owner: recipientId,
      },
    })
      .then(isRecipient => {
        if (isRecipient) {
          const accountBalanceHistory = isRecipient.account_balance_history;
          const incomingTransfersSum = isRecipient.incoming_transfers_sum;

          if (accountBalanceHistory === '0,0') {
            if (recipientCurrencyId === transferCurrencyId) {
              return Additional.update(
                {
                  account_balance_history: '0,10',
                  incoming_transfers_sum:
                    parseFloat(incomingTransfersSum.toFixed(2)) +
                    parseFloat(10),
                  notification_status: 1,
                },
                { where: { id_owner: recipientId } },
              );
            } else {
              return Additional.update(
                {
                  account_balance_history: `0,${convertedAmountMoney.toFixed(
                    2,
                  )}`,
                  incoming_transfers_sum:
                    parseFloat(incomingTransfersSum.toFixed(2)) +
                    parseFloat(convertedAmountMoney.toFixed(2)),
                  notification_status: 1,
                },
                { where: { id_owner: recipientId } },
              );
            }
          } else {
            if (recipientCurrencyId === transferCurrencyId) {
              return Additional.update(
                {
                  account_balance_history: `${accountBalanceHistory},10`,
                  incoming_transfers_sum:
                    parseFloat(incomingTransfersSum.toFixed(2)) +
                    parseFloat(convertedAmountMoney.toFixed(2)),
                  notification_status: 1,
                },
                { where: { id_owner: recipientId } },
              );
            } else {
              return Additional.update(
                {
                  account_balance_history: `${accountBalanceHistory},${convertedAmountMoney.toFixed(
                    2,
                  )}`,
                  incoming_transfers_sum:
                    parseFloat(incomingTransfersSum.toFixed(2)) +
                    parseFloat(convertedAmountMoney.toFixed(2)),
                  notification_status: 1,
                },
                { where: { id_owner: recipientId } },
              );
            }
          }
        }
      })
      .catch(() => {
        /* just ignore */
      });
  }

  try {
    User.findOne({
      where: { login: req.body.login },
    }).then(isUser => {
      if (isUser) {
        const recipientId = isUser.id;
        Bill.findOne({
          where: {
            id_owner: recipientId,
          },
        }).then(isBill => {
          if (isBill) {
            const recipientAvailableFunds = isBill.available_funds;

            Transaction.findOne({
              where: {
                id_recipient: recipientId,
                authorization_key: 'PROMO10',
                authorization_status: 1,
              },
            }).then(async isTransaction => {
              if (!isTransaction) {
                await setAvailableFunds(
                  recipientId,
                  recipientAvailableFunds,
                  10,
                  1,
                ).then(() => {
                  setTransferHistory(
                    1,
                    recipientId,
                    10,
                    'Create an account',
                    'PROMO10',
                  ).then(isTrasferHistory => {
                    if (isTrasferHistory) {
                      next();
                    }
                  });
                });
              } else {
                next();
              }
            });
          } else {
            next();
          }
        });
      } else {
        next();
      }
    });
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed',
    });
  }
};
