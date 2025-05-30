import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./About.css";
import logo from './assets/Eatopia.png';
import '@fortawesome/fontawesome-free/css/all.min.css';

function About() {
  const [menuOpen, setMenuOpen] = useState(false);

  const faqList = [
    {
      question: "How does the AI recognize food?",
      answer:
        "We use deep learning models trained on thousands of food images. When you upload a picture, the model identifies the food item and estimates nutritional values.",
    },
    {
      question: "Do I need an internet connection to use the app?",
      answer:
        "Yes, an internet connection is required to process images and fetch real-time nutrition data from our cloud-based AI system.",
    },
    {
      question: "Is my personal and food data safe?",
      answer:
        "Absolutely. We store your data securely using industry-standard encryption and never share your personal information without consent.",
    },
    {
      question: "Can I track meals manually without uploading photos?",
      answer:
        "Yes, our app supports manual entry. You can search and log your meals directly through the interface.",
    },
    {
      question: "Will the app work for Indian food items?",
      answer:
        "Yes! We've trained our models with a diverse food dataset, including a wide variety of Indian meals and regional dishes.",
    },
    {
      question: "Can I set diet goals or preferences?",
      answer:
        "Definitely! You can customize your dietary goals, allergies, and preferences to receive personalized suggestions and tracking insights.",
    },
  ];

  return (
    <>
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

      <section className="about-hero">
        <div className="about-hero-content">
          <h1>Welcome to Eatopia</h1>
          <p>Your AI-powered partner in achieving your fitness and nutrition goals.</p>
        </div>
        <img src="25.png" alt="About Eatopia" className="about-hero-img" />
      </section>

      <section className="about-mission">
        <div className="mission-text">
          <h2>Our Mission</h2>
          <p>
            At Eatopia, our mission is to help people build a healthier relationship with food through smart, intuitive tracking.
            We believe that understanding what you eat is the first step toward a balanced lifestyle.<br /><br />
            By combining powerful AI with a user-friendly experience, we aim to simplify calorie counting,
            support personal nutrition goals, and make mindful eating accessible to everyone.
            Whether you're aiming to lose weight, manage a health condition, or just eat better—we’re here to support your journey, one meal at a time.
          </p>
        </div>
        <div className="mission-image">
          <img src="26.png" alt="Healthy eating" />
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <img src="34.png" alt="Upload" />
            <h3>1. Upload Your Meal</h3>
            <p>Take a picture of your food or upload an image.</p>
          </div>
          <div className="step">
            <img src="35.png" alt="AI Analysis" />
            <h3>2. AI Analysis</h3>
            <p>Our AI analyzes the image to detect food items and estimate calories.</p>
          </div>
          <div className="step">
            <img src="36.png" alt="Insights" />
            <h3>3. Get Insights</h3>
            <p>View nutritional breakdown, track intake, and monitor your goals.</p>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-content">
          <div className="hiw-image">
            <img src="27.png" alt="Healthy eating" />
          </div>
          <ul className="features-list">
            <li><span role="img" aria-label="AI">🤖</span> AI-powered food recognition</li>
            <li><span role="img" aria-label="Chart">📊</span> Real-time nutrition insights</li>
            <li><span role="img" aria-label="Calendar">📅</span> Personalized meal tracking</li>
            <li><span role="img" aria-label="Brain">🧠</span> Smart recommendations tailored to your goals</li>
          </ul>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2 className="faq-heading">Frequently Asked Questions</h2>
        <div className="faq-container">
          {faqList.map((faq, index) => (
            <details className="faq-item" key={index}>
              <summary className="faq-question">
                <span>{faq.question}</span>
                <span className="faq-icon">+</span>
              </summary>
              <p className="faq-answer">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="team-section">
        <h2 className="team-heading">Team Members</h2>
        <div className="team-content">
          <div className="team-members">
            <div className="team-member">Aerram Mokshitha</div>
            <div className="team-member">Gande Sanjana</div>
            <div className="team-member">Nidadala Rishikesh</div>
            <div className="team-member">Singireddy Akhil Reddy</div>
            <div className="team-member">Thulla Rakesh</div>
          </div>
          <div className="Team-Eatopia">
            <h3>Team Eatopia</h3>
            <p> We the Team - Eatopia collaboratively built an AI-powered web application aimed at simplifying calorie and nutrition tracking through food image recognition. Using cutting-edge deep learning models, the team trained and fine-tuned image recognition algorithms to accurately detect various food items and estimate portion sizes. The platform supports a wide range of cuisines—including Indian dishes—and allows users to either upload photos or manually log their meals. Each team member contributed across different areas: front-end development using React.js, back-end integration of AI models, dataset preparation, and UI/UX design. Together, the team created a real-time solution that empowers users to track meals, set dietary goals, and gain personalized nutrition insights, all in one intuitive platform. </p>
          </div>
        </div>
      </section>


      <section className="cta-section">
        <h2>Start Your Healthy Journey Today</h2>
        <Link to="/Login" className="cta-button">Get Started</Link>
      </section>

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

export default About;
