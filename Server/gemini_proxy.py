import os
import json
import requests  # Add this to make HTTP requests
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# ✅ Load environment variables
load_dotenv()

GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("❌ GOOGLE_API_KEY is not set in the environment!")

AUTH_SERVER_URL = "https://eatopia-h5am.onrender.com/api/auth/user"  # Base URL for the auth server

genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel("models/gemini-1.5-flash")

app = Flask(__name__)
CORS(app)

@app.route("/gemini", methods=["POST"])
def gemini_proxy():
    data = request.get_json()
    food = data.get("food")
    mode = data.get("mode", "nutrition")
    user_id = data.get("userId")  # Expecting userId in the request body
    token = data.get("authToken")  # Expecting authToken in the request body
    print(f"📥 Received food: {food}, mode: {mode}, userId: {user_id}")

    try:
        # Fetch user details if userId is provided
        user_details = {}
        if user_id and token:
            headers = {"Authorization": f"Bearer {token}"}
            user_response = requests.get(f"{AUTH_SERVER_URL}/{user_id}", headers=headers)
            if user_response.status_code == 200:
                user_details = user_response.json()
                print("✅ User details fetched:", user_details)
            else:
                print(f"❌ Failed to fetch user details: {user_response.status_code}")
                return jsonify({"error": "Failed to fetch user details"}), 401

        # Generate the prompt based on the mode
        if mode == "nutrition":
            prompt = (
                f"Return only raw JSON with the following format for {food}:\n"
                '{"calories": "...", "protein": "...", "fat": "...", '
                '"fiber": "...","carbohydrates":"...","sugar":"...","cholesterol":"..."}\n'
                "Do not include any explanation, markdown, or formatting. Only return plain JSON."
            )
        elif mode == "health_check":
            user_name = user_details.get('username', 'User')  # Default to 'User' if name is not available
            prompt = (
                f"Hi {user_name}, evaluate if the food item '{food}' is healthy or unhealthy based on the following user details: "
                f"Age: {user_details.get('age', 'unknown')}, Gender: {user_details.get('gender', 'unknown')}, "
                f"Height: {user_details.get('height', 'unknown')}, Weight: {user_details.get('currentWeight', 'unknown')}, "
                f"Activity level: {user_details.get('activity', 'unknown')}. "
                "Provide a friendly and human-readable explanation in 2-3 sentences. Use the person's name in the response."
            )
        else:
            return jsonify({"error": "Invalid mode"}), 400

        # Call the Gemini model to generate content
        response = model.generate_content(prompt)
        raw_text = response.text.strip()
        print("🧠 Gemini raw response:", raw_text)

        # Return the response based on the mode
        if mode == "nutrition":
            if raw_text.startswith("```"):
                raw_text = raw_text.replace("```json", "").replace("```", "").strip()
            nutrition_data = json.loads(raw_text)
            # Include user_details in the response
            return jsonify({
                "nutrition": nutrition_data,
                "userDetails": user_details
            })
        else:
            # Return the human-readable health check response and user details
            return jsonify({
                "response": raw_text,
                "userDetails": user_details
            })

    except json.JSONDecodeError as e:
        print("❌ JSON parsing failed:", e)
        return jsonify({"error": "Gemini did not return valid JSON."}), 500

    except Exception as e:
        print("❌ Gemini API call failed:", e)
        return jsonify({"error": str(e)}), 500
if __name__ == '__main__':
    app.run(port=5001)
