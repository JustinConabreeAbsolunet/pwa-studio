# Checkout Step Extensibility
Steps are now extensible and come with a context provider

## Accessing step context
Step information is available as a context so it can be used by any component, not only the steps themselves. In fact, each step should the context for its information.
This is useful for components like the step counter which needs to react only to the visible steps.
```jsx
import { useCheckoutStepContext } from '@magento/venia-ui/lib/components/CheckoutPage/checkoutSteps';

const MyComponent = () => {
  const stepsContext = useCheckoutStepContext();
  
  const {
    loading,
    currentStepKey,
    steps,
    getStepIndex,
    getCurrentStepIndex,
    setStepVisibility,
    setCurrentStepKey,
    goToLastStep,
    handleNextStep,
    resetAllSteps,
    resetStepLoading,
    isStepVisited,
    isStepPassed,
    isOnLastStep,
    getContinueText
  } = stepsContext;
}
```
Type information is available in `@magento/peregrine/lib/talons/CheckoutPage/useCheckoutSteps.js`

## Adding a step
Example through targetables
```jsx
const { checkoutSteps } = targets.of('@magento/venia-ui');
checkoutSteps.tap(target => {
    target.add({
      key: 'TERMS_AND_CONDITIONS',
      after: 'PAYMENT',
      stepTitle: {
        id: 'checkoutPage.termsAndConditionsCta',
        defaultMessage: 'Continue to Terms and Conditions'
      },
      importPath:
        'src/components/CheckoutPage/TermsAndConditions/termsAndConditionsStep'
    });
});
```
Notes:
- A new step can be placed **before** or **after** another step by using the respective term and specifying the target's `key`. In this example we are placing a
step after the Payment Information step by specifying `after: 'PAYMENT'`. This new Terms and Conditions step is now the last step in the checkout
- The step title information is used for the button text of the previous step

## Basic step structure
In this example, we'll add a Terms and Conditions step to the end of the checkout

