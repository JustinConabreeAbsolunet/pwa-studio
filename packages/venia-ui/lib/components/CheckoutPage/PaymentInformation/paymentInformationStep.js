import React, { Fragment, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import usePaymentInformationStep from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentInformationStep';
import StepCounter from '../StepCounter';
import { useCheckoutStepContext } from '../checkoutSteps';
import PaymentInformation from './paymentInformation';

const ShippingInformationStep = (props) => {
    const {
        error,
        resetReviewOrderButtonClicked,
        reviewOrderButtonClicked,
        stepKey,
        classes
    } = props;

    const stepContext = useCheckoutStepContext();

    const {
        currentStepKey,
        setStepVisibility,
        handleNextStep,
        setCurrentStepKey,
        getContinueText,
        loading
    } = stepContext;

    const {
        handleDone,
        resetPaymentStep,
        shouldDisplay,
        continueText
    } = usePaymentInformationStep({
        stepKey,
        setStepVisibility,
        handleNextStep,
        setCurrentStepKey,
        getContinueText,
        loading
    });

    useEffect(() => {
        setStepVisibility(stepKey, shouldDisplay);
    }, [shouldDisplay]);

    if (loading) {
        return null;
    }

    if (!shouldDisplay) {
        return null;
    }

    const paymentInformationHeader = currentStepKey !== stepKey ? (
        <h3 style={{ fontWeight: 600, textTransform: 'uppercase' }}>
            <StepCounter stepKey={stepKey} />
            <FormattedMessage
                id={'checkoutPage.paymentInformationStep'}
                defaultMessage={'Payment Information'}
            />
        </h3>
    ) : null;

    const paymentInformationContent = currentStepKey === stepKey ? (
        <PaymentInformation
            onSave={handleDone}
            checkoutError={error}
            resetShouldSubmit={resetReviewOrderButtonClicked}
            resetPaymentStep={resetPaymentStep}
            shouldSubmit={reviewOrderButtonClicked}
            continueText={continueText}
        />
    ) : null;

    return (
        <div className={classes.payment_information_container}>
            {paymentInformationHeader}
            {paymentInformationContent}
        </div>
    );
};

export default ShippingInformationStep;
