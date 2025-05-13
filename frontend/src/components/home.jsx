import { useEffect } from "react";
import Navbar from "./navbar";
import "./home.css"
import { IoBedOutline } from "react-icons/io5";
import { GrLocation } from "react-icons/gr";
import { FaGears } from "react-icons/fa6";
import { TbClockCancel } from "react-icons/tb";
import { TbTruckReturn } from "react-icons/tb";
import { TbDeviceMobileUp } from "react-icons/tb";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { Link } from "react-router-dom";


export default function Home() {
    useEffect(() => {
        const timer = setTimeout(() => {
            const element = document.getElementById('typing-text');
            if (element) {
                element.classList.add('finished');
            }
        }, 3000);

    
        return () => clearTimeout(timer);
    }, []);  
    return (
        <div>
            <Navbar />
            <div className="banner">
                <img className="back" src="/images/home/banner back.png" alt="banner" />
                <div className="banner-content">
                    <span className="fixed-text">Welcome to</span>
                    <span className="floating-text">RentHunt</span>
                    <span className="typing-container">
                        <span className="typing-text" id="typing-text">
                            - 'Cuz Adulting is Expensive
                        </span>
                    </span>
                </div>
                <img className="front" src="/images/home/banner front.png" alt="banner" />

                <button className="banexplore"
                    onClick={() => {
                        const exploreSection = document.querySelector(".explore");
                        if (exploreSection) {
                            exploreSection.scrollIntoView({ behavior: "smooth" });
                        }
                    }
                    }
                >Explore Now</button>

            </div>

            <div className="explore">
                <h1>Products</h1>
            </div>
            <div className="categories">

                <div className="cat-container">
                    <Link to="/category/Furniture" className="cat-card"><img src="/images/furniture/furnitureface.jpg" alt="furniture" />
                        <div className="shortname">
                            <p className="cat-text">Furniture</p>
                        </div>
                    </Link>{/* center card */}
                    <Link to="/subcategory/Home" className="subcard"><img src="/images/furniture/interior.jpg" alt="interior" /> <div className="overlay">Home</div></Link>
                    <Link to="/subcategory/Outdoor" className="subcard"> <img src="/images/furniture/outdoor.jpeg" alt="outdoor" /><div className="overlay">Outdoor</div></Link>
                    <Link to="/subcategory/Decor" className="subcard"><img src="/images/furniture/decor.avif" alt="decor" /> <div className="overlay">Decor</div></Link>
                    <Link to="/subcategory/Office" className="subcard"><img src="/images/furniture/office.jpg" alt="office" /> <div className="overlay">Office</div></Link>
                </div>

                <div className="cat-container">{/* each category section */}
                    <Link to="/category/Electronics" className="cat-card"><img src="/images/electronics/electronicsface.avif" alt="electronics" />
                        <p className="cat-text">Electronics & Gadgets</p>
                    </Link>{/* center card */}
                    <Link to="/subcategory/Appliances" className="subcard"><img src="/images/electronics/homeappliences.jpg" alt="homeappliances" /> <div className="overlay">Home Appliances</div></Link>
                    <Link to="/subcategory/Personal" className="subcard"> <img src="/images/electronics/personalgadgets.avif" alt="personalgadgets" /><div className="overlay">Personal Gadgets</div></Link>
                    <Link to="/subcategory/Entertainment" className="subcard"><img src="/images/electronics/entertainment.jpg" alt="entertainment" /> <div className="overlay">Entertainment</div></Link>
                    <Link to="/subcategory/Work" className="subcard"><img src="/images/electronics/work.jpg" alt="work" /> <div className="overlay">Workspace</div></Link>
                </div>

                <div className="cat-container">{/* each category section */}
                    <Link to="/category/Clothing" className="cat-card"><img src="/images/clothing/clothingface.jpg" alt="clothing" />
                        <div className="shortname">
                            <p className="cat-text">Clothing</p>
                        </div>
                    </Link>{/* center card */}
                    <Link to="/subcategory/Accessories" className="subcard"><img src="/images/clothing/accessories.jpg" alt="accessories" /> <div className="overlay">Accessories</div></Link>
                    <Link to="/subcategory/Wedding" className="subcard"> <img src="/images/clothing/wedding.jpeg" alt="wedding" /><div className="overlay">Wedding</div></Link>
                    <Link to="/subcategory/Footwear" className="subcard"><img src="/images/clothing/footwear.webp" alt="footwear" /> <div className="overlay">Footwear</div></Link>
                    <Link to="/subcategory/Eventwear" className="subcard"><img src="/images/clothing/eventwear.webp" alt="eventwear" /> <div className="overlay">Eventwear</div></Link>
                </div>

                <div className="cat-container">{/* each category section */}
                    <Link to="/category/Musical" className="cat-card"><img src="/images/music/musicface.avif" alt="music" />
                        <p className="cat-text">Musical Instruments</p>
                    </Link>{/* center card */}
                    <Link to="/subcategory/String" className="subcard"><img src="/images/music/string.webp" alt="string" /> <div className="overlay">String Instruments</div></Link>
                    <Link to="/subcategory/Percussion" className="subcard"> <img src="/images/music/percussion.jpg" alt="percussion " /><div className="overlay">Percussion </div></Link>
                    <Link to="/subcategory/Wind" className="subcard"><img src="/images/music/wind.jpg" alt="wind" /> <div className="overlay">Wind Instruments</div></Link>
                    <Link to="/subcategory/Keys" className="subcard"><img src="/images/music/keyboard.jpg" alt="keyboard" /> <div className="overlay">Electronic Keys</div></Link>
                </div>

                <div className="cat-container">{/* each category section */}
                    <Link to="/category/Sports" className="cat-card"><img src="/images/sports/sportsface.jpg" alt="sports" />
                        <p className="cat-text">Sports & Fitness</p>
                    </Link>{/* center card */}
                    <Link to="/subcategory/Outdoor Sports" className="subcard"><img src="/images/sports/outdoor.jpg" alt="outdoor" /> <div className="overlay">Outdoor Sports</div></Link>
                    <Link to="/subcategory/Indoor" className="subcard"> <img src="/images/sports/indoor.jpg" alt="indoor" /><div className="overlay">Indoor Sports</div></Link>
                    <Link to="/subcategory/Fitness" className="subcard"><img src="/images/sports/fitness.jpg" alt="fitness" /> <div className="overlay">Fitness & Gym</div></Link>
                    <Link to="/subcategory/Adventure" className="subcard"><img src="/images/sports/adventure.jpg" alt="adventure" /> <div className="overlay">Adventure & Rec</div></Link>
                </div>

                <div className="cat-container">{/* each category section */}
                    <Link to="/category/Tools" className="cat-card"><img src="/images/tools/toolface.webp" alt="tools" />
                        <p className="cat-text">Tools & Equipment</p>
                    </Link>{/* center card */}
                    <Link to="/subcategory/Powertools" className="subcard"><img src="/images/tools/powertools.jpeg" alt="powertools" /> <div className="overlay">Powertools</div></Link>
                    <Link to="/subcategory/Handtools" className="subcard"> <img src="/images/tools/handtools.jpg" alt="handtools" /><div className="overlay">Handtools</div></Link>
                    <Link to="/subcategory/Construction" className="subcard"><img src="/images/tools/construction.jpg" alt="construction" /> <div className="overlay">Construction</div></Link>
                    <Link to="/subcategory/Gardening" className="subcard"><img src="/images/tools/gardening.jpg" alt="gardening" /> <div className="overlay">Gardening</div></Link>
                </div>

                <div className="cat-container">{/* each category section */}
                    <Link to="/category/Kids" className="cat-card"><img src="/images/kids/kidsface.jpg" alt="kids" />
                        <p className="cat-text">Kids & Baby Essentials</p>
                    </Link>{/* center card */}
                    <Link to="/subcategory/Wearables" className="subcard"><img src="/images/kids/cloth.webp" alt="cloth" /> <div className="overlay">Wearables</div></Link>
                    <Link to="/subcategory/Gear" className="subcard"> <img src="/images/kids/babygear.jpg" alt="babygear" /><div className="overlay">Baby Gear</div></Link>
                    <Link to="/subcategory/Toys" className="subcard"><img src="/images/kids/toys.webp" alt="toys" /> <div className="overlay">Toys & Games</div></Link>
                    <Link to="/subcategory/Learn" className="subcard"><img src="/images/kids/activities.jpg" alt="activities" /> <div className="overlay">Learn & Play</div></Link>
                </div>

                <div className="cat-container">{/* each category section */}
                    <Link to="/category/MedCare" className="cat-card"><img src="/images/medical/medface.webp" alt="medical" />
                        <div className="shortname">
                            <p className="cat-text">MedCare </p>
                        </div>
                    </Link>{/* center card */}
                    <Link to="/subcategory/PatientCare" className="subcard"><img src="/images/medical/patientcare.jpg" alt="patientcare" /> <div className="overlay">Patientcare</div></Link>
                    <Link to="/subcategory/Diagnostic" className="subcard"> <img src="/images/medical/diagnostic.webp" alt="diagnostic" /><div className="overlay">Diagnostic Tools</div></Link>
                    <Link to="/subcategory/Clinical" className="subcard"><img src="/images/medical/surgical.jpg" alt="surgical" /> <div className="overlay">Clinical Gear</div></Link>
                    <Link to="/subcategory/Rehab" className="subcard"><img src="/images/medical/therapy.jpg" alt="therapy" /> <div className="overlay">Rehab Essentials</div></Link>
                </div>

                <div className="cat-container">{/* each category section */}
                    <Link to="/category/Learn&Leisure" className="cat-card"><img src="/images/learn/learnface.jpg" alt="learn" />
                        <div className="shortname">
                            <p className="cat-text">Learn & Leisure</p>
                        </div>
                    </Link>{/* center card */}
                    <Link to="/subcategory/Academic" className="subcard"><img src="/images/learn/education.jpg" alt="education" /> <div className="overlay">Academic</div></Link>
                    <Link to="/subcategory/Read" className="subcard"> <img src="/images/learn/books.jpg" alt="books" /><div className="overlay">Books & Reads</div></Link>
                    <Link to="/subcategory/Comics" className="subcard"><img src="/images/learn/comics.jpg" alt="comics" /> <div className="overlay">Comics</div></Link>
                    <Link to="/subcategory/Stationary" className="subcard"><img src="/images/learn/supplies.jpg" alt="supplies" /> <div className="overlay">Stationery</div></Link>
                </div>
            </div>


            <section className="rental-features">
                <h2>There's more <br />to renting</h2>
                <div className="features-grid">
                    <div className="features-card">
                        <IoBedOutline className="features-icon" />
                        <h3>Finest-quality products</h3>
                        <p>Quality matters to you, and us! That's why we do a strict quality-check for every product.</p>
                    </div>

                    <div className="features-card">
                        <GrLocation className="features-icon" />
                        <h3>Free relocation</h3>
                        <p>Changing your house or even your city? We'll relocate your rented products for free.</p>
                    </div>

                    <div className="features-card">
                        <FaGears className="features-icon" />
                        <h3>Free maintenance</h3>
                        <p>Keeping your rented products in a spick and span condition is on us, so you can sit back and relax.</p>
                    </div>

                    <div className="features-card">
                        <TbClockCancel className="features-icon" />
                        <h3>Cancel anytime</h3>
                        <p>Pay only for the time you use the product and close your subscription without any hassle.</p>
                    </div>

                    <div className="features-card">
                        <TbTruckReturn className="features-icon" />
                        <h3>Easy return on delivery</h3>
                        <p>If you don't like the product on delivery, you can return it right away—no questions asked.</p>
                    </div>

                    <div className="features-card">
                        <TbDeviceMobileUp className="features-icon" />
                        <h3>Keep upgrading</h3>
                        <p>Bored of the same product? Upgrade to try another, newer design and enjoy the change!</p>
                    </div>

                </div>
            </section>

            <footer id="footer">
                <div className="footer-container">
                    <div className="footer-logo">
                        <img src="/images/home/Logo.png" alt="RentHunt Logo" />

                    </div>
                    <div className="footer-section">
                        <h3>RentHunt</h3>
                        <p>Smart renting made easy! Find, rent, and own with confidence.</p>
                    </div>

                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="#">How It Works</a></li>
                            <li><a href="#">FAQs</a></li>
                            <li><a href="#">Terms & Conditions</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3>Customer Support</h3>
                        <ul>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Rental Guidelines</a></li>
                            <li><a href="#">Return & Refund Policy</a></li>
                            <li><a href="#">Payment & Security</a></li>
                        </ul>
                    </div>

                    <div className="footer-section social-section">
                        <h3>Follow Us</h3>
                        <div className="social-icons">
                            <a href="#"><FaFacebook className="facebook" /></a>
                            <a href="#"><FaInstagram className="instagram" /></a>
                            <a href="#"><FaTwitter className="twitter" /></a>
                            <a href="#"><FaLinkedin className="linkedin" /></a>
                        </div>


                        <div className="app-section">
                            <h3>Download Our App</h3>
                            <div className="app-buttons">
                                <a href="#"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" /></a>
                                <a href="#"><img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" /></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div>
                        <a href="#">Privacy Policy</a> | <a href="#">Terms & Conditions</a>
                    </div>
                    <div>
                        © 2025 RentHunt. All rights reserved.
                    </div>
                </div>

            </footer>



        </div>
    )
}