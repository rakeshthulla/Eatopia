from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Your Gemini API Key
GOOGLE_API_KEY = "AIzaSyD3FIsH9fEqVGhx-rC9NtqrYFja6tJNVbA"
genai.configure(api_key=GOOGLE_API_KEY)

@app.route('/upload', methods=['POST'])
def upload():
    if 'image' not in request.files:
        return jsonify({"error": "Image file is required"}), 400

    image_file = request.files['image']
    
    prompt_text = (
        "You are a nutritionist. Analyze the food items in the uploaded image and respond in the following strict JSON format only (no explanations):\n\n"
        "{\n"
        "  \"food_items\": [\n"
        "    {\n"
        "      \"name\": \"Food Name\",\n"
        "      \"calories\": 0,\n"
        "      \"protein_g\": 0,\n"
        "      \"fat_g\": 0,\n"
        "      \"carbohydrates_g\": 0,\n"
        "      \"fiber\": 0,\n"
        "      \"cholesterol\": 0,\n"
        "      \"sugar\": 0\n"
        "    },\n"
        "    ...\n"
        "  ]\n"
        "}\n\n"
        "All values should be approximate per 100g or per piece. Return only valid JSON."
    )

    image_bytes = image_file.read()

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(
            [prompt_text, {"mime_type": "image/jpeg", "data": image_bytes}]
        )
    except Exception as e:
        return jsonify({"error": f"Failed to call Gemini API: {str(e)}"}), 500

    # Debugging: Log the raw response
    print("Gemini Raw Response (before parsing):", repr(response.text))

    import json

    try:
        # Get raw text from Gemini response
        response_text = response.text.strip()

        # Remove Markdown-style code block formatting if present
        if response_text.startswith("```json"):
            response_text = response_text.replace("```json", "").replace("```", "").strip()

        # Handle empty response
        if not response_text or response_text.strip() == "":
            return jsonify({"error": "Gemini API returned an empty response"}), 500

        # Parse it as JSON directly
        try:
            parsed = json.loads(response_text)
        except json.JSONDecodeError as e:
            print("Failed to parse JSON:", repr(response_text))  # Debug line
            return jsonify({"error": f"Failed to parse Gemini response as JSON: {str(e)}"}), 500

        # Validate the parsed JSON structure
        if "food_items" not in parsed:
            raise ValueError("Invalid response format: 'food_items' key is missing")

        return jsonify(parsed)

    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)