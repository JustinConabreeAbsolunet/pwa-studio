import React, { useEffect } from 'react';
import { useCheckoutStepContext } from '../checkoutSteps';
import ShippingMethod from './shippingMethod';
import { FormattedMessage } from 'react-intl';

const ShippingInformationStep = (props) => {
    const {
        isUpdating,
        setShippingMethodDone,
        scrollShippingMethodIntoView,
        setIsUpdating,
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
        <ShippingMethod
            pageIsUpdating={isUpdating}
            onSave={setShippingMethodDone}
            onSuccess={scrollShippingMethodIntoView}
            setPageIsUpdating={setIsUpdating}
        />
    ) : (
        <h3 style={{ fontWeight: 600, textTransform: 'uppercase' }}>
            {stepLoading ? null : getStepIndex(stepKey) + 1}
            <FormattedMessage
                id={'checkoutPage.shippingMethodStep'}
                defaultMessage={'Shipping Method'}
            />
        </h3>
    );
};

export default ShippingInformationStep;
