import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiCamera, FiX, FiUpload } from "react-icons/fi";
import logo from './assets/Eatopia.png';

const ImageUpload = () => {
  const [preview, setPreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const lastScrollY = useRef(window.scrollY);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Show/hide navbar on scroll
  const handleScroll = useCallback(() => {
    setShowNavbar(window.scrollY <= lastScrollY.current);
    lastScrollY.current = window.scrollY;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Handle image file selection
  const handleImageChange = (event) => {
    setError(null);
    setResults(null);
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file (JPEG, PNG, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadstart = () => setIsLoading(true);
    reader.onloadend = () => {
      setIsLoading(false);
      setPreview(reader.result);
    };
    reader.onerror = () => {
      setIsLoading(false);
      setError("Failed to read the image file");
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => fileInputRef.current.click();

  const handleRemoveImage = () => {
    setPreview(null);
    setSelectedImage(null);
    setResults(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Save nutrition details to backend
  const saveFoodDetails = async (foodName, nutrition) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User ID not found. Please log in again.");
      navigate("/Home");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("https://eatopia-avc6.onrender.com/api/food-history/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // <-- Add this line
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
        throw new Error(errorData.error || "Failed to save food details");
      }

      const data = await response.json();
      console.log("Food details saved:", data);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save food details.");
    }
  };

  // Save all food items from results to backend
  const handleSave = async () => {
    if (!results || !results.nutrition) return;
    setIsSaved(false);
    for (const item of results.nutrition) {
      await saveFoodDetails(item.name, item);
    }
    setIsSaved(true);
  };

  // Submit image to backend
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!preview || !selectedImage) {
      setError("Please upload an image before submitting");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("image", selectedImage);

      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Prediction failed");
      }

      const data = await res.json();
      const foodItems = data.food_items;

      if (!foodItems || foodItems.length === 0) {
        setResults(null);
        setError("It is not a food item.");
        return;
      }

      setResults({
        foodName: foodItems.map((item) => item.name).join(", "),
        nutrition: foodItems.map((item) => ({
          name: item.name,
          calories: item.calories|| 0,
          protein: item.protein_g|| 0,
          fat: item.fat_g|| 0,
          carbs: item.carbohydrates_g|| 0,
          sugar: item.sugar_g|| 0,
          fiber: item.fiber_g|| 0,
          cholesterol: item.cholesterol_mg || 0, 
        })),
      });

      setIsSaved(false); // Reset save state on new analysis
    } catch (err) {
      setError(err.message || "Image analysis failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setPreview(null);
    setSelectedImage(null);
    setResults(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="image-upload-container">
      <nav className={`navbar1 ${showNavbar ? "show" : "hide"}`}>
        <div className="logo-container">
          <img src={logo} alt="Eatopia Logo" className="logo" />
          <span className="logo-text1">EATOPIA</span>
        </div>
        <ul className="nav-links">
          <li><Link to="/Loginhome" className="nav-link">Home</Link></li>
          <li><Link to="/Imageup" className="nav-link active">Image Upload</Link></li>
          <li><Link to="/Textc" className="nav-link">Text Analysis</Link></li>
          <li><Link to="/Dietc" className="nav-link">Diet Analysis</Link></li>
          <li><Link to="/Userdet" className="nav-link">User Details</Link></li>
        </ul>
      </nav>

      <main className="main-content">
        <section className="upload-section1">
          <div className="section__header">
            <h1 className="section__title">Food Nutrition Analyzer</h1>
            <p className="section__subtitle">
              Upload a food image to analyze its nutritional content
            </p>
          </div>

          {!results ? (
            <form onSubmit={handleSubmit} className="upload-form">
              <div className="upload-area">
                {!preview ? (
                  <div role="button" className="upload-box" onClick={handleClick}>
                    {isLoading ? (
                      <div className="loading-spinner" />
                    ) : (
                      <>
                        <FiCamera className="upload-icon" />
                        <p className="upload-text">Upload or scan image to get calories</p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="preview-wrapper">
                    <div className="preview-container">
                      <img src={preview} className="preview-image" alt="Food preview" />
                      <button type="button" className="change-image-btn" onClick={handleClick}>
                        <FiUpload className="change-icon" /> Change
                      </button>
                      <button type="button" className="remove-image-btn" onClick={handleRemoveImage}>
                        <FiX className="remove-icon" />
                      </button>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  onChange={handleImageChange}
                  className="visually-hidden"
                />
                <small className="help-text">Supported formats: JPEG, PNG, WEBP (Max 5MB)</small>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="submit-button" disabled={!preview || isLoading}>
                {isLoading ? "Analyzing..." : "Analyze Nutrition"}
              </button>
            </form>
          ) : (
            <div className="results-container">
              <h2 className="results-title">Nutrition Analysis Results</h2>
              <div className="results-content">
                <div className="results-image">
                  <img src={preview} alt="Analyzed food" className="results-food-image" />
                  <h3 className="food-name">{results.foodName}</h3>
                </div>
                <div className="nutrition-facts">
                  <h3 className="nutrition-title">Nutrition Facts</h3>
                  <div className="nutrition-grid">
                    {results.nutrition.map((item, index) => (
                      <div className="nutrition-item" key={index}>
                        <h4>{item.name}</h4>
                        <p>Calories: {item.calories}</p>
                        <p>Carbs: {item.carbs}g</p>
                        <p>Protein: {item.protein}g</p>
                        <p>Fat: {item.fat}g</p>
                        <p>Fiber: {item.fiber}g</p>
                        <p>Sugar: {item.sugar}g</p>
                        <p>Cholesterol: {item.cholesterol}mcg</p>
                      </div>
                    ))}
                  </div>
                  <div className="button-container">
                    <button
                      type="button"
                      className="save-analysis-btn"
                      onClick={handleSave}
                      disabled={isSaved}
                    >
                      {isSaved ? "Saved!" : "Save to History"}
                    </button>
                    <button 
                      type="button" 
                      className="new-analysis-btn" 
                      onClick={handleNewAnalysis}
                    >
                      Try Another Image
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      <footer className="footer">
  <div className="footer-bottom">
    <p>reach us at:</p>
    <p><a href="mailto:support@eatopiaaa.com">eatopiaaa@email.com</a></p>
    <p>Copyright © 2025 Eatopia. All rights reserved.</p>
  </div>
</footer>
    </div>
    
    
  );
};

export default ImageUpload;
