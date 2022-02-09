import React from 'react';
import { FormattedMessage } from 'react-intl';
import useShippingMethodStep from '@magento/peregrine/lib/talons/CheckoutPage/ShippingMethod/useShippingMethodStep';
import ScrollAnchor from '../../ScrollAnchor/scrollAnchor';
import StepCounter from '../StepCounter';
import { useCheckoutStepContext } from '../checkoutSteps';
import ShippingMethod from './shippingMethod';

const ShippingInformationStep = (props) => {
    const {
        isUpdating,
        setIsUpdating,
        stepKey
    } = props;

    const {
        setStepVisibility,
        handleNextStep,
        isStepVisited
    } = useCheckoutStepContext();

    const {
        handleDone,
        handleSuccess,
        shippingMethodRef
    } = useShippingMethodStep({
        stepKey,
        setStepVisibility,
        handleNextStep
    });

    const shippingMethodContent = isStepVisited(stepKey) ? (
        <ShippingMethod
            pageIsUpdating={isUpdating}
            onSave={handleDone}
            onSuccess={handleSuccess}
            setPageIsUpdating={setIsUpdating}
        />
    ) : null;

    return (
        <ScrollAnchor ref={shippingMethodRef}>
            <h3 style={{ fontWeight: 600, textTransform: 'uppercase' }}>
                <StepCounter stepKey={stepKey} />
                <FormattedMessage
                    id={'checkoutPage.shippingMethodStep'}
                    defaultMessage={'Shipping Method'}
                />
            </h3>
            {shippingMethodContent}
        </ScrollAnchor>
    );
};

export default ShippingInformationStep;
