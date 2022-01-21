import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import useShippingInformationStep from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/useShippingInformationStep';
import ScrollAnchor from '../../ScrollAnchor/scrollAnchor';
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
        loading: stepLoading,
        currentStepKey,
        setStepVisibility,
        getStepIndex,
        handleNextStep
    } = useCheckoutStepContext();

    const {
        handleDone,
        handleSuccess,
        shippingInformationRef
    } = useShippingInformationStep({
        stepKey,
        setStepVisibility,
        handleNextStep
    });

    const shippingInformationContent = currentStepKey === stepKey ? (
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
                {stepLoading ? null : getStepIndex(stepKey) + 1}
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
