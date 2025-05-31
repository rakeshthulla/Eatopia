import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import './Dietc.css'; // CSS for navbar and food history
import logo from './assets/Eatopia.png';

function FoodHistoryByDate() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [userData, setUserData] = useState(null);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  

  const fetchFoodItems = async (date) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('authToken');
    if (!userId || !date || !token) return;
    try {
      const formattedDate = formatLocalDate(date);
      const response = await axios.get(
        `https://eatopia-avc6.onrender.com/api/food-history?userId=${userId}&date=${formattedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFoodItems(response.data);
    } catch (error) {
      console.error('Error fetching food items:', error);
    }
  };

  const fetchUserData = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('authToken');
    if (!userId || !token) return;
    try {
      const response = await axios.get(
        `https://eatopia-avc6.onrender.com/api/auth/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('authToken');
    if (!window.confirm('Are you sure you want to delete this food item?')) return;
    try {
      await axios.delete(
        `https://eatopia-avc6.onrender.com/api/food-history/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFoodItems(foodItems.filter(item => item._id !== id));
    } catch (error) {
      alert('Failed to delete food item.');
    }
  };

  useEffect(() => {
    fetchFoodItems(selectedDate);
    fetchUserData();
  }, [selectedDate]);

  const totalCalories = foodItems.reduce((sum, item) => sum + (item.calories || 0), 0);

  const calculateBMR = () => {
    if (!userData?.gender || !userData.dob || !userData.height || !userData.currentWeight) return null;

    const { gender, dob, height, currentWeight } = userData;
    // Calculate age from dob
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    const bmr = gender === 'Male'
      ? 10 * currentWeight + 6.25 * height - 5 * age + 5
      : 10 * currentWeight + 6.25 * height - 5 * age - 161;

    return bmr;
  };

  const getActivityFactor = () => {
    const level = userData?.activityLevel?.toLowerCase();
    switch (level) {
      case 'sedentary': return 1.2;
      case 'lightly active': return 1.375;
      case 'moderately active': return 1.55;
      case 'very active': return 1.725;
      case 'super active': return 1.9;
      default: return 1.2;
    }
  };

  const bmr = calculateBMR();
  const tdee = bmr ? (bmr * getActivityFactor()).toFixed(2) : null;
  const calorieDiff = tdee ? totalCalories - tdee : null;

  const calorieMessage = () => {
    if (calorieDiff == null) return null;
    if (Math.abs(calorieDiff) <= 100) return { text: 'You are on track with your calorie goal!', color: '#2ecc71' };
    if (calorieDiff > 0) return { text: 'You have exceeded your calorie goal!', color: '#e74c3c' };
    return { text: 'You are under your calorie goal.', color: '#f39c12' };
  };

  const message = calorieMessage();

  return (
    <>
      {/* Navbar */}
      <nav className="navbar1">
        <div className="logo-container">
          <img src={logo} alt="Eatopia Logo" className="logo" />
          <span className="logo-text1">EATOPIA</span>
        </div>
        <ul className={`nav-links ${menuOpen ? 'show' : ''}`}>
          <li><Link to="/Loginhome" className={`nav-link ${isActive("/Loginhome") ? "active" : ""}`}>Home</Link></li>
          <li><Link to="/Imageup" className={`nav-link ${isActive("/Imageup") ? "active" : ""}`}>ImageUpload</Link></li>
          <li><Link to="/Textc" className={`nav-link ${isActive("/Textc") ? "active" : ""}`}>Text Analysis</Link></li>
          <li><Link to="/Dietc" className={`nav-link ${isActive("/Dietc") ? "active" : ""}`}>Diet Analysis</Link></li>
          <li><Link to="/Userdet" className={`nav-link ${isActive("/Userdet") ? "active" : ""}`}>User Details</Link></li>
        </ul>
        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✖" : "☰"}
        </div>
      </nav>

      {/* Main Content */}
      <div className="calendar-wrapper">
      <div className="food-history-container">
        <h2>Select a date to view food history</h2>
        <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          inline
          minDate={new Date(2000, 0, 1)}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
        />
        </div>

        {/* TDEE Info Box */}
<div className="tdee-info-box">
  <strong>What is TDEE?</strong><br />
  Total Daily Energy Expenditure (TDEE) is the total calories your body burns daily, including all activities and bodily functions. It helps you understand your calorie needs for weight management.
</div>

        

        {foodItems.length > 0 && (
           <h3 className="total-calories-heading">
    Total Calories for {formatLocalDate(selectedDate)}:
    <span className="highlight total-calories-value"> {totalCalories} kcal</span>
  </h3>
        )}

        <div className="food-results">
  {userData?.bmi && (
    <h3>Your BMI: <span className="highlight-blue">{userData.bmi}</span></h3>
  )}

  {tdee && (
    <>
      <h3>Your TDEE (based on activity level): <span className="highlight-blue">{tdee} kcal</span></h3>
      <h3 className="tdee-message" style={{ color: message?.color }}>{message?.text}</h3>
    </>
  )}
</div>
        <div className="food-items">
          {foodItems.map((item, index) => (
            <div key={index} className="food-card">
              {item.imageUrl && (
                <img
                  src={`https://eatopia-avc6.onrender.com${item.imageUrl}`}
                  alt={item.foodName}
                  className="food-img"
                />
              )}
              <h3>{item.foodName}</h3>
              <p><strong>Calories:</strong> {item.calories} kcal</p>
              <p><strong>Protein:</strong> {item.protein} g</p>
              <p><strong>Carbs:</strong> {item.carbohydrates} g</p>
              <p><strong>Fat:</strong> {item.fat} g</p>
              <p><strong>Fiber:</strong> {item.fiber} g</p>
              <p><strong>Sugar:</strong> {item.sugar} g</p>
              <p><strong>Cholesterol:</strong> {item.cholesterol} mg</p>
              {item.explanation && <p><strong>Note:</strong> {item.explanation}</p>}
              <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
            </div>
          ))}
        </div>


      </div>
      
        <footer className="footer">
  <div className="footer-bottom">
    <p>reach us at:</p>
    <p><a href="mailto:support@eatopiaaa.com">eatopiaaa@email.com</a></p>
    <p>Copyright © 2025 Eatopia. All rights reserved.</p>
  </div>
</footer>
    </>
  );
}

export default FoodHistoryByDate;
