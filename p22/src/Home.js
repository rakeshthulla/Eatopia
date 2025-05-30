  import React, { useState } from "react";
  import { Link } from "react-router-dom";
  import "./Home.css";
  import logo from './assets/Eatopia.png';
  import { useEffect } from "react";
  import '@fortawesome/fontawesome-free/css/all.min.css';

  const CountOnUsFinalSection = () => {
    return(
      <section className="final-cta">
        <h2 className="final-heading">
          If you count calories, macros, or micronutrients,<br/>
          you can count on us
        </h2>
        <Link to="/Login" className="final-btn">Sign Up – It’s Free!</Link>
        <div className="final-cards">
          {["12.png",  "14.png", "15.png", "16.png"].map((img, idx) => (
            <div className="final-card" key={idx}>
              <img src={img} alt="Nutrition Visual" />
              <p className="final-card-title">
                {[
                  "Reach & maintain your goal weight",
                  "Develop healthy habits",
                  "Dial up your diet & stay healthy",
                  "Get a holistic view of your health",
                ][idx]}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const NutritionCard = () => {
    return (
      <div className="nutrition-section">
        <div className="nutrition-card">
          <div className="nutrition-media">
            <img 
              src="/2.png" 
              alt="Healthy nutrition options" 
              className="nutrition-image"
              loading="lazy"
            />
          </div>
          <div className="nutrition-content">
            <h2 className="nutrition-title">
              Fuel Your Body,<br />
              <span className="nutrition-title-highlight">Nourish Your Life</span>
            </h2>
            <p className="nutrition-description">
            Eatopia's cutting-edge AI technology transforms how you fuel your body. Simply upload a photo or description of your meal — and our intelligent system breaks down the macronutrients and micronutrients tailored just for you. No more guessing, no more generic plans. Just food, data, and smarter choices.
            </p>

<Link to="/Login">
  <button className="nutrition-cta">
    Start Your Journey
    <svg className="cta-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/>
    </svg>
  </button>
</Link>

          </div>
        </div>
      </div>
    );
  };
  

  function HomePage() {
    const [menuOpen, setMenuOpen] = useState(false);
    useEffect(() => {
      const track = document.getElementById("carousel-track");
    
      if (!track) return;
    
      // Clone all slides for infinite loop illusion
      const clone = track.innerHTML;
      track.innerHTML += clone;
    
      let offset = 0;
    
      const slide = () => {
        offset -= 1;
        track.style.transform = `translateX(${offset}px)`;
    
        // Reset offset when we reach halfway (original + clone)
        if (Math.abs(offset) >= track.scrollWidth / 2) {
          offset = 0;
        }
      };
    
      const interval = setInterval(slide, 20); // Adjust speed here
    
      return () => clearInterval(interval);
    }, []);
    

    return (
      <div className="app">
        {/* Navbar */}
        <nav className="navbar0">
        <img src={logo} alt="Eatopia Logo" className="logo" />
          <div className="logo0">EATOPIA</div>
          <ul className={`nav-links ${menuOpen ? "show" : ""}`}>
            <li><Link to="/Home">Home</Link></li>
            <li><Link to="/Solutions">Solution</Link></li>
            <li><Link to="/About">About</Link></li>
            <li><Link to="/Login" className="faq-btn">Login</Link></li>
          </ul>
          <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>
              Unlock the Power of <span className="italicc">Personalized</span> Nutrition
            </h1>
            <p className="description">
              Effortlessly achieve your healthy eating goals with Eatopia's innovative solutions.
            </p>
            <Link to="/Login" className="btnn">Get Started</Link>
          </div>
          <div className="hero-image">
            <img
              src="/1.png" // Add this image to public folder
              alt="Healthy Food"
            />
          </div>
        </section>

        {/* Mission Section */}
<div className="mission-container">
  <section className="mission-section">
    <header className="mission-header">
      <h1 className="mission-title">Our Mission</h1>
      <p className="mission-subtitle">Transforming nutrition tracking through intelligent technology</p>
    </header>
    <div className="mission-cards">
      
      <div className="mission-card">
        <div className="card-icon">📊</div>
        <h2 className="card-title">Effortless Nutrition Tracking</h2>
        <p className="card-text">
          <strong>Track smarter, not harder.</strong> <br/>
          Eatopia’s AI lets you log meals in seconds. Simply snap a photo or describe your plate, and we’ll analyze calories, nutrients, and portion sizes instantly.
          <br /><br/>
          🧠 Perfect for busy lifestyles and beginner-friendly!
        </p>
      </div>

      <div className="mission-card">
        <div className="card-icon">🧠</div>
        <h2 className="card-title">Mindful Eating Simplified</h2>
        <p className="card-text">
          <strong>Custom plans for your unique body.</strong> <br />
          Whether you’re aiming to lose fat, build muscle, or boost energy, Eatopia creates science-backed nutrition strategies tailored to your body type and lifestyle.
          <br /><br />
          🎯 No more guesswork. Just results.
        </p>
      </div>

      <div className="mission-card">
        <div className="card-icon">🍽️</div>
        <h2 className="card-title">Personalized Meal Plans</h2>
        <p className="card-text">
          <strong>Healthy eating made simple.</strong> <br />
          Get weekly meal plans, smart grocery lists, and chef-curated recipes that align with your goals from plant-based to high-protein and everything in between.
          <br /><br />
          🍲 Delicious, nutritious, and totally doable.
        </p>
      </div>

    </div>
  </section>
</div>

 {/* Nutrition Section */}
 <NutritionCard />


       
<section className="carousel-section">
  <h2 className="carousel-title">Why Users Love Eatopia</h2>
  <div className="carousel-wrapper">
    <div className="carousel-track" id="carousel-track">
      {[
        {
          img: "fas fa-apple-alt",  // FontAwesome icon for apple
          text: "Snap a photo of your meal, and let our AI analyze its nutritional value in seconds.",
        },
        {
          img: "fas fa-chart-bar",  // FontAwesome icon for bar chart
          text: "Track your calorie intake, macro nutrients, and progress over time with beautiful graphs.",
        },
        {
          img: "fas fa-bullseye",  // FontAwesome icon for target
          text: "Set your personal health goals and receive real-time food suggestions tailored to you.",
        },
        {
          img: "fas fa-clock",  // FontAwesome icon for alarm clock
          text: "Never miss a meal again with our intelligent meal reminder system.",
        },
        {
          img: "fas fa-utensils",  // FontAwesome icon for utensils
          text: "Find healthier food alternatives instantly using our recommendation engine.",
        },
        {
          img: "fas fa-sync-alt",  // FontAwesome icon for refresh
          text: "Sync with your smart devices and fitness apps for a 360° health profile.",
        },
        {
          img: "fas fa-comments",  // FontAwesome icon for comments
          text: "Join our community and get motivated with health challenges and support groups.",
        },
        {
          img: "fas fa-calendar-alt",  // FontAwesome icon for calendar
          text: "Explore expert-crafted diet plans to meet your weight, muscle, or health goals.",
        },
        {
          img: "fas fa-utensil-spoon",  // FontAwesome icon for spoon and plate
          text: "Chat with certified nutritionists right inside the app for personalized guidance.",
        },
        {
          img: "fas fa-robot",  // FontAwesome icon for robot
          text: "Let our AI be your health coach — smart, responsive, and always learning about you.",
        },
      ].map((slide, i) => (
        <div className="carousel-slide" key={i}>
          <div className="slide-icon"><i className={slide.img}></i></div> {/* Using FontAwesome icons */}
          <p className="slide-text">{slide.text}</p>
        </div>
      ))}
    </div>
  </div>
</section>
<div className="why-container">
      <h2>Why use <span>Eatopia</span>?</h2>
      <p className="subheading">Our lab-analyzed nutrition data will help you:</p>

      <div className="card orange">
        <div className="card-text">
          <h3>Dial up your diet</h3>
          <p>
            See which of the essential 84 vitamins and minerals you're getting the most and least of, helping you eat a more balanced diet.
          </p>
        </div>
        <img src="3.jpg" alt="Dial your diet" />
      </div>

      <div className="card blue">
        <div className="card-text">
          <h3>Reach & maintain your goal weight</h3>
          <p>
            Monitor your food intake with detailed food journaling, verified nutrition information, and a built-in nutritional target wizard to keep yourself accountable.
          </p>
        </div>
        <img src="5.png" alt="Weight chart" />
      </div>

      <div className="card green">
        <div className="card-text">
          <h3>Get a holistic view of your health</h3>
          <p>
            Sync Cronometer with all your devices and track all your biometrics from pain symptoms to gut health to blood sugar levels and more.
          </p>
        </div>
        <img src="6.png" alt="Holistic health" />
      </div>
    </div>
    {/* Help Section - Light Cards */}
<section className="help-section">
  <h2 className="help-title">How can we help?</h2>
  <p className="help-subtitle">I want to use Eatopia to…</p>
  <div className="help-cards">
    {[
      {
        title: "Keep track of my food intake",
        image: "8.png",
      },
      {
        title: "Monitor my health metrics",
        image: "9.png",
      },
      {
        title: "Optimize and refine my diet",
        image: "10.png",
      },
      {
        title: "Analyze my diet progress",
        image: "11.png",
      },
    ].map((card, idx) => (
      <Link to="/Login" key={idx} className="help-card">
        <div className="help-card-top">
          <h3>{card.title}</h3>
          <span className="arrow">→</span>
        </div>
        <img src={card.image} alt={card.title} />
      </Link>
    ))}
  </div>
</section>

{/* CTA Section from image */}
<CountOnUsFinalSection />


<div class="motto">
  <h2>Eat. Sleep. Track. Repeat.</h2>
</div>

<footer className="footer">
      <div className="footer-top">
        <div className="footer-logo-section">
          <img src="logoround.png" alt="Eatopia Logo" className="footer-logo" />
          <h2 className="footer-brand">Eatopia</h2>
        </div>

        <div className="footer-columns">
          <div className="footer-column">
            <h4 className="footer-heading">EXPLORE</h4>
            <ul>
              <li><Link to="/Home">Home</Link></li>
            <li><Link to="/Solutions">Solution</Link></li>
            <li><Link to="/About">About</Link></li>
            <li><Link to="/Login" >Login</Link></li>
              
            </ul>
          </div>
          <div className="footer-column">
            <h4 className="footer-heading">Legal</h4>
            <ul>
               <li><Link to="/Terms" >Terms</Link></li>
                <li><Link to="/Privacy" >Privacy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>reach us at:</p>
        <p><a href="mailto:support@eatopiaaa.com">eatopiaaa@email.com</a></p>
        <p>Copyright © 2025 Eatopia. All rights reserved.</p>

      </div>
    </footer>


      </div>
      
      
    );
  }

  export default HomePage;
