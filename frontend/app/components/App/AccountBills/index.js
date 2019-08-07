/* eslint-disable indent */
/**
 *
 * AccountBills
 *
 */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import socketIOClient from 'socket.io-client';
import saga from 'containers/DashboardPage/saga';
import reducer from 'containers/DashboardPage/reducer';

// Import Components
import SwapVertIcon from '@material-ui/icons/SwapVert';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import LinkWrapper from 'components/App/LinkWrapper';
import {
  SoftWidgetHeader,
  SoftWidgetWrapper,
  SoftWidgetHeaderAction,
} from 'components/App/SoftWidget';
import LoadingWrapper from 'components/App/LoadingWrapper';
import { TableCellRightSide, TableCellLeftSide } from 'components/App/Table';
import LoadingCircular from 'components/App/LoadingCircular';
import TableCellWrapper from './TableCellWrapper';
import AvailableFundsWrapper from './AvailableFundsWrapper';
import messages from './messages';

// Import Utils
import ApiEndpoint from 'utils/api.js';
import AuthService from 'services/auth.service';

// Import Actions
import { getAccountBillsAction } from 'containers/DashboardPage/actions';

// Import Selectors
import {
  makeAvailableFundsSelector,
  makeAccountBillsSelector,
  makeCurrencySelector,
} from 'containers/DashboardPage/selectors';

const stateSelector = createStructuredSelector({
  availableFunds: makeAvailableFundsSelector(),
  accountBills: makeAccountBillsSelector(),
  currency: makeCurrencySelector(),
});

export default function AccountBills() {
  const api = new ApiEndpoint();
  const auth = new AuthService();
  const userId = auth.getUserId();
  const baseURL = api.getBasePath();
  const key = 'dashboardPage';
  const dispatch = useDispatch();
  const getAccountBills = () => dispatch(getAccountBillsAction());
  const { availableFunds, accountBills, currency } = useSelector(stateSelector);
  const socket = socketIOClient('', {
    path: `${baseURL}/socket.io`,
    transports: ['websocket'],
    secure: true,
  });

  useInjectSaga({ key, saga });
  useInjectReducer({ key, reducer });

  useEffect(() => {
    if (!accountBills) getAccountBills();

    socket.on('new notification', id => {
      socket.io.opts.transports = ['polling', 'websocket'];
      id === userId && getAccountBills();
    });
  }, []);

  return (
    <SoftWidgetWrapper>
      <SoftWidgetHeader>
        <FormattedMessage {...messages.bills} />
        <LinkWrapper to="/payment">
          <SoftWidgetHeaderAction onMouseDown={e => e.stopPropagation()}>
            <SwapVertIcon /> <FormattedMessage {...messages.makeTransferBtn} />
          </SoftWidgetHeaderAction>
        </LinkWrapper>
      </SoftWidgetHeader>
      <Table>
        <TableBody>
          {(availableFunds === 0 || availableFunds) &&
          accountBills &&
          currency ? (
            <TableRow onMouseDown={e => e.stopPropagation()}>
              <TableCellWrapper>
                <TableCellLeftSide>{accountBills}</TableCellLeftSide>
              </TableCellWrapper>
              <TableCellWrapper>
                <TableCellRightSide>
                  <AvailableFundsWrapper>
                    {availableFunds}
                  </AvailableFundsWrapper>{' '}
                  <span>{currency}</span>
                </TableCellRightSide>
              </TableCellWrapper>
            </TableRow>
          ) : (
            <TableRow>
              <TableCellWrapper loading="true">
                <LoadingWrapper>
                  <LoadingCircular />
                </LoadingWrapper>
              </TableCellWrapper>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </SoftWidgetWrapper>
  );
}
