import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useLocation } from 'react-router-dom';
import axiosInstance from './axiosInstance';
import { Player } from "@lottiefiles/react-lottie-player";
import { useNavigate } from 'react-router-dom'; 

const stripePromise = loadStripe('pk_test_51RIlE8Qqo0DAEMuuO1veDJrg9xkbeRjiMfPsdO5FjC9xLg0HfkGudCJPxuXEPWK23d9EIu5Y4Hk4wlhyEJYUW1qI00VH4Erosd');

const PaymentForm = ({ setPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setPaymentSuccess(true);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <PaymentElement />
      <button
        disabled={isProcessing || !stripe || !elements}
        style={{
          marginTop: '20px',
          background: "none",
          borderRadius: "5px",
          width: "100px",
          height: "25px"
        }}
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const PaymentPage = () => {
  const location = useLocation();
  const { price, item, buy } = location.state || {};

  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [message, setMessage] = useState(null);
  const nav = useNavigate();



  const sendOrder = async () => {
    try {
      const orderData = {
        userId: localStorage.getItem("userId"),
        productId: item?.product?._id,
        rentType: item?.rentType || (buy ? "buy" : "rent"),
        duration: item?.duration || 1,
        totalAmount: price,
        paymentId: clientSecret,  
      };
  
      const res = await axiosInstance.post("/orders/create", orderData);
    } catch (err) {
      alert("Failed to save order");
      console.error(err);
    }
  };
  


  useEffect(() => {
    const fetchClientSecret = async () => {
      if (!price || !item) {
        console.log('Missing price or item');
        setLoading(false);
        return;
      }

      try {
        const res = await axiosInstance.post('/api/create-payment-intent', {
          amount: Math.round(price * 100),
        });
        setClientSecret(res.data.clientSecret);
        
      } catch (err) {
        console.error('Error fetching client secret:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClientSecret();
  }, [price, item]);
  useEffect(() => {
    if (paymentSuccess) {
      sendOrder();  

        const timer = setTimeout(() => {
            nav('/my-orders');
        }, 2000); 

        return () => clearTimeout(timer); 
    }
}, [paymentSuccess, nav]);

  const appearance = { theme: 'stripe' };
  const options = { clientSecret, appearance };

  if (loading) {
    return (
      <div >
        <Player
          autoplay
          loop
          src="/loading.json"
          style={{ height: "400px", width: "300px",marginTop:"100px" }}
        />
      </div>
    );
  }
    if (!price || !item) return <div>Error: Missing payment details.</div>;
  if (!clientSecret) return <div>Error: Failed to load payment information.</div>;


  
 
  
  if (paymentSuccess) {
      return (
          <div >
              <Player
                  autoplay
                  loop={false}
                  src="/payment.json"
                  style={{ height: "300px", width: "300px" }}
              />
              <h2  style={{textAlign:"center"}}>Payment Successful!</h2>
              {/* <p  style={{fontSize:"10px"}}>Redirecting to cart...</p> */}
          </div>
      );
  }








  






    return (
        <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
            <div style={{ flex: 1 }}>
                <Elements stripe={stripePromise} options={options}>
                    <PaymentForm setPaymentSuccess={setPaymentSuccess} setMessage={setMessage} />
                </Elements>
                {message && <div style={{ marginTop: '15px', color: 'red' }}>{message}</div>}
            </div>

            <div style={{ flex: 1, border: '1px solid #ccc', borderRadius: '10px', padding: '1rem',height:"250px" }}>
                <h2>Order Summary</h2>
                <p><strong>Product:</strong> {item?.product.name}</p>
                <p><strong>Type:</strong> {buy ? 'Buy' : `Rent`}</p>
                <p><strong>Total Price:</strong> ₹{price}</p>
            </div>
        </div>
    );
};

export default PaymentPage;