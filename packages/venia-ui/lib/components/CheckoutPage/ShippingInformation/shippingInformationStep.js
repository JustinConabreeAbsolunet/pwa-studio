import React, { Fragment, useEffect } from 'react';
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
        shippingInformationRef,
        shouldDisplay,
        continueText
    } = useShippingInformationStep({
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

    const shippingInformationHeader = !isStepPassed(stepKey) ? (
        <h3 style={{ fontWeight: 600, textTransform: 'uppercase' }}>
            <StepCounter stepKey={stepKey} />
            <FormattedMessage
                id={'shippingInformation.editTitle'}
                defaultMessage={'Shipping Information'}
            />
        </h3>
    ) : null;

    const shippingInformationContent = isStepVisited(stepKey) ? (
        <ShippingInformation
            stepKey={stepKey}
            onSave={handleDone}
            onSuccess={handleSuccess}
            toggleActiveContent={toggleAddressBookContent}
            toggleSignInContent={toggleSignInContent}
            setGuestSignInUsername={setGuestSignInUsername}
            continueText={continueText}
        />
    ) : null;

    return (
        <div className={classes.shipping_information_container}>
            <ScrollAnchor ref={shippingInformationRef}>
                {shippingInformationHeader}
                {shippingInformationContent}
            </ScrollAnchor>
        </div>
    );
};

export default ShippingInformationStep;
