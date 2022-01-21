import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import usePaymentInformationStep from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentInformationStep';
import { useCheckoutStepContext } from '../checkoutSteps';
import PaymentInformation from './paymentInformation';

const ShippingInformationStep = (props) => {
    const {
        error,
        resetReviewOrderButtonClicked,
        reviewOrderButtonClicked,
        stepKey
    } = props;

    const stepContext = useCheckoutStepContext();
    console.log('payment infor step context', stepContext);
    const {
        loading: stepLoading,
        currentStepKey,
        setStepVisibility,
        getStepIndex,
        handleNextStep,
        setCurrentStepKey
    } = stepContext;

    console.log('in payment info step', setCurrentStepKey);

    const {
        handleDone,
        resetPaymentStep
    } = usePaymentInformationStep({
        stepKey,
        setStepVisibility,
        handleNextStep,
        setCurrentStepKey
    });

    const paymentInformationContent = currentStepKey === stepKey ? (
        <PaymentInformation
            onSave={handleDone}
            checkoutError={error}
            resetShouldSubmit={resetReviewOrderButtonClicked}
            resetPaymentStep={resetPaymentStep}
            shouldSubmit={reviewOrderButtonClicked}
        />
    ) : null;

    return (
        <Fragment>
            <h3 style={{ fontWeight: 600, textTransform: 'uppercase' }}>
                {stepLoading ? null : getStepIndex(stepKey) + 1}
                <FormattedMessage
                    id={'checkoutPage.paymentInformationStep'}
                    defaultMessage={'Payment Information'}
                />
            </h3>
            {paymentInformationContent}
        </Fragment>
    );
};

export default ShippingInformationStep;
