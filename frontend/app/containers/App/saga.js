import { call, put, select, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { format } from 'date-fns';
import differenceInYears from 'date-fns/difference_in_years';

// Import Utils
import request from 'utils/request';
import ApiEndpoint from 'utils/api';

// Import Services
import AuthService from 'services/auth.service';

// Import Selectors
import {
  makeNotificationCountSelector,
  makeMessageCountSelector,
} from 'containers/App/selectors';
import { makeSelectLocale } from 'containers/LanguageProvider/selectors';

// Import Actions
import {
  logoutErrorAction,
  logoutSuccessAction,
  checkNewNotificationsSuccessAction,
  checkNewNotificationsErrorAction,
  checkNewMessagesSuccessAction,
  getNewNotificationsAction,
  getNewNotificationsSuccessAction,
  getNewNotificationsErrorAction,
  unsetNewNotificationsErrorAction,
  unsetNewNotificationsAction,
  unsetNewNotificationsSuccessAction,
  isLoggedSuccessAction,
  isLoggedErroAction,
  checkNewMessagesErrorAction,
  getNewMessagesAction,
  unsetNewMessagesAction,
  unsetNewMessagesSuccessAction,
  unsetNewMessagesErrorAction,
  getNewMessagesSuccessAction,
} from './actions';

// Import Constants
import {
  LOGOUT,
  IS_LOGGED,
  CHECK_NEW_NOTIFICATIONS,
  TOGGLE_NOTIFICATIONS,
  GET_NEW_NOTIFICATIONS,
  CHECK_NEW_MESSAGES,
  GET_NEW_MESSAGES,
  TOGGLE_MESSAGES,
} from './constants';

export function* handleLogout() {
  const auth = new AuthService();
  const api = new ApiEndpoint();
  const token = auth.getToken();
  const requestURL = api.getLogoutPath();

  try {
    const response = yield call(request, requestURL, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const { success } = response;
    if (!success) return yield put(logoutErrorAction('error'));

    yield put(logoutSuccessAction());
    auth.unsetToken();
    yield put(push('/'));
  } catch (error) {
    yield put(logoutErrorAction(error));
    auth.unsetToken();
    yield put(push('/'));
  }
}

export function* handleLogged() {
  const auth = new AuthService();
  const isLogged = auth.loggedIn();

  if (isLogged) return yield put(isLoggedSuccessAction());

  yield put(isLoggedErroAction());
  yield put(logoutErrorAction('error'));
  auth.unsetToken();
  yield put(push('/'));
}

export function* handleNotifications() {
  const auth = new AuthService();
  const api = new ApiEndpoint();
  const token = auth.getToken();
  const requestURL = api.getIsNotificationPath();

  try {
    const response = yield call(request, requestURL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const { isNotification, notificationCount } = response;
    if (!isNotification) return;

    yield put(checkNewNotificationsSuccessAction(notificationCount));
    yield put(getNewNotificationsAction());
  } catch (error) {
    yield put(checkNewNotificationsErrorAction(error));
  }
}

export function* getNewNotifications() {
  const auth = new AuthService();
  const api = new ApiEndpoint();
  const locale = yield select(makeSelectLocale());
  const notificationCount = yield select(makeNotificationCountSelector());
  const requestURL = api.getNotificationsPath(notificationCount);
  const token = auth.getToken();

  try {
    const response = yield call(request, requestURL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const { success, notifications } = response;
    if (!success || !notifications)
      return yield put(getNewNotificationsErrorAction('error'));

    const transformNewNotifications = notifications.map(
      ({ ...newNotification }) => ({
        date_time: format(
          newNotification.transaction_createdDate,
          `DD.MM.YYYY, ${locale === 'en' ? 'hh:mm A' : 'HH:mm'}`,
        ),
        sender_name: `${newNotification.user_name} ${newNotification.user_surname}`,
        amount_money: `${newNotification.transaction_amountMoney
          .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
          .replace('.', ',')} ${newNotification.currency_name}`,
      }),
    );
    yield put(getNewNotificationsSuccessAction(transformNewNotifications));
  } catch (error) {
    yield put(getNewNotificationsErrorAction(error));
  }
}

export function* handleNewNotifications() {
  const auth = new AuthService();
  const api = new ApiEndpoint();
  const token = auth.getToken();
  const requestURL = api.getNotificationsPath();
  const notificationCount = yield select(makeNotificationCountSelector());

  if (!notificationCount) return;

  try {
    yield put(unsetNewNotificationsAction());

    const response = yield call(request, requestURL, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const { success } = response;
    if (!success) return yield put(unsetNewNotificationsErrorAction('error'));

    yield put(unsetNewNotificationsSuccessAction());
  } catch (error) {
    yield put(unsetNewNotificationsErrorAction(error));
  }
}

export function* handleMessages() {
  const auth = new AuthService();
  const api = new ApiEndpoint();
  const token = auth.getToken();
  const requestURL = api.getIsMessagePath();

  try {
    const response = yield call(request, requestURL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const { isMessage, messageCount } = response;
    yield put(checkNewMessagesSuccessAction(messageCount, isMessage));

    yield put(getNewMessagesAction());
  } catch (error) {
    yield put(checkNewMessagesErrorAction(error));
  }
}

export function* handleNewMessages() {
  const auth = new AuthService();
  const api = new ApiEndpoint();
  const token = auth.getToken();
  const requestURL = api.getMessagesPath();
  const messageCount = yield select(makeMessageCountSelector());

  if (!messageCount) return;

  try {
    yield put(unsetNewMessagesAction());

    const response = yield call(request, requestURL, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const { success } = response;
    if (!success) return yield put(unsetNewMessagesErrorAction('error'));

    yield put(unsetNewMessagesSuccessAction());
  } catch (error) {
    yield put(unsetNewMessagesErrorAction(error));
  }
}

export function* getNewMessages() {
  const locale = yield select(makeSelectLocale());
  const auth = new AuthService();
  const userId = auth.getUserId();

  const message = [
    {
      senderName: 'Adrian Pietrzak',
      createdDate: format(
        new Date(),
        `DD.MM.YYYY, ${locale === 'en' ? 'hh:mm A' : 'HH:mm'}`,
      ),
      userId,
      authorYo: differenceInYears(new Date(), new Date(1997, 9, 16)),
    },
  ];

  return yield put(getNewMessagesSuccessAction(message));
}

export default function* appPageSaga() {
  yield takeLatest(LOGOUT, handleLogout);
  yield takeLatest(IS_LOGGED, handleLogged);
  yield takeLatest(CHECK_NEW_NOTIFICATIONS, handleNotifications);
  yield takeLatest(CHECK_NEW_MESSAGES, handleMessages);
  yield takeLatest(GET_NEW_NOTIFICATIONS, getNewNotifications);
  yield takeLatest(GET_NEW_MESSAGES, getNewMessages);
  yield takeLatest(TOGGLE_NOTIFICATIONS, handleNewNotifications);
  yield takeLatest(TOGGLE_MESSAGES, handleNewMessages);
}
