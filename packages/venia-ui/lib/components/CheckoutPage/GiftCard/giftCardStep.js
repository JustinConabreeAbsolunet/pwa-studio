import React, { Fragment, useEffect, useState } from 'react';
import { useCheckoutStepContext } from '../checkoutSteps';
import { FormattedMessage } from 'react-intl';

const GiftCartStep = (props) => {
    const {
        stepKey
    } = props;

    const {
        loading: stepLoading,
        currentStepKey,
        setStepVisibility,
        getStepIndex
    } = useCheckoutStepContext();

    const [isVisible, setVisible] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setVisible(false);
            setStepVisibility(stepKey, false);
        }, 2500)
    }, []);

    const isActive = currentStepKey === stepKey;

    if (stepLoading || !isVisible) {
        return null;
    }

    return isActive ? (
        <Fragment>
            <h3 style={{ fontWeight: 600, textTransform: 'uppercase' }}>
                {stepLoading ? null : getStepIndex(stepKey) + 1}
                <FormattedMessage
                    id={'checkoutPage.giftCardStep'}
                    defaultMessage={'Gift Card Step'}
                />
            </h3>
            <div>Gift Card Active</div>
        </Fragment>
    ) : (
        <h3 style={{ fontWeight: 600, textTransform: 'uppercase' }}>
            {stepLoading ? null : getStepIndex(stepKey) + 1}
            <FormattedMessage
                id={'checkoutPage.giftCardStep'}
                defaultMessage={'Gift Card Step'}
            />
        </h3>
    );
};

export default GiftCartStep;