#### The step component
The step component takes care of calling the hook, handling when it should or should not display, and rendering the subcomponent along with the step's title.
```jsx
/** src/components/CheckoutPage/TermsAndConditions/termsAndConditionsStep.js **/

import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import StepCounter from '@magento/venia-ui/lib/components/CheckoutPage/StepCounter';
import { useCheckoutStepContext } from '@magento/venia-ui/lib/components/CheckoutPage/checkoutSteps';
import useTermsAndConditions from '../../../talons/CheckoutPage/TermsAndConditions/useTermsAndConditions';
import TermsAndConditions from './termsAndConditions';

const TermsAndConditionsStep = (props) => {
    const {
      isUpdating,
      setIsUpdating,
      stepKey,
      cartItems,
      classes,
      reviewOrderButtonClicked,
      resetReviewOrderButtonClicked
    } = props;
  
    const {
      steps,
      setStepVisibility,
      handleNextStep,
      isStepVisited,
      isStepPassed,
      isOnLastStep,
      getContinueText,
      loading,
      currentStepKey
    } = useCheckoutStepContext();
  
    const {
      handleDone,
      shouldDisplay,
      continueText,
      shouldSubmitTerms,
      resetShouldSubmitTerms,
      shouldDisplayContinueButton
    } = useTermsAndConditions({
      steps,
      stepKey,
      setStepVisibility,
      handleNextStep,
      cartItems,
      getContinueText,
      loading,
      isOnLastStep,
      reviewOrderButtonClicked,
      resetReviewOrderButtonClicked,
      currentStepKey
    });
  
    useEffect(() => {
      if (shouldDisplay !== null) {
        setStepVisibility(stepKey, shouldDisplay);
      }
    }, [shouldDisplay]);
  
    if (loading) {
      return null;
    }
  
    if (!shouldDisplay) {
      return null;
    }

    const termsHeader = !isStepPassed(stepKey) ? (
        <h3 style={{ fontWeight: 600, textTransform: 'uppercase' }}>
            <StepCounter stepKey={stepKey} />
            <FormattedMessage
                id={'checkoutPage.termsAndConditionsStep'}
                defaultMessage={'Terms and Conditions'}
            />
        </h3>
    ) : null;

    const termsContent = isStepVisited(stepKey) ? (
        <TermsAndConditions
          onSave={handleDone}
          shouldSubmit={shouldSubmitTerms}
          resetShouldSubmit={resetShouldSubmitTerms}
        />
    ) : null;

    return (
        <div className={classes.shipping_method_container}>
          {termsHeader}
          {termsContent}
        </div>
    );
};

export default TermsAndConditionsStep;
```
Notes
- The step has access to all talon props that the Checkout Page has. This allows us to access things like the cart items without needing to make additional calls.
- It is important to not render the step while the steps are loading. Otherwise a sub-component may change to the next step before they've been loaded correctly.
- We set the visibility outside of the talon. This allows for [targetable wraps](#overriding-step-visibility-through-targetables) to be more efficient and not trigger multiple renders.
- We display the title information only when the step has not been visited yet
- We render the sub-component once the step is either the current step or has been passed. This way the sub-component can display the information already entered.
- 

#### The step hook
```jsx
/** src/talons/CheckoutPage/TermsAndConditions/useTermsAndConditions.js **/

import { useEffect, useCallback, useRef, useMemo, useState } from 'react';

export default (props) => {
  const {
    steps,
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
  
  const shouldDisplayStep = useRef(null);
  const [shouldSubmitTerms, setShouldSubmitTerms] = useState(false);

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

  const resetShouldSubmitTerms = useCallback(() => {
    setShouldSubmitTerms(false);

    if (currentStepKey !== stepKey) {
      return;
    }

    if (isOnLastStep) {
      resetReviewOrderButtonClicked();

      return;
    }
  }, [currentStepKey, resetReviewOrderButtonClicked]);

  useEffect(() => {
    const step = steps.find(({ key }) => key === stepKey);

    const isHidden = step.finished && !step.visible;

    shouldDisplayStep.current = !isHidden;
  }, [cartItems, steps]);

  useEffect(() => {
    if (currentStepKey !== stepKey) {
      return;
    }

    setShouldSubmitTerms(reviewOrderButtonClicked);
  }, [reviewOrderButtonClicked]);

  return {
    handleDone,
    continueText,
    shouldSubmitTerms,
    resetShouldSubmitTerms,
    shouldDisplayContinueButton,
    shouldDisplay: shouldDisplayStep.current
  };
}
```
Notes
- We get the continue text dynamically. This ensures that if a step is not active, the continue button doesn't reference an invalid step. It also ensures that
the last step before the review will not display its button.
- We're responding to changes to the visibility. If another component sets our visibility to false, shouldDisplay should return false.
- We have a local state that keeps track of if the Review button was clicked. This allows each step the possibility to be the last step.

#### The sub-component
```jsx
/** src/components/CheckoutPage/TermsAndConditions/termsAndConditions.js **/

import Button from '@magento/venia-ui/lib/components/Button';

const TermsAndConditions = (props) => {
    const {
      onSave,
      shouldSubmit,
      resetShouldSubmit,
      continueText,
      shouldDisplayContinueButton
    } = props
  
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [doneEditing, setDoneEditing] = useState(false);
    const [error, setError] = useState(null);
    
    const handleSave = useCallback(() => {
      // ... handle saving logic
      setDoneEditing(true);
      // Move on to next step
      onSave();
    }, [onSave, termsAccepted]);
  
    const handleAcceptChange = (event) => {
      const isChecked = event.target.checked;
  
      setTermsAccepted(isChecked);
    };
  
    useEffect(() => {
      if (!shouldSubmit) {
        return;
      }
        
      if (!termsAccepted) {
        setError('Must accept terms and conditions');
        // Reset the Review button's click status
        resetShouldSubmit();
        
        return;
      }
      
      // Trigger save when review button is clicked
      handleSave();
    }, [shouldSubmit, termsAccepted, handleSave]);
    
    
    if (doneEditing) {
      return (
        <div>Terms {termsAccepted ? 'are' : 'are not'} accepted</div>  
      );
    }
    
    // Conditionally display continue button if we're not on the last step
    const continueButton = shouldDisplayContinueButton ? (
      <Button onClick={handleSave}>{continueText}</Button>
    ) : null
    
    return (
      <div>
        {error}
        <input
          id="terms-and-conditions-checkbox"
          type="checkbox"
          onChange={handleAcceptChange}
        />
        <label for="terms-and-conditions-checkbox">I accept the terms and conditions</label>
        {continueButton}
      </div>
    );
}
```
Notes
- The subcomponent should ensure to respond to both a click on the continue button, as well as when the should submit flag passed from its step changes. This 
ensures each step can be last and before last.

## Overriding step visibility through targetables
It is possible to override the visibility of a step from a scaffolded application or third party extension by wrapping the step's talon through targetables.
### Overriding shipping method visibility
```jsx
const wrapUseShippingMethodStep = (original) => {

    return function useProductFullDetails(...restArguments) {
        const defaultReturnData = original(
            ...restArguments
        );

        return {
            ...defaultReturnData,
            shouldDisplay: false
        };
    };
};

export default wrapUseShippingMethodStep;
```
Notes:
- In this example we're always hiding the step, unconditionally.
- An alternative would be to grab the cartItems from the passed-in props and determine the visibility based on some condition (ex Virtual Products).
- We could also set the visibility asynchronously. Let's say we need to fetch something from the backend to determine whether or not we'll show the step. If
shouldDisplay is null, the step will remain loading. We can leverage this by returning null while we fetch the flag value and then return the correct shouldDisplay
value.

## Setting the visibility of a step from another step
**It is recommended to set the visibility of a step from within the step itself. This makes it easier when debugging rather than having to look everywhere for logic.
It also avoids race conditions since the step itself will be setting visibility.**

However for example's sake, let's say that you are offering some sort of buy-online-pickup-instore. You've added a new step before the shipping information where the
customer can select whether they want shipping or to go pickup. When the user selects pickup, we'll set the visibility of the shipping information and method to false.
```jsx
// ...

const {
    setStepVisibility,
    resetStepLoading
} = stepContext;

// ...

useEffect(() => {
    resetStepLoading(['SHIPPING_INFO', 'SHIPPING_METHOD', 'SHIPPING_PICKUP']);
    setStepVisibility('SHIPPING_INFO', !isInstorePickup);
    setStepVisibility('SHIPPING_METHOD', !isInstorePickup);
    setStepVisibility('SHIPPING_PICKUP', isInstorePickup);
}, [isInstorePickup]);

// ...
```
Notes
- We reset the visibility status before setting the visibility. This isn't required but could be useful
- We set the visibility for shipping information and shipping method steps for false when pickup
- We set the visibility of the shipping pickup to true when pickup. This would be a new step where customer can select their pickup location.

