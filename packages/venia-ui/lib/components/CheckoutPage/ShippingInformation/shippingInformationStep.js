import React, { Fragment, useEffect } from 'react';
import { useCheckoutStepContext } from '../checkoutSteps';
import ShippingInformation from './shippingInformation';
import { FormattedMessage } from 'react-intl';

const ShippingInformationStep = (props) => {
    const {
        setShippingInformationDone,
        scrollShippingInformationIntoView,
        toggleAddressBookContent,
        toggleSignInContent,
        setGuestSignInUsername,
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
        <Fragment>
            <h3 style={{ fontWeight: 600, textTransform: 'uppercase' }}>
                {stepLoading ? null : getStepIndex(stepKey) + 1}
                <FormattedMessage
                    id={'shippingInformation.editTitle'}
                    defaultMessage={'Shipping Information'}
                />
            </h3>
            <ShippingInformation
                onSave={setShippingInformationDone}
                onSuccess={scrollShippingInformationIntoView}
                toggleActiveContent={toggleAddressBookContent}
                toggleSignInContent={toggleSignInContent}
                setGuestSignInUsername={setGuestSignInUsername}
            />
        </Fragment>
    ) : (
        <h3 style={{ fontWeight: 600, textTransform: 'uppercase' }}>
            {stepLoading ? null : getStepIndex(stepKey) + 1}
            <FormattedMessage
                id={'shippingInformation.editTitle'}
                defaultMessage={'Shipping Information'}
            />
        </h3>
    );
};

export default ShippingInformationStep;
