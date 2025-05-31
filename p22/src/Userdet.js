import React, { useState, useEffect } from 'react';
  import { FaEnvelope } from 'react-icons/fa';
  import axios from 'axios';
  import { useNavigate } from 'react-router-dom';
  import { Link, useLocation } from 'react-router-dom';
  import logo from './assets/Eatopia.png';

  const Navbar = () => {
    const [showNavbar, setShowNavbar] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    let lastScrollY = window.scrollY;

    useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY > lastScrollY) {
          setShowNavbar(false);
        } else {
          setShowNavbar(true);
        }
        lastScrollY = window.scrollY;
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
      <nav className={`navbar1 ${showNavbar ? "" : "hidden"}`}>
        <div className="logo-container">
          <img src={logo} alt="Eatopia Logo" className="logo" />
          <span className="logo-text1">EATOPIA</span>
        </div>

        <ul className={`nav-links ${menuOpen ? "show" : ""}`}>
          <li><Link to="/Loginhome" className={`nav-link ${isActive("/Loginhome") ? "active" : ""}`}>Home</Link></li>
          <li><Link to="/Imageup" className={`nav-link ${isActive("/Imageup") ? "active" : ""}`}>Image Upload</Link></li>
          <li><Link to="/Textc" className={`nav-link ${isActive("/Textc") ? "active" : ""}`}>Text Analysis</Link></li>
          <li><Link to="/Dietc" className={`nav-link ${isActive("/Dietc") ? "active" : ""}`}>Diet Analysis</Link></li>
          <li><Link to="/Userdet" className={`nav-link ${isActive("/Userdet") ? "active" : ""}`}>User Details</Link></li>
        </ul>

        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✖" : "☰"}
        </div>
      </nav>
    );
  };

  const UserProfile = () => {
    const [userData, setUserData] = useState({});
    const [goalData, setGoalData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [successMsg, setSuccessMsg] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("authToken");
      if (!userId || !token) {
        console.error("User ID or token not found in localStorage");
        return;
      }

      const fetchData = async () => {
        try {
          const userRes = await axios.get(
            `https://eatopia-avc6.onrender.com/api/auth/user/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUserData(userRes.data);
          console.log("User data retrieved:", userRes.data); // <-- Add this line

          const goalRes = await axios.get(
            `https://eatopia-avc6.onrender.com/api/goal/user/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setGoalData(goalRes.data);
          console.log("Goal data retrieved:", goalRes.data); // <-- Add this line
        } catch (error) {
          console.error("Failed to fetch user or goal data:", error);
        }
      };

      fetchData();
    }, []);

    const MultiSelect = ({ label, options, selected, onChange, className }) => {
      const [isOpen, setIsOpen] = useState(false);

      const toggleOption = (option) => {
        // Mutually exclusive "None" logic for both medical and food preferences
        if (option === 'none' || option === 'None') {
          onChange(['none']);
        } else {
          const newSelected = selected.includes(option)
            ? selected.filter(item => item !== option)
            : [...selected.filter(item => item !== 'none' && item !== 'None'), option];
          onChange(newSelected);
        }
      };

      return (
        <div className={`multi-select-container ${className}`}>
          <label className="input-label">{label}</label>
          <div className="multi-select" onClick={() => setIsOpen(!isOpen)}>
            {selected.length > 0 ? (
              <div className="selected-tags">
                {selected.map(item => (
                  <span key={item} className="tag">
                    {item}
                    <button 
                      type="button" 
                      className="tag-remove" 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOption(item);
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="placeholder">Select {label.toLowerCase()}...</div>
            )}
            <div className="dropdown-arrow">▼</div>
          </div>
          
          {isOpen && (
            <div className="multi-select-options">
              {options.map(option => (
                <div
                  key={option.value}
                  className={`option ${selected.includes(option.value) ? 'selected' : ''}`}
                  onClick={() => toggleOption(option.value)}
                >
                  {option.label}
                  {selected.includes(option.value) && <span className="checkmark">✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };

    const medicalOptions = [
  { value: 'none', label: 'None' },
  { value: 'diabetes', label: 'Diabetes' },
  { value: 'allergies', label: 'Allergies' },
  { value: 'hypertension', label: 'Hypertension' },
  { value: 'asthma', label: 'Asthma' },
  { value: 'heart_disease', label: 'Heart Disease' },
  { value: 'thyroid', label: 'Thyroid Disorder' },
  { value: 'cholesterol', label: 'High Cholesterol' },
  { value: 'GERD', label: 'GERD' },
  { value: 'obesity', label: 'Obesity' },
  { value: 'anemia', label: 'Anemia' },
  { value: 'fatty_liver', label: 'Fatty Liver' },
  { value: 'kidney_stones', label: 'Kidney Stones' },
  { value: 'migraines', label: 'Migraines' }
];

    const foodOptions = [
      { value: 'vegetarian', label: 'Vegetarian' },
      { value: 'non-vegetarian', label: 'Non-Vegetarian' },
      { value: 'vegan', label: 'Vegan' },
      { value: 'gluten-free', label: 'Gluten-Free' },
      { value: 'keto', label: 'Keto' },
      { value: 'dairy', label: 'Dairy' },
      { value: 'gluten', label: 'Gluten' },
      { value: 'nuts', label: 'Nuts' },
      { value: 'seafood', label: 'Seafood' },
      { value: 'onions', label: 'Onions' },
      { value: 'soy', label: 'Soy' },
      { value: 'eggs', label: 'Eggs' },
      { value: 'none', label: 'None' },
    ];

    const handleSave = async (e) => {
      e.preventDefault();
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("authToken");

        if (!token) {
          console.error("No token found in localStorage");
          return;
        }

        await axios.put(
          `https://eatopia-avc6.onrender.com/api/auth/user/${userId}`,
          {
            username: editData.username,
            gender: editData.gender,
            age: editData.age,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await axios.put(
          `https://eatopia-avc6.onrender.com/api/goal/${userId}`,
          {
            goal: editData.goal,
            currentWeight: parseFloat(editData.currentWeight),
            goalWeight: parseFloat(editData.goalWeight),
            height: parseFloat(editData.height),
            activity: editData.activity,
            medicalIssues: Array.isArray(editData.medicalIssues) ? editData.medicalIssues.join(', ') : editData.medicalIssues,
            foodPreferences: Array.isArray(editData.foodPreferences) ? editData.foodPreferences.join(', ') : editData.foodPreferences,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Fetch updated user and goal data
        const userRes = await axios.get(
  `https://eatopia-avc6.onrender.com/api/auth/user/${userId}`,
  { headers: { Authorization: `Bearer ${token}` } }
);
setUserData(userRes.data);

const goalRes = await axios.get(
  `https://eatopia-avc6.onrender.com/api/goal/user/${userId}`,
  { headers: { Authorization: `Bearer ${token}` } }
);
setGoalData(goalRes.data);
        setIsEditing(false);
        setSuccessMsg("User details updated successfully!");

        setTimeout(() => setSuccessMsg(""), 2000);
      } catch (error) {
        console.error("Failed to update user or goals:", error.response?.data || error.message);
      }
    };

    const getAvatarByGender = (gender, username) => {
      const seed = username ? encodeURIComponent(username.toLowerCase()) : 'default';
      if (!gender) {
        return `https://avatars.dicebear.com/api/adventurer-neutral/${seed}.svg`;
      }
      switch (gender.toLowerCase()) {
        case 'male':
          return '/male.jpg';
        case 'female':
          return '/female.jpg';
        default:
          return '/other.jpg';
      }
    };

    const calculateAge = (dob) => {
      if (!dob) return 'Not provided';
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    };

    return (
      <div>
        {successMsg && (
          <div className="success-popup">
            {successMsg}
          </div>
        )}

        <Navbar />
        <div className="user-profile-container">
          <div className="main-content">
            <div className="profile-section">
              <div className="profile-card">
                <div className="profile-header">
                  <div className="profile-info">
                    <img
                      src={getAvatarByGender(userData.gender, userData.username)}
                      alt="profile"
                      className="profile-image"
                    />
                    <div>
                      <h2 className="profile-name">{userData.username || 'User'}</h2>
                      <p className="profile-email">{userData.email || 'No email provided'}</p>
                    </div>
                  </div>
                  <button
                    className="edit-button"
                    onClick={() => {
                      setEditData({ 
                        ...userData, 
                        ...goalData,
                        medicalIssues: goalData?.medicalIssues ? goalData.medicalIssues.split(',').map(s => s.trim()) : [],
                        foodPreferences: goalData?.foodPreferences ? goalData.foodPreferences.split(',').map(s => s.trim()) : []
                      });
                      setIsEditing(!isEditing);
                    }}
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {isEditing ? (
                  <form className="form-grid" onSubmit={handleSave}>
                    <div>
                      <label className="input-label">Full Name</label>
                      <input
                        type="text"
                        value={editData.username || ''}
                        onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="input-label">Gender</label>
                      <input
                        type="text"
                        className="input-field"
                        value={editData.gender || ''}
                        disabled
                      />
                    </div>
                    <div>
                      <label className="input-label">Age</label>
                      <input
                        type="number"
                        className="input-field"
                        value={editData.age || ''}
                        disabled
                      />
                    </div>
                    <div>
                      <label className="input-label">Height (cm)</label>
                      <input
                        type="number"
                        min="50"
                        max="300"
                        value={editData.height || ''}
                        onChange={(e) => setEditData({ ...editData, height: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="input-label">Current Weight (kg)</label>
                      <input
                        type="number"
                        min="10"
                        max="200"
                        value={editData.currentWeight || ''}
                        onChange={(e) => setEditData({ ...editData, currentWeight: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="input-label">Goal Weight (kg)</label>
                      <input
                        type="number"
                        min="10"
                        max="200"
                        value={editData.goalWeight || ''}
                        onChange={(e) => setEditData({ ...editData, goalWeight: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="input-label">Activity Level</label>
                      <select
                        className="input-field"
                        value={editData.activity || ''}
                        onChange={(e) => setEditData({ ...editData, activity: e.target.value })}
                      >
                        <option value="">Select Activity Level</option>
                        <option value="Sedentary">Sedentary</option>
                        <option value="Lightly Active">Lightly Active</option>
                        <option value="Moderately Active">Moderately Active</option>
                        <option value="Very Active">Very Active</option>
                      </select>
                    </div>
                    <div>
                      <label className="input-label">Goal</label>
                      <select
                        className="input-field"
                        value={editData.goal || ''}
                        onChange={(e) => setEditData({ ...editData, goal: e.target.value })}
                      >
                        <option value="">Select Goal</option>
                        <option value="Weight Loss">Weight Loss</option>
                        <option value="Muscle Gain">Muscle Gain</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>
                    <MultiSelect
                      label="Medical Issues"
                      options={medicalOptions}
                      selected={Array.isArray(editData.medicalIssues) ? editData.medicalIssues : (editData.medicalIssues ? editData.medicalIssues.split(',').map(s => s.trim()) : [])}
                      onChange={(selected) => setEditData({ ...editData, medicalIssues: selected })}
                    />
                    <MultiSelect
                      label="Food Preferences"
                      options={foodOptions}
                      selected={Array.isArray(editData.foodPreferences) ? editData.foodPreferences : (editData.foodPreferences ? editData.foodPreferences.split(',').map(s => s.trim()) : [])}
                      onChange={(selected) => setEditData({ ...editData, foodPreferences: selected })}
                    />
                    <div className="form-actions">
                      <button type="submit" className="save-button">Save Changes</button>
                    </div>
                  </form>
                ) : (
                  <div className="form-grid">
                    <div><label className="input-label">Full Name</label><div className="display-field">{userData.username || 'Not provided'}</div></div>
                    <div><label className="input-label">Gender</label><div className="display-field">{userData.gender || 'Not provided'}</div></div>
                    <div><label className="input-label">Age</label><div className="display-field">{userData.dob ? calculateAge(userData.dob) : 'Not provided'}</div></div>
                    <div><label className="input-label">Height</label>
  <div className="display-field">
    {goalData?.height && goalData.height !== 'Not provided' ? `${goalData.height} cm` : 'Not provided'}
  </div>
</div>
<div><label className="input-label">Current Weight</label>
  <div className="display-field">
    {goalData?.currentWeight && goalData.currentWeight !== 'Not provided' ? `${goalData.currentWeight} kg` : 'Not provided'}
  </div>
</div>
<div><label className="input-label">Goal Weight</label>
  <div className="display-field">
    {goalData?.goalWeight && goalData.goalWeight !== 'Not provided' ? `${goalData.goalWeight} kg` : 'Not provided'}
  </div>
</div>
<div><label className="input-label">Activity Level</label>
  <div className="display-field">
    {goalData?.activity && goalData.activity !== 'Not provided' ? goalData.activity : 'Not provided'}
  </div>
</div>
<div><label className="input-label">Goal</label>
  <div className="display-field">
    {goalData?.goal && goalData.goal !== 'Not provided' ? goalData.goal : 'Not provided'}
  </div>
</div>
<div><label className="input-label">Medical Issues</label>
  <div className="display-field">
    {goalData?.medicalIssues && goalData.medicalIssues !== 'Not provided'
      ? goalData.medicalIssues.split(',').map((issue, idx) => <span key={idx}>{issue.trim()}</span>)
      : 'None'}
  </div>
</div>
<div><label className="input-label">Food Preferences</label>
  <div className="display-field">
    {goalData?.foodPreferences && goalData.foodPreferences !== 'Not provided'
      ? goalData.foodPreferences.split(',').map((pref, idx) => <span key={idx}>{pref.trim()}</span>)
      : 'None'}
  </div>
</div>
                  </div>
                )}
                <div className="email-section">
                  <h3 className="email-title">My Email Address</h3>
                  <div className="email-card">
                    <FaEnvelope style={{ color: '#3b82f6', fontSize: '20px' }} />
                    <div>
                      <p className="email-text">{userData.email || 'No email provided'}</p>
                      <p className="email-date">Registered on: {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Unknown date'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="footer">
          <div className="footer-bottom">
            <p>reach us at:</p>
            <p><a href="mailto:support@eatopia.com">eatopia@email.com</a></p>
            <p>Copyright © 2025 Eatopia. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  };

  export default UserProfile;
