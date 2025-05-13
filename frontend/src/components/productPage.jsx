import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BsInfoCircle } from "react-icons/bs";
import { IoCartOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { IoMdHeart } from "react-icons/io";
import axiosInstance from "../components/axiosInstance";
import "./productPage.css"
import Navbar from './navbar';

const ProductPage = () => {
  const { category, subcategory } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistedProducts, setWishlistedProducts] = useState([]);
  const [sparkleProductId, setSparkleProductId] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  const nav = useNavigate();





  const handleWishlistClick = async (productId) => {
    console.log("Clicked Product ID:", productId); 
    console.log("Wishlisted Products before toggle:", wishlistedProducts); 

    try {
      const token = localStorage.getItem("token"); 
      console.log("Token being sent:", token);

      const response = await axiosInstance.post(
        `/api/wishlist/toggle`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", 
          },
        }
      );


      if (response.data && response.data.wishlist) {
        console.log("Response from backend:", response.data);

        setSparkleProductId(productId);

        setWishlistedProducts((prev) => {
          const updatedWishlist = prev.includes(productId)
            ? prev.filter((id) => id !== productId)
            : [...prev, productId];

          console.log("Wishlisted Products after toggle:", updatedWishlist); // Log after the state update
          return updatedWishlist;
        });

        setTimeout(() => setSparkleProductId(null), 1000);
      } else {
        console.error("Wishlist toggle failed at backend");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  //cart
  const handleCartToggle = async (productId) => {
    try {

      const userId = localStorage.getItem("userId");
      console.log("Sending userId to backend for cart:", userId);

      if (!userId) {
        console.warn("User not logged in.");
        return;
      }

      if (cartItems.includes(productId)) {
        // Remove from cart
        await axiosInstance.post("/api/cart/remove", {
          userId,
          productId,
          quantity: 1,
          rentType: "daily"
        });
        setCartItems(prev => prev.filter(id => id !== productId));
      } else {
        // Add to cart
        await axiosInstance.post("/api/cart/add", {
          userId,
          productId,
          quantity: 1,
          rentType: "daily"
        });
        setCartItems(prev => [...prev, productId]);
      }
      
    } catch (error) {
      console.error("Cart update error:", error);
    }
    if (window.fetchCartCount) {
      window.fetchCartCount();
    }
    
  };

  




  useEffect(() => {
    const fetchWishlist = async () => {
      try {

        const token = localStorage.getItem("token");
        if (!token) {
          console.warn(" No token found when fetching wishlist.");
          return;
        }

        const response = await axiosInstance.get("/api/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data?.wishlist) {
          setWishlistedProducts(response.data.wishlist.map(item => item._id || item));
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, [wishlistedProducts]);

  //cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = localStorage.getItem("userId");
        console.log("Sending userId to backend for cart:", userId); // 👀 Log here

        if (!userId) {
          console.warn("User ID not found in localStorage.");
          return;
        };
        console.log("Sending to backend:", { userId });

        const response = await axiosInstance.post("/api/cart/get", {
          userId
        },{
          headers: {
            "Content-Type": "application/json",
          },
        }
        );
        console.log("Cart fetched:", response.data);

        if (response.data && response.data.cart) {
          const productIds = response.data.cart.map(item => item.product._id);
          setCartItems(productIds);
        }else {
          console.warn("No cart items found.");
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, []);



  useEffect(() => {
    // Fetch products based on category or subcategory
    const fetchProducts = async () => {
      let url = 'http://localhost:5000/api/products';
      if (category) {
        url += `/category/${category}`;
      } else if (subcategory) {
        url += `/subcategory/${subcategory}`;
      }

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);  
      } finally {
        setLoading(false);  
      }
    };

    fetchProducts();
  }, [category, subcategory]);




  return (
    <div className='product-page'>
      <Navbar />

      <h1>{category ? category : subcategory} </h1>
      {loading ? (
        <p>Loading...</p> 
      ) : (
        <div className="products">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="product-cards">
                <div className="product-image-container">
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={`http://localhost:5000${image}`}
                      alt={product.name}
                      className={`product-images ${index !== 0 ? 'product-images-hover' : ''}`}
                    />
                  ))}



                  <div
                    className="wishlist-wrapper"
                    onClick={() => handleWishlistClick(product._id)}
                  >
                    {wishlistedProducts.includes(product._id) ? (
                      <IoMdHeart className="wishicon filled" />
                    ) : (
                      <CiHeart className="wishicon" />
                    )}

                    {sparkleProductId === product._id && (
                      <div className="sparkle-animation">
                        {[...Array(6)].map((_, i) => (
                          <span key={i} className={`dot dot-${i}`}></span>
                        ))}
                      </div>
                    )}
                  </div>




                </div>
                <h2>{product.name}</h2>
                <h3><b>₹{product.rentalPricing?.find((p) => p.duration === 'day')?.price ?? 'N/A'} </b>/day</h3>

                <div className='cardbutton'>
                  <button className='cardbttns' onClick={() => nav(`/product/${product._id}`)}><BsInfoCircle className='cardicon' />View Details</button>
                  <button
                    className={`cardbttns ${cartItems.includes(product._id) ? "added" : ""}`}
                    onClick={() => handleCartToggle(product._id)}
                  >
                    <IoCartOutline className='cardicon' />
                    {cartItems.includes(product._id) ? "Carted" : "Add to Cart"}
                  </button>
                </div>



              </div>
            ))
          ) : (
            <p>No products found in this category/subcategory.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductPage;
