import React, { createContext, useContext } from 'react';
import useCheckoutSteps from '@magento/peregrine/lib/talons/CheckoutPage/useCheckoutSteps';
import { steps } from './steps';

const CheckoutStepContext = createContext();

const CheckoutSteps = (props) => {
    const contextValues = useCheckoutSteps({ steps });

    return (
        <CheckoutStepContext.Provider value={contextValues}>
            {props.children}
        </CheckoutStepContext.Provider>
    )
};

export default CheckoutSteps;

export const useCheckoutStepContext = () => useContext(CheckoutStepContext);
