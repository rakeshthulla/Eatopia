import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Goal.css';

const GoalWeightWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(10);
  const [formData, setFormData] = useState({
    goal: null,
    currentWeight: '',
    goalWeight: '',
    weightUnit: 'kg',
    height: '',
    heightUnit: 'cm',
    heightFt: '',
    heightIn: '',
    age: '',
    activity: null,
    medicalIssues: [],
    foodPreferences: []
  });

  const steps = useMemo(() => [
    {
      title: "What's your main goal?",
      type: "options",
      field: "goal",
      options: [
        { id: 'lose', icon: "📉", label: "Lose weight" },
        { id: 'maintain', icon: "👀", label: "Maintain weight" },
        { id: 'gain', icon: "📈", label: "Gain weight" },
        { id: 'muscle', icon: "💪", label: "Build muscle" }
      ]
    },
    {
      title: "What's your current weight?",
      type: "weight",
      field: "currentWeight",
      validation: (value) => !isNaN(value) && value > 0,
      description: "We'll use this to calculate your daily needs."
    },
    {
      title: "What's your goal weight?",
      type: "weight",
      field: "goalWeight",
      description: "Your target weight helps us personalize your plan.",
      validation: (value) => !isNaN(value) && value > 0
    },
    {
      title: "What's your height?",
      type: "height",
      field: "height",
      description: "Height affects your calorie and macro calculations.",
      validation: (value, data) =>
        data.heightUnit === 'cm'
          ? !isNaN(value) && value > 0
          : (!isNaN(data.heightFt) && data.heightFt > 0 && !isNaN(data.heightIn) && data.heightIn >= 0)
    },
    {
      title: "Activity level",
      type: "options",
      field: "activity",
      description: "How active are you in your daily life?",
      options: [
        { id: 'sedentary', icon: "🛌️", label: "Sedentary (little or no exercise)" },
        { id: 'light', icon: "🚶", label: "Lightly active (light exercise 1-3 days/week)" },
        { id: 'moderate', icon: "🏃", label: "Moderately active (moderate exercise 3-5 days/week)" },
        { id: 'active', icon: "🏋️", label: "Very active (hard exercise 6-7 days/week)" }
      ]
    },
    {
      title: "Any medical conditions we should know about?",
      type: "multi-select",
      field: "medicalIssues",
      description: "This helps us provide appropriate recommendations.",
      options: [
        { id: 'none', label: 'None' },
        { id: 'diabetes', label: 'Diabetes' },
        { id: 'allergies', label: 'Allergies' },
        { id: 'hypertension', label: 'Hypertension' },
        { id: 'asthma', label: 'Asthma' },
        { id: 'GERD', label: 'GERD' },
        { id: 'Obesity ', label: 'Obesity ' },
        { id: 'Anemia', label: 'Anemia' },
        { id: 'Fatty Liver ', label: 'Fatty Liver ' },
        { id: 'Kidney Stones', label: 'Kidney Stones' },
        { id: 'Migraines', label: 'Migraines' },
      ],
      validation: (value) => Array.isArray(value) && value.length > 0
    },
    {
      title: "Any foods you prefer to avoid?",
      type: "multi-select",
      field: "foodPreferences",
      description: "We'll customize your meal plans accordingly.",
      options: [
        { value: 'none', label: 'None' },
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
      ],
      validation: (value) => Array.isArray(value) && value.length > 0
    },
  ], []);

  const currentStep = useMemo(() => steps[step - 1], [step, steps]);

  const MultiSelect = ({ options, selected, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOption = (option) => {
      // Special handling for medicalIssues and foodPreferences step
      if (
        currentStep.field === "medicalIssues" ||
        currentStep.field === "foodPreferences"
      ) {
        if (option === "None") {
          // If "None" is selected, deselect all others and only select "None"
          onChange(["None"]);
        } else {
          // If any other option is selected, remove "None" if present
          const newSelected = selected.includes(option)
            ? selected.filter(item => item !== option)
            : [...selected.filter(item => item !== "None"), option];
          onChange(newSelected);
        }
      } else {
        // Default multi-select behavior
        const newSelected = selected.includes(option)
          ? selected.filter(item => item !== option)
          : [...selected, option];
        onChange(newSelected);
      }
    };

    return (
      <div className="multi-select-container">
        <div className="styled-select" onClick={() => setIsOpen(!isOpen)}>
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
            <div className="placeholder">Select options...</div>
          )}
          <div className="dropdown-arrow">▼</div>
        </div>
        
        {isOpen && (
          <div className="styled-select-options">
            {options.map(option => (
              <div
                key={option.id || option.value || option.label}
                className={`option ${selected.includes(option.label) ? 'selected' : ''}`}
                onClick={() => toggleOption(option.label)}
              >
                {option.label}
                {selected.includes(option.label) && <span className="checkmark">✓</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleNext = useCallback(async () => {
    if (step === steps.length) {
      const token = localStorage.getItem('authToken');

      const cleanedData = { ...formData };

      if (formData.weightUnit === 'lb') {
        cleanedData.currentWeight = (parseFloat(formData.currentWeight) * 0.453592);
        cleanedData.goalWeight = (parseFloat(formData.goalWeight) * 0.453592);
      }

      if (formData.heightUnit === 'ft') {
        const heightInCm = (parseInt(formData.heightFt || 0)) * 30.48 + (parseInt(formData.heightIn || 0) * 2.54);
        cleanedData.height = Math.round(heightInCm);
      }

      delete cleanedData.weightUnit;
      delete cleanedData.heightUnit;
      delete cleanedData.heightFt;
      delete cleanedData.heightIn;

      cleanedData.medicalIssues = formData.medicalIssues.join(', ');
      cleanedData.foodPreferences = formData.foodPreferences.join(', ');

      try {
        const response = await fetch("https://eatopia-avc6.onrender.com/api/goal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cleanedData),
        });

        if (!response.ok) throw new Error("Failed to save data");
        navigate("/Login", { state: cleanedData });
      } catch (err) {
        console.error("Error saving form data:", err);
        alert("There was a problem saving your data.");
      }
    } else {
      setStep(prev => prev + 1);
      setProgress(Math.min(100, (step / steps.length) * 100 + 30));
    }
  }, [step, steps.length, formData, navigate]);

  const handleBack = useCallback(() => {
    setStep(prev => Math.max(prev - 1, 1));
    setProgress(Math.max(10, ((step - 2) / steps.length) * 100 + 30));
  }, [step, steps.length]);

  const handleOptionSelect = useCallback((value) => {
    setFormData(prev => ({ ...prev, [currentStep.field]: value }));
  }, [currentStep.field]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    let val = value;

    // Restrict weight
    if ((name === 'currentWeight' || name === 'goalWeight')) {
      if (formData.weightUnit === 'kg' && parseFloat(val) > 200) return;
      if (formData.weightUnit === 'lb' && parseFloat(val) > 440.925) return;
    }

    // Restrict height
    if (name === 'height' && formData.heightUnit === 'cm' && parseFloat(val) > 243.84) return;
    if (name === 'heightFt' && parseFloat(val) > 8) return;
    if (name === 'heightIn' && parseFloat(val) > 11) return;

    setFormData(prev => ({ ...prev, [name]: val }));
  }, [formData.weightUnit, formData.heightUnit]);

  const isNextDisabled = useMemo(() => {
    if (!currentStep) return true;
    const { field, validation } = currentStep;
    
    if (currentStep.type === 'height') {
      if (formData.heightUnit === 'cm') {
        return !formData.height || (validation && !validation(formData.height, formData));
      }
      return !formData.heightFt || !formData.heightIn || (validation && !validation(null, formData));
    }
    
    if (validation) {
      return !formData[field] || !validation(formData[field]);
    }
    
    return !formData[field];
  }, [currentStep, formData]);

  const renderStepContent = () => {
    switch (currentStep.type) {
      case 'options':
        return (
          <div className="options-grid">
            {currentStep.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.label)}
                className={`option-card ${
                  formData[currentStep.field] === option.label ? 'selected' : ''
                }`}
              >
                <span className="option-icon">{option.icon}</span>
                <span className="option-label">{option.label}</span>
              </button>
            ))}
          </div>
        );
      case 'weight':
        return (
          <div className="weight-step-container">
            <div className="weight-input-container">
              <input
                type="number"
                name={currentStep.field}
                value={formData[currentStep.field]}
                onChange={handleInputChange}
                className="weight-input"
                placeholder="0"
                min="0"
                step="0.1"
                max={formData.weightUnit === 'kg' ? 200 : 440.925}
              />
              <div className="weight-unit-tabs">
                <button
                  className={`unit-tab ${formData.weightUnit === 'kg' ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, weightUnit: 'kg' }))}
                >kg</button>
                <button
                  className={`unit-tab ${formData.weightUnit === 'lb' ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, weightUnit: 'lb' }))}
                >lb</button>
              </div>
            </div>
          </div>
        );
      case 'height':
        return (
          <div className="height-step-container">
            <div className="height-input-container">
              {formData.heightUnit === 'cm' ? (
                <div className="cm-input-wrapper">
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="height-input"
                    placeholder="0"
                    min="0"
                    max="243.84"
                  />
                  <span className="height-unit">cm</span>
                </div>
              ) : (
                <div className="ft-in-input-wrapper">
                  <div className="height-input-group">
                    <input
                      type="number"
                      name="heightFt"
                      value={formData.heightFt}
                      onChange={handleInputChange}
                      className="height-input"
                      placeholder="0"
                      min="0"
                      max="7"
                    />
                    <span className="height-unit">ft</span>
                  </div>
                  <div className="height-input-group">
                    <input
                      type="number"
                      name="heightIn"
                      value={formData.heightIn}
                      onChange={handleInputChange}
                      className="height-input"
                      placeholder="0"
                      min="0"
                      max="11"
                    />
                    <span className="height-unit">in</span>
                  </div>
                </div>
              )}
            </div>
            <div className="height-unit-tabs">
              <button
                className={`unit-tab ${formData.heightUnit === 'cm' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, heightUnit: 'cm' }))}
              >cm</button>
              <button
                className={`unit-tab ${formData.heightUnit === 'ft' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, heightUnit: 'ft' }))}
              >ft/in</button>
            </div>
          </div>
        );
      case 'multi-select':
        return (
          <MultiSelect
            options={currentStep.options}
            selected={formData[currentStep.field]}
            onChange={(selected) => setFormData(prev => ({ ...prev, [currentStep.field]: selected }))}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="wizard-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="wizard-content">
        <div className="content-wrapper">
          <h2 className="step-title">{currentStep.title}</h2>
          {currentStep.description && (
            <p className="step-description">{currentStep.description}</p>
          )}
          <div className="step-content-container">
            {renderStepContent()}
          </div>
          <div className="navigation-buttons">
            {step > 1 && (
              <button className="nav-btn back-btn" onClick={handleBack}>
                Back
              </button>
            )}
            <button 
              className="nav-btn next-btn" 
              onClick={handleNext}
              disabled={isNextDisabled}
            >
              {step === steps.length ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalWeightWizard;
