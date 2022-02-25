import {useEffect, useCallback, useRef, useMemo, useState} from 'react';

const VIRTUAL_TYPES = ['VirtualCartItem'];

export default (props) => {
    const {
        getContinueText,
        handleNextStep,
        stepKey,
        cartItems,
        loading,
        isOnLastStep,
        reviewOrderButtonClicked,
        resetReviewOrderButtonClicked,
        currentStepKey
    } = props;

    const shouldDisplayStep = useRef(true);
    const shippingInformationRef = useRef();
    const [shouldSubmitShippingInfo, setShouldSubmitShippingInfo] = useState(false);

    const continueText = useMemo(() => {
        if (loading) {
            return null;
        }

        return getContinueText(stepKey);
    }, [getContinueText, loading]);

    const shouldDisplayContinueButton = useMemo(() => {
        return continueText !== null && currentStepKey === stepKey;
    }, [continueText, currentStepKey])

    const handleDone = useCallback(() => {
        handleNextStep(stepKey);
    }, [handleNextStep]);

    const handleSuccess = useCallback(() => {
        if (shippingInformationRef.current) {
            shippingInformationRef.current.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }, [shippingInformationRef]);

    const resetShouldSubmitShippingInfo = useCallback(() => {
        setShouldSubmitShippingInfo(false);

        if (currentStepKey !== stepKey) {
            return;
        }

        if (isOnLastStep) {
            resetReviewOrderButtonClicked();

            return;
        }
    }, [currentStepKey, resetReviewOrderButtonClicked]);

    useEffect(() => {
        shouldDisplayStep.current = !cartItems.every((cartItem) => {
            return VIRTUAL_TYPES.includes(cartItem.__typename);
        });
    }, [cartItems]);

    useEffect(() => {
        if (currentStepKey !== stepKey) {
            return;
        }

        setShouldSubmitShippingInfo(reviewOrderButtonClicked);
    }, [reviewOrderButtonClicked]);

    return {
        shippingInformationRef,
        handleDone,
        handleSuccess,
        continueText,
        shouldSubmitShippingInfo,
        resetShouldSubmitShippingInfo,
        shouldDisplayContinueButton,
        shouldDisplay: shouldDisplayStep.current
    };
}
