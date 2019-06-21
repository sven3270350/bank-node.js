/*
 * DashboardPage Messages
 *
 * This contains all the text for the DashboardPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.DashboardPage';

export default defineMessages({
  helmetDashboardTitle: {
    id: `${scope}.helmetDashboardTitle`,
    defaultMessage: 'Dashboard · Bank Application',
  },
  newPayment: {
    id: `${scope}.newPayment`,
    defaultMessage: 'New payment',
  },
  availableFunds: {
    id: `${scope}.availableFunds`,
    defaultMessage: 'Available Funds',
  },
});
