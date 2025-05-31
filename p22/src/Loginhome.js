import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Loginhome.css";
import logo from './assets/Eatopia.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [logoutMsg, setLogoutMsg] = useState(""); // <-- Add this

  // Fetch user name on mount
  useEffect(() => {
    const fetchUserName = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("authToken");
      if (!userId || !token) return;
      try {
        const res = await axios.get(
          `https://eatopia-avc6.onrender.com/api/auth/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserName(res.data.username || "User");
      } catch (err) {
        setUserName("User");
      }
    };
    fetchUserName();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    const userId = queryParams.get('userId');

    if (token) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', userId);
    }
  }, []);

  const isActive = (path) => location.pathname === path;

  // Logout handler
  const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  setLogoutMsg("Logout successful!");
  setTimeout(() => {
    setLogoutMsg("");
    navigate("/Home");
  }, 1500);
};

  // BMI & BMR States
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [useMetric, setUseMetric] = useState(true);
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState(null);

  const convertToCm = () => parseFloat(heightFt || 0) * 30.48 + parseFloat(heightIn || 0) * 2.54;
  const convertToKg = () => parseFloat(weight || 0) * 0.453592;

  const calculate = () => {
    const height = useMetric ? parseFloat(heightCm || 0) : convertToCm();
    const weightKg = useMetric ? parseFloat(weight || 0) : convertToKg();

    if (!age || !height || !weightKg || isNaN(height) || isNaN(weightKg)) {
      alert("Please fill all required fields correctly.");
      return;
    }

    const bmi = weightKg / ((height / 100) ** 2);
    const bmr = gender === 'Male'
      ? 10 * weightKg + 6.25 * height - 5 * parseInt(age) + 5
      : 10 * weightKg + 6.25 * height - 5 * parseInt(age) - 161;

    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal weight';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';

    setResult({ bmi: bmi.toFixed(2), bmr: bmr.toFixed(2), category });
  };

  const reset = () => {
    setAge('');
    setGender('Male');
    setHeightCm('');
    setHeightFt('');
    setHeightIn('');
    setUseMetric(true);
    setWeight('');
    setResult(null);
  };

  // ================= QUIZ =================

  const allQuestions = [
    { question: "What vitamin do you get from sunlight?", options: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"], answer: "Vitamin D" },
    { question: "Which organ is primarily responsible for detoxifying the body?", options: ["Lungs", "Liver", "Heart", "Kidneys"], answer: "Liver" },
    { question: "How much of the human body is water?", options: ["30%", "50%", "60%", "80%"], answer: "60%" },
    { question: "What is the average recommended daily steps for good health?", options: ["2,000", "5,000", "8,000", "10,000"], answer: "10,000" },
    { question: "Which nutrient helps build and repair tissues?", options: ["Carbohydrates", "Fats", "Proteins", "Vitamins"], answer: "Proteins" },
    { question: "Which mineral is important for strong bones?", options: ["Iron", "Potassium", "Calcium", "Zinc"], answer: "Calcium" },
    { question: "How many hours of sleep is generally recommended for adults?", options: ["4–5", "6–7", "7–9", "10–12"], answer: "7–9" },
    { question: "Which organ pumps blood throughout the body?", options: ["Lungs", "Kidney", "Brain", "Heart"], answer: "Heart" },
    { question: "Which food is high in healthy fats?", options: ["Potatoes", "White rice", "Avocados", "Chicken"], answer: "Avocados" },
    { question: "Which vitamin is good for your eyesight?", options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin B12"], answer: "Vitamin A" },
    { question: "Which activity burns more calories?", options: ["Walking", "Sleeping", "Watching TV", "Running"], answer: "Running" },
    { question: "Which fruit is rich in potassium?", options: ["Apple", "Banana", "Orange", "Grapes"], answer: "Banana" },
    { question: "Which is a source of lean protein?", options: ["Butter", "Beef", "Tofu", "Cheese"], answer: "Tofu" },
    { question: "Which of these is NOT a macronutrient?", options: ["Protein", "Carbohydrates", "Vitamins", "Fats"], answer: "Vitamins" },
    { question: "Which food is a probiotic?", options: ["Rice", "Yogurt", "Bread", "Potatoes"], answer: "Yogurt" },
    { question: "What does hydration help with?", options: ["Sleep", "Digestion", "Skin health", "All of the above"], answer: "All of the above" },
    { question: "Which beverage is the healthiest?", options: ["Soda", "Juice", "Water", "Energy drinks"], answer: "Water" },
    { question: "Which nutrient gives the most energy per gram?", options: ["Protein", "Fat", "Carbs", "Fiber"], answer: "Fat" },
    { question: "Which organ helps you breathe?", options: ["Liver", "Lung", "Kidney", "Heart"], answer: "Lung" },
    { question: "Which of these is a whole grain?", options: ["White rice", "Brown rice", "Flour", "White bread"], answer: "Brown rice" },
    { question: "How often should you exercise per week (minimum)?", options: ["1 day", "2 days", "3 days", "5 days"], answer: "3 days" },
    { question: "Which one is NOT a sign of dehydration?", options: ["Dry mouth", "Fatigue", "Frequent urination", "Dark urine"], answer: "Frequent urination" },
    { question: "What’s the best time to drink water for digestion?", options: ["Before meals", "During meals", "After meals", "Midnight"], answer: "Before meals" },
    { question: "Which vitamin helps fight infections?", options: ["Vitamin D", "Vitamin E", "Vitamin C", "Vitamin K"], answer: "Vitamin C" },
    { question: "What is a common food allergen?", options: ["Rice", "Milk", "Carrots", "Spinach"], answer: "Milk" },
    { question: "Which oil is healthiest for cooking?", options: ["Palm oil", "Butter", "Olive oil", "Coconut oil"], answer: "Olive oil" },
    { question: "Which is better for weight loss?", options: ["Crash diets", "Balanced diet", "Skipping meals", "Only fruit diet"], answer: "Balanced diet" },
    { question: "Which drink contains the most caffeine?", options: ["Tea", "Coffee", "Soda", "Energy drinks"], answer: "Coffee" },
    { question: "Which is a mental health benefit of exercise?", options: ["More anxiety", "Less focus", "Better mood", "More stress"], answer: "Better mood" },
    { question: "Which food is best for gut health?", options: ["Candy", "Yogurt", "Fried chicken", "Pasta"], answer: "Yogurt" }
  ];

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  const startQuiz = () => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    setQuizQuestions(selected);
    setQuizStarted(true);
    setQuizIndex(0);
    setSelectedOption(null);
    setQuizScore(0);
    setQuizFinished(false);
    setUserAnswers([]);
    setShowReview(false);
  };

  const handleOption = (option) => setSelectedOption(option);

  const nextQuestion = () => {
    const current = quizQuestions[quizIndex];
    const isCorrect = selectedOption === current.answer;

    setUserAnswers((prev) => [
      ...prev,
      {
        question: current.question,
        options: current.options,
        selected: selectedOption,
        correct: current.answer,
        isCorrect,
      },
    ]);

    if (isCorrect) setQuizScore((prev) => prev + 1);

    if (quizIndex + 1 < quizQuestions.length) {
      setQuizIndex(quizIndex + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setQuizStarted(false);
    setQuizQuestions([]);
    setQuizIndex(0);
    setSelectedOption(null);
    setQuizScore(0);
    setQuizFinished(false);
    setUserAnswers([]);
    setShowReview(false);
  };

      return (
    <>
      <nav className="navbar1">
        <img src={logo} alt="Eatopia Logo" className="logo" />
        <span className="logo-text1">EATOPIA</span>

        <ul className={`nav-links ${menuOpen ? "show" : ""}`}>
          <li><Link to="/Loginhome" className={`nav-link ${isActive("/Loginhome") ? "active" : ""}`}>Home</Link></li>
          <li><Link to="/Imageup" className={`nav-link ${isActive("/Imageup") ? "active" : ""}`}>Image Upload</Link></li>
          <li><Link to="/Textc" className={`nav-link ${isActive("/Textc") ? "active" : ""}`}>Text Analysis</Link></li>
          <li><Link to="/Dietc" className={`nav-link ${isActive("/Dietc") ? "active" : ""}`}>Diet Analysis</Link></li>
          <li><Link to="/Userdet" className={`nav-link ${isActive("/Userdet") ? "active" : ""}`}>User Details</Link></li>
          <li>
  <button
    className="nav-link logout"
    onClick={() => {
      const confirmed = window.confirm("Are you sure you want to logout?");
      if (confirmed) {
        handleLogout(); // Do logout only if confirmed
      }
    }}
    style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
  >
    Logout
  </button>
</li>
        </ul>

        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✖" : "☰"}
        </div>
      </nav>

      {/* Use userName here */}
      <div className="welcome-section">
        <h2>Welcome to Eatopia {userName}</h2>
        <p>Your smart diet and wellness companion powered by AI.</p>
      </div>

      <div className="video-container">
        <video width="100%" height="630" loop autoPlay muted>
          <source src="/vid1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <section className="tips-section">
        <h2>💡 Daily Health Tips & Hacks</h2>
        <div className="tips-cards">
          <div className="tip-card left1">
            <img src="/30.png" alt="Tip 1" className="tip-img1" />
            <div className="tip-text">
              <h3>💧 Drink Water Before Meals</h3>
              <p>Boost metabolism and reduce calorie intake naturally.</p>
            </div>
          </div>

          <div className="tip-card right">
            <img src="/31.png" alt="Tip 2" className="tip-img2" />
            <div className="tip-text">
              <h3>🥬 Start with Greens</h3>
              <p>Eat fiber-rich veggies first to slow sugar absorption.</p>
            </div>
          </div>

          <div className="tip-card left2">
            <img src="/32.png" alt="Tip 3" className="tip-img3" />
            <div className="tip-text">
              <h3>🚫 Mindful Eating</h3>
              <p>Put your phone away. Focus on food to avoid overeating.</p>
            </div>
          </div>
        </div>

        <div className="bmi-bmr-container">
      <h2 className="title">What are BMI and BMR?</h2>
      <div className="boxes-wrapper">
        <div className="info-box">
          <h3 className="subtitle">BMI - Body Mass Index</h3>
          <p className="description">
            BMI is a number calculated from your weight and height. It helps determine whether you are underweight, normal weight, overweight, or obese.
            It’s a quick way to assess if your body weight is healthy.
          </p>
        </div>

        <div className="info-box">
          <h3 className="subtitle">BMR - Basal Metabolic Rate</h3>
          <p className="description">
            BMR is the number of calories your body needs to perform basic life-sustaining functions like breathing, circulation, and cell production, while at rest.
            It helps estimate how many calories you burn even when you're doing nothing.
          </p>
        </div>
      </div>
    </div>
    <div className="bmi-info-container">
  <h3>BMI Categories:</h3>
  <ul className="bmi-list">
  <li><span>Underweight</span> = &lt;18.5</li>
  <li><span>Normal weight</span> = 18.5–24.9</li>
  <li><span>Overweight</span> = 25–29.9</li>
  <li><span>Obesity</span> = BMI of 30 or greater</li>
</ul>


  <h4 className="action-title">What Next? Take Action Towards Better Health:</h4>

  <div className="health-links">
    <div className="health-section">
      <a>Maintain a Healthy Weight</a>
      <ul>
        <li>Maintaining a healthy weight is important for your heart health.</li>
        
      </ul>
    </div>

    <div className="health-section">
      <a>Increase Physical Activity</a>
      <ul>
        <li>Moving more can lower your risk factors for heart disease.</li>
      </ul>
    </div>

    <div className="health-section">
      <a>Eat a Heart-Healthy Diet</a>
      <ul>
        <li>Eating a healthy diet is the key to heart disease prevention.</li>
      </ul>
    </div>

    <div className="health-section">
      <a>Know and Control Your Heart Health Numbers</a>
      <ul>
        <li>Tracking your heart health stats can help you meet your heart health goals.</li>
      </ul>
    </div>
  </div>
</div>

    



   

    

        <div className="bmi-container">
          <h1>Body Mass Index & Basal Metabolic Rate Calculator</h1>

          <div className="input-group">
            <label>Age (years):</label>
            <input value={age} onChange={(e) => setAge(e.target.value)} />
          </div>

          <div className="input-group">
            <label>Gender:</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <div className="input-group">
            <label>Unit System:</label>
            <select value={useMetric ? 'Metric' : 'Imperial'} onChange={(e) => setUseMetric(e.target.value === 'Metric')}>
              <option>Metric</option>
              <option>Imperial</option>
            </select>
          </div>

          {useMetric ? (
            <div className="input-group">
              <label>Height (cm):</label>
              <input value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
            </div>
          ) : (
            <div className="input-row">
              <div className="input-group">
                <label>Height (ft):</label>
                <input value={heightFt} onChange={(e) => setHeightFt(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Height (in):</label>
                <input value={heightIn} onChange={(e) => setHeightIn(e.target.value)} />
              </div>
            </div>
          )}

          <div className="input-group">
            <label>Weight ({useMetric ? 'kg' : 'lbs'}):</label>
            <input value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>

          <button className="btn" onClick={calculate}>Calculate</button>

          {result && (
            <div className="result">
              <h2>Results</h2>
              <p><strong> Body Mass Index(BMI) : </strong> {result.bmi}</p>
              <p><strong>Category:</strong> {result.category}</p>
              <p><strong>Basal Metabolic Rate(BMR) : </strong> {result.bmr} kcal/day</p>
              <button className="btn reset" onClick={reset}>Reset</button>
            </div>
          )}
        </div>
      </section>

      <section className="myths-facts">
        <h2>❌ Myths vs ✅ Facts</h2>
        {[
          {
            myth: "Carbs make you fat",
            fact: "Complex carbs like whole grains are essential and help in weight management when eaten moderately."
          },
          {
            myth: "Eating fat makes you fat",
            fact: "Healthy fats like nuts and avocado support brain function and hormones."
          },
          {
            myth: "You need juice cleanses to detox",
            fact: "Your liver and kidneys naturally detox your body—no cleanse needed."
          },
          {
            myth: "Skipping meals helps you lose weight",
            fact: "Skipping meals slows metabolism and may lead to overeating later."
          },
          {
            myth: "Eating after 8 PM causes weight gain",
            fact: "Weight gain depends on total calories, not meal timing."
          },
          {
            myth: "More sweat = more fat burned",
            fact: "Sweating is just your body cooling down, not fat loss."
          },
          {
            myth: "Supplements replace real food",
            fact: "Whole foods provide fiber and nutrients supplements can’t."
          },
          {
            myth: "Healthy food is expensive",
            fact: "Basic healthy items like fruits, oats, and lentils are budget-friendly."
          },
          {
            myth: "All calories are equal",
            fact: "Quality matters—100 calories of junk ≠ 100 calories of veggies."
          },
          {
            myth: "You must drink protein immediately after workouts",
            fact: "You can consume protein within 1–2 hours post workout for best results."
          }
        ].map((item, index) => (
          <div className="myth-fact-pair" key={index}>
            <div className="myth-column">
              <h3>❌ Myth</h3>
              <p>{item.myth}</p>
            </div>
            <div className="fact-column">
              <h3>✅ Fact</h3>
              <p>{item.fact}</p>
            </div>
          </div>
        ))}


      {/* Quiz Section */}
      <section className="quiz-section">
        <h2>🎯 Quick Health Quiz</h2>

        {!quizStarted ? (
          <div className="quiz-container">
            <p>Test your health knowledge in a fun way!</p>
            <button className="btn" onClick={startQuiz}>Start Quiz</button>
          </div>
        ) : quizFinished ? (
          <div className="quiz-container">
            <div className="quiz-score">You scored {quizScore} out of {quizQuestions.length}!</div>
            <button className="btn" onClick={() => setShowReview(true)}>Review Answers</button>
            <button className="btn" style={{ marginLeft: "10px" }} onClick={restartQuiz}>Try Again</button>
          </div>
        ) : (
          <div className="quiz-container">
            <h3>Question {quizIndex + 1} of {quizQuestions.length}</h3>
            <p className="quiz-question">{quizQuestions[quizIndex].question}</p>
            <div className="quiz-options">
              {quizQuestions[quizIndex].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOption(opt)}
                  className={`quiz-option ${selectedOption === opt ? "selected" : ""}`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <button className="btn" onClick={nextQuestion} disabled={selectedOption === null}>
              {quizIndex + 1 === quizQuestions.length ? "Finish" : "Next"}
            </button>
          </div>
        )}

        {showReview && (
          <div className="review-container">
            <h3>📋 Review Answers</h3>
            {userAnswers.map((item, idx) => (
              <div key={idx} className="review-card">
                <p><strong>Q{idx + 1}:</strong> {item.question}</p>
                <p>
                  Your Answer:
                  <span style={{ color: item.isCorrect ? "green" : "red", fontWeight: "bold" }}>
                    {" "}{item.selected}
                  </span>
                </p>
                {!item.isCorrect && (
                  <p>✅ Correct Answer: <strong>{item.correct}</strong></p>
                )}
                <hr />
              </div>
            ))}
          </div>
        )}
      </section>
      <div className="footer-image">
  <img src="/33.png" alt="Stay Healthy with Eatopia" />
</div>
{logoutMsg && (
  <div className="logout-popup">{logoutMsg}</div>
)}
      </section>
      <footer className="footer">
  <div className="footer-bottom">
    <p>reach us at:</p>
    <p><a href="mailto:support@eatopiaaa.com">eatopiaaa@email.com</a></p>
    <p>Copyright © 2025 Eatopia. All rights reserved.</p>
  </div>
</footer>
    </>
  );
};

export default Navbar;
