import { useEffect, useCallback, useRef } from 'react';

const VIRTUAL_TYPES = ['VirtualCartItem'];

export default (props) => {
    const {
        setStepVisibility,
        handleNextStep,
        stepKey,
        cartItems
    } = props;

    const shouldDisplayStep = useRef(true);
    const shippingInformationRef = useRef();

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
        shouldDisplay: shouldDisplayStep.current
    };
}
