import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Textc.css';
import logo from './assets/Eatopia.png';

// Dummy Gemini Nutrition Fetcher
const fetchNutritionFromGemini = async (foodItem, analysisMode) => {
  try {
    const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage
    const authToken = localStorage.getItem("authToken"); // <-- Add this line
    if (!userId || !authToken) { // <-- Check for both
      throw new Error("User ID or auth token is not available. Please log in again.");
    }

    const response = await fetch("http://localhost:5001/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        food: foodItem,
        mode: analysisMode,
        userId: userId, // Include userId in the request
        authToken: authToken, // <-- Add this line
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch nutrition data:", error);
    throw error;
  }
};

const parseNumericValue = (value) => {
  if (typeof value === 'string' && value.includes('-')) {
    // Handle ranges like "250-450" by taking the average
    const [min, max] = value.split('-').map(Number);
    return (min + max) / 2;
  }
  return Number(value); // Convert to a number
};

const FoodSelector = () => {
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [analysisMode, setAnalysisMode] = useState('nutrition');
  const [newItem, setNewItem] = useState('');
  const [foodItems, setFoodItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [nutritionData, setNutritionData] = useState({});
  const [totalNutrition, setTotalNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    cholesterol: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newItem.trim()) {
      handleAddItem();
    }
  };

  const handleAddItem = () => {
    if (!foodItems.includes(newItem.trim().toLowerCase())) {
      const newList = [...foodItems, newItem.trim().toLowerCase()];
      setFoodItems(newList);
    }
    setNewItem('');
  };

  // Utility to extract numeric value from string with units like "15g", "1mg", etc.
  const parseNumber = (val) => {
    if (typeof val === "string") {
      const num = parseFloat(val.replace(/[^\d.-]/g, ""));
      return isNaN(num) ? 0 : num;
    }
    return parseFloat(val) || 0;
  };

  const handleItemToggle = async (item) => {
    let updatedSelection;

    if (isMultiSelect) {
      if (selectedItems.includes(item)) {
        updatedSelection = selectedItems.filter((i) => i !== item);
      } else {
        updatedSelection = [...selectedItems, item];
      }
    } else {
      updatedSelection = selectedItems.includes(item) ? [] : [item];
    }

    setSelectedItems(updatedSelection);

    if (updatedSelection.length === 0) {
      setTotalNutrition({
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        cholesterol: 0,
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newNutritionData = { ...nutritionData };
      let total = { calories: 0, protein: 0, carbs: 0, fat: 0 ,fiber: 0,sugar: 0,cholesterol: 0,};

      for (const item of updatedSelection) {
        if (!newNutritionData[item]) {
          // Fetch data for both modes
          const nutritionDataResponse = await fetchNutritionFromGemini(item, 'nutrition');
          const healthCheckResponse = await fetchNutritionFromGemini(item, 'health_check');

          newNutritionData[item] = {
            nutrition: nutritionDataResponse,
            healthCheck: healthCheckResponse.response,
          };
        }

        const itemNutrition = newNutritionData[item]?.nutrition || {};
        total.calories += parseNumber(itemNutrition.calories);
        total.protein += parseNumber(itemNutrition.protein);
        total.carbs += parseNumber(itemNutrition.carbohydrates);
        total.fat += parseNumber(itemNutrition.fat);
        total.fiber += parseNumber(itemNutrition.fiber);
        total.sugar += parseNumber(itemNutrition.sugar);
        total.cholesterol += parseNumber(itemNutrition.cholesterol);
      }

      setNutritionData(newNutritionData);
      setTotalNutrition(total);
    } catch (err) {
      setError('Something went wrong while analyzing your food.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = (item) => {
    const updatedItems = foodItems.filter((i) => i !== item);
    const updatedSelected = selectedItems.filter((i) => i !== item);
    const updatedData = { ...nutritionData };
    delete updatedData[item];

    setFoodItems(updatedItems);
    setSelectedItems(updatedSelected);
    setNutritionData(updatedData);
    setTotalNutrition({
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      cholesterol: 0,
    });
  };

  // Function to save food details to the backend
  const saveFoodDetails = async (foodName, nutrition) => {
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
    if (!userId) {
      alert('User ID not found. Please log in again.');
      navigate('/Home'); // Redirect to login or home page
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch('http://localhost:8000/api/food-history/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // <-- Add this line
        },
        body: JSON.stringify({
          userId,
          foodName,
          calories: parseFloat(nutrition.calories) || 0,
          protein: parseFloat(nutrition.protein) || 0,
          carbohydrates: parseFloat(nutrition.carbs) || 0,
          fat: parseFloat(nutrition.fat) || 0,
          sugar: parseFloat(nutrition.sugar) || 0,
          fiber: parseFloat(nutrition.fiber) || 0,
          cholesterol: parseFloat(nutrition.cholesterol) || 0,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save food details');
      }

      const data = await response.json();
      console.log('Food details saved successfully:', data);
      alert('Food details saved successfully!');
    } catch (err) {
      console.error('Error saving food details:', err);
      alert('Failed to save food details. Please try again.');
    }
  };

  const handleSaveSelectedItems = () => {
    selectedItems.forEach((item) => {
      const nutrition = nutritionData[item]?.nutrition || {};
      saveFoodDetails(item, nutrition);
    });
  };

  return (
    <>
      <nav className="navbar1">
        <div className="logo-container">
          <img src={logo} alt="Eatopia Logo" className="logo" />
          <span className="logo-text1">EATOPIA</span>
        </div>
        <ul className="nav-links">
          <li><Link to="/Loginhome" className="nav-link">Home</Link></li>
          <li><Link to="/Imageup" className="nav-link">Image Upload</Link></li>
          <li><Link to="/Textc" className="nav-link active">Text Analysis</Link></li>
          <li><Link to="/Dietc" className="nav-link ">Diet Analysis</Link></li>
          <li><Link to="/Userdet" className="nav-link">User Details</Link></li>
        </ul>
      </nav>

      <div className="app-container">
        <div className="food-selector-container">
          <div className="header-section">
            <h2>Food Nutrition Analyzer</h2>
            <p className="subtitle">Get detailed nutritional information and health analysis for your meals</p>
          </div>

          <div className="control-panel">
            <div className="mode-toggle">
              <label className="toggle-label">
                <input 
                  type="checkbox" 
                  checked={isMultiSelect} 
                  onChange={() => setIsMultiSelect(!isMultiSelect)} 
                />
                <span className="toggle-slider"></span>
                <span className="toggle-text">Multi-select Mode</span>
              </label>
            </div>
          </div>

          <div className="add-item-section">
            <div className="input-container">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter food item (e.g., 'banana', 'grilled chicken')"
                className="food-input"
              />
              <button 
                onClick={handleAddItem}
                className="add-button"
                disabled={!newItem.trim()}
              >
                <span className="button-icon">+</span> Add Item
              </button>
            </div>
          </div>

          {foodItems.length > 0 ? (
            <div className="main-content">
              <div className="food-items-section">
                <h3 className="section-title">Your Food Items</h3>
                <div className="food-items-grid">
                  {foodItems.map((item) => (
                    <div
                      key={item}
                      className={`food-item-card ${selectedItems.includes(item) ? 'selected' : ''}`}
                      onClick={() => handleItemToggle(item)}
                    >
                      <div className="food-item-content">
                        <span className="food-name">{item}</span>
                        <span 
                          className="remove-item"
                          onClick={(e) => { e.stopPropagation(); handleRemoveItem(item); }}
                        >
                          &times;
                        </span>
                      </div>
                      {selectedItems.includes(item) && (
                        <div className="selection-indicator">
                          <span className="checkmark">✓</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="results-section">
                {isLoading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p className="error">{error}</p>
                ) : (
                  <div>
                    <h3>Analysis Results</h3>
                    {selectedItems.map((item) => {
  const nutrition = nutritionData[item]?.nutrition || {};
  const userDetails = nutritionData[item]?.userDetails || {};
  return (
    <div key={item} className="nutrition-result-card">
      <h4>{item.charAt(0).toUpperCase() + item.slice(1)}</h4>
      <div className="nutrition-details">
        <h5>Nutrition Details:</h5>
        <table className="nutrition-table">
          <tbody>
            <tr><td>Calories:</td><td>{nutrition.calories || 'N/A'}</td></tr>
            <tr><td>Protein:</td><td>{nutrition.protein || 'N/A'} </td></tr>
            <tr><td>Carbohydrates:</td><td>{nutrition.carbohydrates || 'N/A'} </td></tr>
            <tr><td>Fat:</td><td>{nutrition.fat || 'N/A'} </td></tr>
            <tr><td>Fiber:</td><td>{nutrition.fiber || 'N/A'} </td></tr>
            <tr><td>Sugar:</td> <td>{nutrition.sugar || 'N/A'} </td></tr>
            <tr><td>Cholesterol:</td> <td>{nutrition.cholesterol || 'N/A'} </td></tr>
          </tbody>
        </table>
      </div>
      <div className="health-check">
        <h5>Health Check:</h5>
        <p>{nutritionData[item]?.healthCheck || "No response available"}</p>
      </div>
      {/* Show user details */}
      <div className="user-details">
        <h5>User Details:</h5>
        <pre style={{textAlign: "left", background: "#f6f6f6", padding: "10px", borderRadius: "6px"}}>
          {JSON.stringify(userDetails, null, 2)}
        </pre>
      </div>
    </div>
  );
})}

                  </div>
                )}
               {selectedItems.length > 0 && (<button className="save-button"onClick={handleSaveSelectedItems} disabled={!selectedItems.some(item => nutritionData[item]?.nutrition)}style={{ marginTop: '20px' }} // <-- add this inline style
  >
    Save Selected Items
  </button>
)}



              </div>
            </div>
          ) : (
            <div className="empty-food-state">
              <div className="empty-food-icon">🥗</div>
              <h3>No food items added yet</h3>
              <p>Start by adding food items above to analyze their nutritional content</p>
            </div>
          )}
        </div>
        
      </div>
      <footer className="footer">
  <div className="footer-bottom">
    <p>reach us at:</p>
    <p><a href="mailto:support@eatopia.com">eatopia@email.com</a></p>
    <p>Copyright © 2025 Eatopia. All rights reserved.</p>
  </div>
</footer>
    </>
  );
};

export default FoodSelector;

