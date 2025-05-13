import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';

const stripePromise = loadStripe('pk_test_51RIlE8Qqo0DAEMuuO1veDJrg9xkbeRjiMfPsdO5FjC9xLg0HfkGudCJPxuXEPWK23d9EIu5Y4Hk4wlhyEJYUW1qI00VH4Erosd'); // Replace with your Stripe publishable key

const StripeContainer = ({ clientSecret }) => {
    const options = {
        clientSecret,
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            <PaymentForm />
        </Elements>
    );
};

export default StripeContainer;
