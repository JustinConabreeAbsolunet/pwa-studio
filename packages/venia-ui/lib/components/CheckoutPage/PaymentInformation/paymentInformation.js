import React, { Suspense } from 'react';
import { FormattedMessage } from 'react-intl';
import { Form } from 'informed';
import { shape, func, string, bool, instanceOf } from 'prop-types';

import { usePaymentInformation } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentInformation';
import CheckoutError from '@magento/peregrine/lib/talons/CheckoutPage/CheckoutError';

import { useStyle } from '../../../classify';
import defaultClasses from './paymentInformation.module.css';
import LoadingIndicator from '../../LoadingIndicator';
import Button from '../../Button';

const PaymentMethods = React.lazy(() => import('./paymentMethods'));
const EditModal = React.lazy(() => import('./editModal'));
const Summary = React.lazy(() => import('./summary'));

const PaymentInformation = props => {
    const {
        classes: propClasses,
        onSave,
        resetShouldSubmitPayment,
        resetPaymentStep,
        shouldSubmitPayment,
        checkoutError,
        continueText,
        onContinueClick,
        shouldDisplayContinueButton
    } = props;

    const classes = useStyle(defaultClasses, propClasses);

    const talonProps = usePaymentInformation({
        onSave,
        checkoutError,
        resetShouldSubmitPayment,
        resetPaymentStep,
        shouldSubmitPayment
    });

    const {
        doneEditing,
        handlePaymentError,
        handlePaymentSuccess,
        hideEditModal,
        isLoading,
        isEditModalActive,
        showEditModal
    } = talonProps;

    if (isLoading) {
        return (
            <LoadingIndicator classes={{ root: classes.loading }}>
                <FormattedMessage
                    id={'checkoutPage.loadingPaymentInformation'}
                    defaultMessage={'Fetching Payment Information'}
                />
            </LoadingIndicator>
        );
    }

    const paymentInformation = doneEditing ? (
        <Summary onEdit={showEditModal} />
    ) : (
        <Form>
            <PaymentMethods
                onPaymentError={handlePaymentError}
                onPaymentSuccess={handlePaymentSuccess}
                resetShouldSubmit={resetShouldSubmitPayment}
                shouldSubmit={shouldSubmitPayment}
            />
        </Form>
    );

    const editModal = doneEditing ? (
        <Suspense fallback={null}>
            <EditModal onClose={hideEditModal} isOpen={isEditModalActive} />
        </Suspense>
    ) : null;

    const continueButton = shouldDisplayContinueButton ? (
        <Button
            priority="high"
            onClick={onContinueClick}
            disabled={shouldSubmitPayment}
            >{continueText}</Button>
    ) : null;

    return (
        <div className={classes.root} data-cy="PaymentInformation-root">
            <div className={classes.payment_info_container}>
                <Suspense fallback={null}>{paymentInformation}</Suspense>
            </div>
            {editModal}
            {continueButton}
        </div>
    );
};

export default PaymentInformation;

PaymentInformation.propTypes = {
    classes: shape({
        container: string,
        payment_info_container: string,
        review_order_button: string
    }),
    onSave: func.isRequired,
    checkoutError: instanceOf(CheckoutError),
    resetShouldSubmitPayment: func.isRequired,
    shouldSubmitPayment: bool
};
