import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import useShippingInformationStep from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/useShippingInformationStep';
import ScrollAnchor from '../../ScrollAnchor/scrollAnchor';
import StepCounter from '../StepCounter';
import { useCheckoutStepContext } from '../checkoutSteps';
import ShippingInformation from './shippingInformation';

const ShippingInformationStep = (props) => {
    const {
        toggleAddressBookContent,
        toggleSignInContent,
        setGuestSignInUsername,
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
        shippingInformationRef,
        shouldDisplay
    } = useShippingInformationStep({
        stepKey,
        setStepVisibility,
        handleNextStep
    });

    if (!shouldDisplay) {
        return null;
    }

    const shippingInformationContent = isStepVisited(stepKey) ? (
        <ShippingInformation
            stepKey={stepKey}
            onSave={handleDone}
            onSuccess={handleSuccess}
            toggleActiveContent={toggleAddressBookContent}
            toggleSignInContent={toggleSignInContent}
            setGuestSignInUsername={setGuestSignInUsername}
        />
    ) : null;

    return (
        <ScrollAnchor ref={shippingInformationRef}>
            <h3 style={{ fontWeight: 600, textTransform: 'uppercase' }}>
                <StepCounter stepKey={stepKey} />
                <FormattedMessage
                    id={'shippingInformation.editTitle'}
                    defaultMessage={'Shipping Information'}
                />
            </h3>
            {shippingInformationContent}
        </ScrollAnchor>
    );
};

export default ShippingInformationStep;
