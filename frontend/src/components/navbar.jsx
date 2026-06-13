import "./navbar.css";
import { CiSearch } from "react-icons/ci";
import { IoPersonCircleOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { GiShoppingCart } from "react-icons/gi";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { CiCirclePlus } from "react-icons/ci";
import { IoLogOutOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { LiaShoppingBagSolid } from "react-icons/lia";

export default function Navbar() {
  const nav = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [allData, setAllData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  
  const handleHomeClick = () => {
    nav("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    nav("/loginRegister"); 
    alert("You have been logged out.");
  };

  useEffect(() => {
    axios.get("https://renthunt-backend.onrender.com/api/products") 
      .then((res) => {
        setAllData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);


  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (token && userId) {
        axios.get(`https://renthunt-backend.onrender.com/api/cart/${userId}`)

          .then((res) => {
            setCartCount(res.data.cart.length); 
          })
          .catch((err) => {
            console.error("Error fetching cart:", err);
          });



      }




    }
  }, []);



  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
      fetchCartCount(); 
      window.fetchCartCount = fetchCartCount; 
    }
  }, []);






  const fetchCartCount = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios.get(`https://renthunt-backend.onrender.com/api/cart/${userId}`)
        .then((res) => {
          setCartCount(res.data.cart.length);
        })
        .catch((err) => {
          console.error("Error fetching cart:", err);
        });
    }
  };





  const handleSearch = () => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) return;

    const product = allData.find(p => p.name.toLowerCase().includes(query));
    if (product) {
      nav(`/product/${product._id}`);
      return;
    }

    const subcategoryMatch = allData.find(p => p.subcategory.toLowerCase().includes(query));
    if (subcategoryMatch) {
      nav(`/subcategory/${subcategoryMatch.subcategory}`);
      return;
    }

    const categoryMatch = allData.find(p => p.category.toLowerCase().includes(query));
    if (categoryMatch) {
      nav(`/category/${categoryMatch.category}`);
      return;
    }

    alert("No matching product found.");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
const handleStash=()=>{
  nav("/my-orders")
}
const submitAdminLogin = async () => {
  if (!adminEmail || !adminPassword) {
    alert("Both fields are required!");
    return;
  }

  try {
    const response = await axios.post("https://renthunt-backend.onrender.com/api/admin/login", {
      email: adminEmail,
      password: adminPassword,
    });

    if (response.status === 200) {
      localStorage.setItem("adminToken", response.data.token);
      alert("Login Successful!");
      nav("/admin");
      setShowAdminLogin(false); 
      setAdminEmail("");
      setAdminPassword("");
    }
  } catch (error) {
    alert("Invalid credentials! Please try again.");
  }
};


  return (
    <div className="Navbar">
      <img src="/images/home/Logo.png" alt="logo" className="logo" />
      <div className="desktop-only">
        <button className="navbuto" onClick={handleHomeClick}>Home</button>
        <button className="navbuto" onClick={handleStash}><LiaShoppingBagSolid className="stash"/>My Stash
        </button>
      </div>
      <div className="search-bar">
        <CiSearch className="search-icon" onClick={handleSearch} />
        <input type="text" placeholder="Explore...." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
      </div>

      <div className="nav-icons">

        {user ? (
          <div className="user-dropdown">
            <button onClick={toggleDropdown} className="user-button">
              {user.name.charAt(0).toUpperCase()}
            </button>
            {dropdownOpen && (
              <div className="dropdown-content">
                <div className="namelet">
                  <p>{user.name}</p>
                </div>
                <div className="active">
                  <p>
                    Active{" "}
                  </p>
                  <span >•</span>
                </div>

                <div className="addsec">
                  <Link to="/loginRegister" onClick={toggleDropdown}>
                    <div className="additems">
                      <CiCirclePlus className="addicon" />
                      <div className="addacc">  Add Account</div>
                    </div>

                  </Link>
                </div>

                <div className="logout">

                  <button onClick={handleLogout}>
                    <div className="logitems">
                      <IoLogOutOutline className="addicon" />
                      <div className="logacc"> Logout</div>
                    </div>
                  </button>
                </div>
              </div>

            )}
          </div>
        ) : (
          <Link to="/loginRegister"><IoPersonCircleOutline className="icons" /></Link>
        )}

        <CiHeart className="icons" onClick={() => nav("/wishlist")} />
        <div className="cart-icon-container" onClick={() => nav("/cartPage")}>
          <GiShoppingCart className="icons" />
          {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
        </div>
        <div className="admin-icon-container">
  <MdOutlineAdminPanelSettings className="icons" onClick={() => setShowAdminLogin(!showAdminLogin)} />

  {showAdminLogin && (
    <div className="admin-login-popup">
      <input
        type="email"
        placeholder="Admin Email"
        value={adminEmail}
        onChange={(e) => setAdminEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={adminPassword}
        onChange={(e) => setAdminPassword(e.target.value)}
      />
      <button onClick={submitAdminLogin}>Login</button>
    </div>
  )}
</div>
      </div>
    </div>
  );
}
