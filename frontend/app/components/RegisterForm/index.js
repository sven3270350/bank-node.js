/**
 *
 * RegisterForm
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import {
  makeIsLoadingSelector,
  makeNameSelector,
  makePasswordSelector,
  makeLoginSelector,
  makeSurnameSelector,
  makeEmailSelector,
  makeErrorSelector,
  makeCurrencySelector,
  makeCurrencyIdSelector,
  makeIsDataProcessingAgreementSelector,
  makeErrorDataProcessingAgreementSelector,
  makeActiveStepSelector,
} from 'containers/RegisterPage/selectors';
import {
  stepBackAction,
  changeLoginAction,
  changePasswordAction,
  enterLoginAction,
  enterPasswordAction,
  changeNameAction,
  enterNameAction,
  changeSurnameAction,
  enterSurnameAction,
  changeEmailAction,
  enterEmailAction,
  toggleDataProcessingAgreementAction,
  enterCurrencyAction,
} from 'containers/RegisterPage/actions';

// Import Components
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormWrapper from 'components/FormWrapper';
import LabelWrapper from 'components/LabelWrapper';
import InputWrapper from 'components/InputWrapper';
import StepperWrapper from 'components/StepperWrapper';
import ButtonWrapper from 'components/ButtonWrapper';
import ButtonBackWrapper from 'components/ButtonBackWrapper';
import NavigateNextIcon from 'components/NavigateNextIcon';
import NavigateBackIcon from 'components/NavigateBackIcon';
import StepperDesktop from 'components/StepperDesktop';
import StepperMobile from 'components/StepperMobile';
import CurrencyToggle from 'components/CurrencyToggle';
import InformationWrapper from './InformationWrapper';
import CheckboxWrapper from './CheckboxWrapper';
import TextWrapper from './TextWrapper';
import messages from './messages';

function RegisterForm({
  login,
  password,
  name,
  surname,
  email,
  error,
  currencyId,
  isDataProcessingAgreement,
  errorDataProcessingAgreement,
  isLoading,
  activeStep,
  onChangeLogin,
  onEnterLogin,
  onChangePassword,
  onEnterPassword,
  onChangeName,
  onEnterName,
  onChangeSurname,
  onEnterSurname,
  onChangeEmail,
  onEnterEmail,
  toggleDataProcessingAgreement,
  onEnterCurrency,
  handleKeyDown,
  handleKeyPress,
  handleStepBack,
}) {
  const steps = getSteps();

  return (
    <FormWrapper>
      <StepperWrapper>
        <StepperDesktop activeStep={activeStep}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </StepperDesktop>

        <StepperMobile
          variant="dots"
          steps={steps.length}
          position="static"
          activeStep={activeStep}
        />
      </StepperWrapper>

      <form noValidate autoComplete="off">
        {activeStep === 0 && (
          <Fragment>
            <LabelWrapper>
              <FormattedMessage {...messages.idNumber} />
            </LabelWrapper>

            <FormattedMessage {...messages.inputNumber}>
              {placeholder => (
                <InputWrapper
                  key={1}
                  placeholder={placeholder}
                  type="number"
                  max="20"
                  value={login || ''}
                  error={error}
                  onChange={onChangeLogin}
                  onKeyDown={handleKeyDown}
                  onKeyPress={handleKeyPress}
                />
              )}
            </FormattedMessage>

            {error && <LabelWrapper error={error}>{error}</LabelWrapper>}

            <ButtonWrapper
              type="button"
              onClick={() => onEnterLogin(login)}
              disabled={isLoading}
            >
              <FormattedMessage {...messages.nextText} />
              <NavigateNextIcon />
            </ButtonWrapper>
          </Fragment>
        )}

        {activeStep === 1 && (
          <Fragment>
            <LabelWrapper>
              <FormattedMessage {...messages.password} />
            </LabelWrapper>

            <FormattedMessage {...messages.inputPassword}>
              {placeholder => (
                <InputWrapper
                  key={2}
                  placeholder={placeholder}
                  type="password"
                  value={password || ''}
                  error={error}
                  onChange={onChangePassword}
                  onKeyDown={handleKeyDown}
                />
              )}
            </FormattedMessage>

            {error && <LabelWrapper error={error}>{error}</LabelWrapper>}

            <ButtonWrapper
              type="button"
              onClick={() => onEnterPassword(password)}
              disabled={isLoading}
            >
              <FormattedMessage {...messages.nextText} />
              <NavigateNextIcon />
            </ButtonWrapper>
          </Fragment>
        )}

        {activeStep === 2 && (
          <Fragment>
            <LabelWrapper>
              <FormattedMessage {...messages.name} />
            </LabelWrapper>

            <FormattedMessage {...messages.inputName}>
              {placeholder => (
                <InputWrapper
                  key={3}
                  placeholder={placeholder}
                  type="text"
                  value={name || ''}
                  error={error}
                  onChange={onChangeName}
                  onKeyDown={handleKeyDown}
                />
              )}
            </FormattedMessage>

            {error && <LabelWrapper error={error}>{error}</LabelWrapper>}

            <ButtonWrapper
              type="button"
              onClick={() => onEnterName(name)}
              disabled={isLoading}
            >
              <FormattedMessage {...messages.nextText} />
              <NavigateNextIcon />
            </ButtonWrapper>
          </Fragment>
        )}

        {activeStep === 3 && (
          <Fragment>
            <LabelWrapper>
              <FormattedMessage {...messages.surname} />
            </LabelWrapper>

            <FormattedMessage {...messages.inputSurname}>
              {placeholder => (
                <InputWrapper
                  key={4}
                  placeholder={placeholder}
                  type="text"
                  value={surname || ''}
                  error={error}
                  onChange={onChangeSurname}
                  onKeyDown={handleKeyDown}
                />
              )}
            </FormattedMessage>

            {error && <LabelWrapper error={error}>{error}</LabelWrapper>}

            <ButtonWrapper
              type="button"
              onClick={() => onEnterSurname(surname)}
              disabled={isLoading}
            >
              <FormattedMessage {...messages.nextText} />
              <NavigateNextIcon />
            </ButtonWrapper>
          </Fragment>
        )}

        {activeStep === 4 && (
          <Fragment>
            <LabelWrapper>
              <FormattedMessage {...messages.currency} />
            </LabelWrapper>
            <CurrencyToggle />

            {error && <LabelWrapper error={error}>{error}</LabelWrapper>}

            <ButtonWrapper
              type="button"
              onClick={() => onEnterCurrency(currencyId)}
              disabled={isLoading}
            >
              <FormattedMessage {...messages.nextText} />
              <NavigateNextIcon />
            </ButtonWrapper>
          </Fragment>
        )}

        {activeStep === 5 && (
          <Fragment>
            <LabelWrapper>
              <FormattedMessage {...messages.emailAddress} />
            </LabelWrapper>

            <FormattedMessage {...messages.inputEmail}>
              {placeholder => (
                <InputWrapper
                  key={5}
                  placeholder={placeholder}
                  type="text"
                  value={email || ''}
                  error={error}
                  onChange={onChangeEmail}
                  onKeyDown={handleKeyDown}
                />
              )}
            </FormattedMessage>

            {error && <LabelWrapper error={error}>{error}</LabelWrapper>}

            <CheckboxWrapper>
              <Checkbox
                checked={isDataProcessingAgreement}
                onClick={toggleDataProcessingAgreement}
                color="primary"
              />

              <TextWrapper>
                <FormattedMessage {...messages.checkboxRodo} />
              </TextWrapper>
            </CheckboxWrapper>

            {errorDataProcessingAgreement && (
              <LabelWrapper error={errorDataProcessingAgreement}>
                {errorDataProcessingAgreement}
              </LabelWrapper>
            )}

            <InformationWrapper>
              <FormattedMessage {...messages.textEmailNeed} />
            </InformationWrapper>

            <ButtonWrapper
              type="button"
              onClick={() => onEnterEmail(email)}
              disabled={isLoading}
            >
              <FormattedMessage {...messages.createAnAccount} />
            </ButtonWrapper>
          </Fragment>
        )}

        {activeStep !== 0 && steps.length - 1 && (
          <ButtonBackWrapper
            type="button"
            onClick={handleStepBack}
            disabled={isLoading}
          >
            <NavigateBackIcon />
            <FormattedMessage {...messages.backText} />
          </ButtonBackWrapper>
        )}
      </form>
    </FormWrapper>
  );
}

function getSteps() {
  return [
    <FormattedMessage {...messages.idNumber} />,
    <FormattedMessage {...messages.password} />,
    <FormattedMessage {...messages.name} />,
    <FormattedMessage {...messages.surname} />,
    <FormattedMessage {...messages.currency} />,
    <FormattedMessage {...messages.emailAddress} />,
  ];
}

RegisterForm.propTypes = {
  login: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  password: PropTypes.string,
  name: PropTypes.string,
  surname: PropTypes.string,
  email: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  currency: PropTypes.array,
  currencyId: PropTypes.number,
  isDataProcessingAgreement: PropTypes.bool,
  errorDataProcessingAgreement: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  isLoading: PropTypes.bool,
  activeStep: PropTypes.number,
  onChangeLogin: PropTypes.func,
  onEnterLogin: PropTypes.func,
  onChangePassword: PropTypes.func,
  onEnterPassword: PropTypes.func,
  onChangeName: PropTypes.func,
  onEnterName: PropTypes.func,
  onChangeSurname: PropTypes.func,
  onEnterSurname: PropTypes.func,
  onChangeEmail: PropTypes.func,
  onEnterEmail: PropTypes.func,
  toggleDataProcessingAgreement: PropTypes.func,
  onEnterCurrency: PropTypes.func,
  handleStepBack: PropTypes.func,
  handleKeyPress: PropTypes.func,
  handleKeyDown: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  login: makeLoginSelector(),
  password: makePasswordSelector(),
  name: makeNameSelector(),
  surname: makeSurnameSelector(),
  email: makeEmailSelector(),
  error: makeErrorSelector(),
  currency: makeCurrencySelector(),
  currencyId: makeCurrencyIdSelector(),
  isDataProcessingAgreement: makeIsDataProcessingAgreementSelector(),
  errorDataProcessingAgreement: makeErrorDataProcessingAgreementSelector(),
  isLoading: makeIsLoadingSelector(),
  activeStep: makeActiveStepSelector(),
});

function mapDispatchToProps(dispatch) {
  return {
    onChangeLogin: e =>
      dispatch(changeLoginAction(parseInt(e.target.value, 10))),
    onEnterLogin: login => dispatch(enterLoginAction(parseInt(login, 10))),
    onChangePassword: e => dispatch(changePasswordAction(e.target.value)),
    onEnterPassword: password => dispatch(enterPasswordAction(password)),
    onChangeName: e => dispatch(changeNameAction(e.target.value)),
    onEnterName: name => dispatch(enterNameAction(name)),
    onChangeSurname: e => dispatch(changeSurnameAction(e.target.value)),
    onEnterSurname: surname => dispatch(enterSurnameAction(surname)),
    onChangeEmail: e => dispatch(changeEmailAction(e.target.value)),
    onEnterEmail: email => dispatch(enterEmailAction(email)),
    toggleDataProcessingAgreement: () =>
      dispatch(toggleDataProcessingAgreementAction()),
    onEnterCurrency: currencyId => dispatch(enterCurrencyAction(currencyId)),
    handleStepBack: () => dispatch(stepBackAction()),
    handleKeyPress: e => (e.key === 'E' || e.key === 'e') && e.preventDefault(),
    handleKeyDown: e => e.keyCode === 13 && e.preventDefault(),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(RegisterForm);
