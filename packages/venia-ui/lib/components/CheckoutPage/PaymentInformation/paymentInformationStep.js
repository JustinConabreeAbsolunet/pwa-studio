import React, { useEffect } from 'react';
import { useCheckoutStepContext } from '../checkoutSteps';
import PaymentInformation from './paymentInformation';
import { FormattedMessage } from 'react-intl';

const ShippingInformationStep = (props) => {
    const {
        setPaymentInformationDone,
        error,
        resetReviewOrderButtonClicked,
        setCheckoutStep,
        reviewOrderButtonClicked,
        stepKey
    } = props;

    const {
        loading: stepLoading,
        currentStepKey,
        setStepVisibility,
        getStepIndex
    } = useCheckoutStepContext();

    useEffect(() => {
        setStepVisibility(stepKey, true);
    }, []);

    const isActive = currentStepKey === stepKey;

    return isActive ? (
        <PaymentInformation
            onSave={setPaymentInformationDone}
            checkoutError={error}
            resetShouldSubmit={resetReviewOrderButtonClicked}
            setCheckoutStep={setCheckoutStep}
            shouldSubmit={reviewOrderButtonClicked}
        />
    ) : (
        <h3 style={{ fontWeight: 600, textTransform: 'uppercase' }}>
            {stepLoading ? null : getStepIndex(stepKey) + 1}
            <FormattedMessage
                id={'checkoutPage.paymentInformationStep'}
                defaultMessage={'Payment Information'}
            />
        </h3>
    );
};

export default ShippingInformationStep;
