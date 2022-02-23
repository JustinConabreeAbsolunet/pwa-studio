import { useEffect, useCallback, useMemo } from 'react';

export default (props) => {
    const {
        getContinueText,
        handleNextStep,
        stepKey,
        setCurrentStepKey,
        loading
    } = props;

    const continueText = useMemo(() => {
        if (loading) {
            return null;
        }

        return getContinueText(stepKey);
    }, [getContinueText]);

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
        continueText,
        shouldDisplay: true
    };
}
