import { useEffect, useCallback, useRef, useMemo } from 'react';

const VIRTUAL_TYPES = ['VirtualCartItem'];

export default (props) => {
    const {
        getContinueText,
        handleNextStep,
        stepKey,
        cartItems,
        loading
    } = props;

    const shouldDisplayStep = useRef(true);
    const shippingInformationRef = useRef();

    const continueText = useMemo(() => {
        if (loading) {
            return null;
        }

        return getContinueText(stepKey);
    }, [getContinueText, loading]);

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

    useEffect(() => {
        shouldDisplayStep.current = !cartItems.every((cartItem) => {
            return VIRTUAL_TYPES.includes(cartItem.__typename);
        });
    }, [cartItems]);

    return {
        shippingInformationRef,
        handleDone,
        handleSuccess,
        continueText,
        shouldDisplay: shouldDisplayStep.current
    };
}
