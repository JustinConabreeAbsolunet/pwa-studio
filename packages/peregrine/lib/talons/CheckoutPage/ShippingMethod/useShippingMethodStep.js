import { useEffect, useCallback, useRef } from 'react';

export default (props) => {
    const {
        setStepVisibility,
        handleNextStep,
        stepKey
    } = props;

    const shippingMethodRef = useRef();

    useEffect(() => {
        setStepVisibility(stepKey, true);
    }, [setStepVisibility]);

    const handleDone = useCallback(() => {
        handleNextStep();
    }, [handleNextStep]);

    const handleSuccess = useCallback(() => {
        if (shippingMethodRef.current) {
            shippingMethodRef.current.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }, [shippingMethodRef]);

    return {
        shippingMethodRef,
        handleDone,
        handleSuccess
    };
}
