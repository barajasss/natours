import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
    'pk_test_51GrOkUJ1kommwwumwKP1VBRdEe1Omlg01ako941QISbm0R4nBcCio8skVXdocLct8wouz1DyVeJlRAsicnJTkPJs00AQWGdDSe'
);

export const bookTour = async (tourId) => {
    // get checkout session from API
    try {
        const session = await axios({
            method: 'GET',
            url: `/api/v1/bookings/checkout-session/${tourId}`,
        });

        // console.log(session);

        // create checkout form + charge credit card

        await stripe.redirectToCheckout({
            sessionId: session.data.session.id,
        });
    } catch (err) {
        console.error(err);
        showAlert('error', err);
    }
};
