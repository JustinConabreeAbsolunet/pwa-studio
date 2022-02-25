import { useEffect, useCallback, useMemo, useState } from 'react';

export default (props) => {
    const {
        getContinueText,
        handleNextStep,
        stepKey,
        setCurrentStepKey,
        loading,
        currentStepKey,
        isOnLastStep,
        reviewOrderButtonClicked,
        resetReviewOrderButtonClicked
    } = props;

    const [shouldSubmitPayment, setShouldSubmitPayment] = useState(reviewOrderButtonClicked);

    const continueText = useMemo(() => {
        if (loading) {
            return null;
        }

        return getContinueText(stepKey);
    }, [loading, getContinueText]);

    const shouldDisplayContinueButton = useMemo(() => {
        return continueText !== null && currentStepKey === stepKey;
    }, [continueText, currentStepKey])

    const handleContinueClick = useCallback(() => {
        setShouldSubmitPayment(true);
    }, []);

    const handleDone = useCallback(() => {
        globalThis.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });
        handleNextStep(stepKey);
    }, [handleNextStep]);

    const resetShouldSubmitPayment = useCallback(() => {
        if (currentStepKey !== stepKey) {
            return;
        }

        if (isOnLastStep) {
            resetReviewOrderButtonClicked();

            return;
        }

        setShouldSubmitPayment(false);
    }, [currentStepKey, resetReviewOrderButtonClicked]);

    const resetPaymentStep = useCallback(() => {
        setCurrentStepKey('PAYMENT');
    }, [setCurrentStepKey]);

    useEffect(() => {
        console.log('should submit changed', reviewOrderButtonClicked);
        setShouldSubmitPayment(reviewOrderButtonClicked);
    }, [reviewOrderButtonClicked]);

    return {
        handleDone,
        resetPaymentStep,
        continueText,
        shouldSubmitPayment,
        resetShouldSubmitPayment,
        handleContinueClick,
        shouldDisplayContinueButton,
        shouldDisplay: true
    };
}
