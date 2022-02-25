import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import useShippingMethodStep from '@magento/peregrine/lib/talons/CheckoutPage/ShippingMethod/useShippingMethodStep';
import ScrollAnchor from '../../ScrollAnchor/scrollAnchor';
import StepCounter from '../StepCounter';
import { useCheckoutStepContext } from '../checkoutSteps';
import ShippingMethod from './shippingMethod';

const ShippingMethodStep = (props) => {
    const {
        isUpdating,
        setIsUpdating,
        stepKey,
        cartItems,
        classes
    } = props;

    const {
        setStepVisibility,
        handleNextStep,
        isStepVisited,
        isStepPassed,
        getContinueText,
        loading
    } = useCheckoutStepContext();

    const {
        handleDone,
        handleSuccess,
        shippingMethodRef,
        shouldDisplay,
        continueText
    } = useShippingMethodStep({
        stepKey,
        setStepVisibility,
        handleNextStep,
        cartItems,
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

    const shippingMethodHeader = !isStepPassed(stepKey) ? (
        <h3 style={{ fontWeight: 600, textTransform: 'uppercase' }}>
            <StepCounter stepKey={stepKey} />
            <FormattedMessage
                id={'checkoutPage.shippingMethodStep'}
                defaultMessage={'Shipping Method'}
            />
        </h3>
    ) : null;

    const shippingMethodContent = isStepVisited(stepKey) ? (
        <ShippingMethod
            pageIsUpdating={isUpdating}
            onSave={handleDone}
            onSuccess={handleSuccess}
            setPageIsUpdating={setIsUpdating}
            continueText={continueText}
        />
    ) : null;

    return (
        <div className={classes.shipping_method_container}>
            <ScrollAnchor ref={shippingMethodRef}>
                {shippingMethodHeader}
                {shippingMethodContent}
            </ScrollAnchor>
        </div>
    );
};

export default ShippingMethodStep;
