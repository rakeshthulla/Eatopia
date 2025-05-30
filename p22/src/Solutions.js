import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Solutions.css";
import logo from './assets/Eatopia.png';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Solution() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const track = document.getElementById("carousel-track");
    if (!track) return;

    const clone = track.innerHTML;
    track.innerHTML += clone;

    let offset = 0;
    const slide = () => {
      offset -= 1;
      track.style.transform = `translateX(${offset}px)`;
      if (Math.abs(offset) >= track.scrollWidth / 2) offset = 0;
    };

    const interval = setInterval(slide, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
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

      {/* Calorie Section */}
      <section className="calorie-section">
        <div className="calorie-container">
          <div className="calorie-image">
            <img src="18.png" alt="Healthy food and calorie tracking" />
          </div>
          <div className="calorie-text">
            <h2>
              Looking for a Free <br />
              Cal AI Alternative? <br />
              Here’s the Ultimate Solution
            </h2>
            <p>
              In a world where calorie tracking has become a cornerstone of healthy living,
              finding a user-friendly, accurate, and free calorie counting app can feel like
              searching for a needle in a haystack...
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <div className="features-container">
        <div className="feature-card large-card">
          <div>
            <h3>Calorie Calculator</h3>
            <ul>
              <li>Calorie Tracker Just Snap, so easy!</li>
              <li>AI-powered, unmatched convenience.</li>
              <li>Real-time analysis for effortless weight loss.</li>
              <li>No hassle, long-lasting tracking.</li>
            </ul>
          </div>
          <img src="19.png" alt="Calorie Calculator" />
        </div>

        <div className="feature-card">
          <div>
            <h3>Food Calorie Finder</h3>
            <ul>
              <li>The most complete food Calorie database</li>
              <li>AI adds more detailed information</li>
              <li>Provides scientific dietary advice</li>
              <li>Search by photos, keywords, or chat</li>
            </ul>
          </div>
          <img src="20.png" alt="Food Calorie Finder" />
        </div>

        <div className="feature-card">
          <div>
            <h3>Weight loss Pal</h3>
            <ul>
              <li>Real-time calorie tracking</li>
              <li>AI diet plan analysis</li>
              <li>Personal coach support</li>
              <li>Handles multiple tasks easily</li>
            </ul>
          </div>
          <img src="21.png" alt="Weight loss Pal" />
        </div>
      </div>

      {/* AI Calorie Counter */}
      <section className="cal-counter-section">
        <h2 className="counter-heading">AI Powered Calorie Counter</h2>

        <div className="counter-container">
          <svg className="connector-svg" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
            {/* Left connections */}
            <path d="M400,200 C300,200 280,140 250,120" className="connector-path" />
            <path d="M400,200 C300,200 280,200 250,200" className="connector-path" />
            <path d="M400,200 C300,200 280,260 250,280" className="connector-path" />
            {/* Right connections */}
            <path d="M400,200 C500,200 520,80 550,80" className="connector-path" />
            <path d="M400,200 C500,200 520,150 550,170" className="connector-path" />
            <path d="M400,200 C500,200 520,250 550,250" className="connector-path" />
            <path d="M400,200 C500,200 520,320 550,320" className="connector-path" />
          </svg>

          <div className="counter-left">
            <div className="counter-option"><i className="fas fa-camera"></i> Snap a photo</div>
            <div className="counter-option"><i className="fas fa-comments"></i> Chat with cal counter</div>
            <div className="counter-option"><i className="fas fa-file-alt"></i> Input a file</div>
          </div>

          <div className="counter-center">
            <div className="center-circle">
              <div className="inner-circle">
                <div>Cal Counter</div>
                <span>AI Analyze</span>
              </div>
              <div className="arrow left-arrow" />
              <div className="arrow right-arrow" />
            </div>
          </div>

          <div className="counter-right">
            <div className="counter-option"><i className="fas fa-chart-pie"></i> Calorie chart</div>
            <div className="counter-option"><i className="fas fa-clipboard-list"></i> Nutritional analysis</div>
            <div className="counter-option"><i className="fas fa-utensils"></i> Dietary advice</div>
            <div className="counter-option"><i className="fas fa-user-check"></i> Weight loss assistant</div>
          </div>
        </div>

        <div className="counter-benefits">
          <div className="benefit-card">
            <h4><span className="highlight">50% time saved</span></h4>
            <ul>
              <li>Photo recognition</li>
              <li>No need for manual input</li>
              <li>Real-time calculation</li>
            </ul>
          </div>
          <div className="benefit-card">
            <h4><span className="highlight">More accurate</span></h4>
            <ul>
              <li>AI-driven database</li>
              <li>Mixed food analysis</li>
            </ul>
          </div>
          <div className="benefit-card">
            <h4><span className="highlight">Smart Partner</span></h4>
            <ul>
              <li>Real-time advice</li>
              <li>Long-term memory</li>
              <li>Scientific guidance</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Nutrition Tracker */}
      <div className="tracker-container">
        <div className="tracker-left">
          <p className="tracker-label">TRACK FOOD</p>
          <h1 className="tracker-heading">A powerfully accurate<br />nutrition tracker</h1>
          <p className="tracker-subtext">
            Upload an image to easily track your calories and up to 84 other nutrients with data you can trust.
          </p>
          <Link to="/login" className="learn-more">
            LEARN MORE <span className="arrow">➔</span>
          </Link>
        </div>
        <div className="tracker-right">
          <div className="tracker-image-wrapper">
            <img src="17.png" alt="Nutrition Bowl" className="tracker-image" />
          </div>
        </div>
      </div>

      {/* Health Tracking */}
      <div className="health-tracking-container">
        <div className="health-tracking-left">
          <img src="23.png" alt="Health tracking food" className="health-image" />
        </div>
        <div className="health-tracking-right">
          <div className="health-card">
            <p className="health-label">OVERALL HEALTH</p>
            <h2 className="health-title">Track exercise and other health metrics</h2>
            <p className="health-description">
              Gain a complete understanding of your health with an app that tracks exercise, weight and so many other health metrics.
            </p>
            <Link to="/login" className="health-link">LEARN MORE <span className="arrow">➔</span></Link>
          </div>
          <div className="health-card">
            <p className="health-label">ANY DIET</p>
            <h2 className="health-title">Custom tracking specific to your diet</h2>
            <p className="health-description">
              Keto, vegan, and beyond, embrace your unique diet with an adaptable solution.
            </p>
            <Link to="/login" className="health-link">LEARN MORE <span className="arrow">➔</span></Link>
          </div>
        </div>
      </div>

      {/* Diet Analysis */}
      <div className="analysis-container">
        <div className="analysis-left">
          <p className="analysis-label">ANALYZE</p>
          <h1 className="analysis-heading">Simple diet analysis<br />for better results</h1>
          <p className="analysis-subtext">
            Loaded with tools to help make sense of your nutrition data.
          </p>
          <Link to="/login" className="learn-more">LEARN MORE <span className="arrow">➔</span></Link>
        </div>
        <div className="analysis-right">
          <img src="22.png" alt="Diet Analysis" className="analysis-image" />
        </div>
      </div>

      {/* Footer */}
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

    </>
  );
}

export default Solution;
