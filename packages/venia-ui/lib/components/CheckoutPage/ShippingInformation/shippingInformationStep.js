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
        classes,
        reviewOrderButtonClicked,
        resetReviewOrderButtonClicked
    } = props;

    const {
        steps,
        setStepVisibility,
        handleNextStep,
        isStepVisited,
        isStepPassed,
        isOnLastStep,
        getContinueText,
        loading,
        currentStepKey
    } = useCheckoutStepContext();

    const {
        handleDone,
        handleSuccess,
        shippingInformationRef,
        shouldDisplay,
        continueText,
        shouldSubmitShippingInfo,
        resetShouldSubmitShippingInfo,
        shouldDisplayContinueButton
    } = useShippingInformationStep({
        stepKey,
        setStepVisibility,
        handleNextStep,
        cartItems,
        getContinueText,
        loading,
        isOnLastStep,
        reviewOrderButtonClicked,
        resetReviewOrderButtonClicked,
        currentStepKey,
        steps
    });

    useEffect(() => {
        if (shouldDisplay !== null) {
            setStepVisibility(stepKey, shouldDisplay);
        }
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
            shouldSubmitShippingInfo={shouldSubmitShippingInfo}
            resetShouldSubmitShippingInfo={resetShouldSubmitShippingInfo}
            shouldDisplayContinueButton={shouldDisplayContinueButton}
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
