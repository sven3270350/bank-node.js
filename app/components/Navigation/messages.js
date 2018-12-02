/*
 * Navigation Messages
 *
 * This contains all the text for the Navigation component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'app.components.Navigation';

export default defineMessages({
  dashboardItem: {
    id: `${scope}.dashboard`,
    defaultMessage: 'Dashboard',
  },
  paymentItem: {
    id: `${scope}.payment`,
    defaultMessage: 'Payment',
  },
  settingsItem: {
    id: `${scope}.settings`,
    defaultMessage: 'Settings',
  },
});
