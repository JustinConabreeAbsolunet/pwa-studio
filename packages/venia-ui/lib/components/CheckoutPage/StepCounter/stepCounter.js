import React from 'react';
import useStepCounter from '@magento/peregrine/lib/talons/CheckoutPage/StepCounter/useStepCounter';
import { useCheckoutStepContext } from '../checkoutSteps';
import Shimmer from './stepCounter.shimmer';

const StepCounter = (props) => {
    const { stepKey } = props;
    const stepsContext = useCheckoutStepContext();
    const {
        loading,
        stepNumber
    } = useStepCounter({
        ...stepsContext,
        stepKey
    });

    if (loading) {
        return <Shimmer />;
    }

    return (
        <span>{stepNumber}.&nbsp;</span>
    );
};

export default StepCounter;
