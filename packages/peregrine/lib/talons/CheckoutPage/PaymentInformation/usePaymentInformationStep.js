import { useEffect, useCallback } from 'react';

export default (props) => {
    const {
        setStepVisibility,
        handleNextStep,
        stepKey,
        setCurrentStepKey
    } = props;

    useEffect(() => {
        setStepVisibility(stepKey, true);
    }, [setStepVisibility]);

    const handleDone = useCallback(() => {
        globalThis.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });
        handleNextStep(stepKey);
    }, [handleNextStep]);

    const resetPaymentStep = useCallback(() => {
        setCurrentStepKey('PAYMENT');
    }, [setCurrentStepKey]);

    return {
        handleDone,
        resetPaymentStep,
        shouldDisplay: true
    };
}
