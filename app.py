from flask import Flask, render_template, request, jsonify
import os
import json
import random
from utils.database import get_ideas, add_idea, search_ideas, delete_idea

# Initialize Flask app
app = Flask(__name__)

# Home Route - Main UI
@app.route('/')
def index():
    return render_template('index.html')

# API Route: Get all ideas
@app.route('/api/ideas', methods=['POST'])
def api_get_ideas():
    data = request.json
    tag = data.get('tag')  # Get the tag parameter from the query string
    print(f"Received tag: {tag}")

    if tag:  # If tag is provided, search for ideas with the tag
        ideas = search_ideas(tag)
    else:  # No tag provided, return all empty list
        ideas = get_ideas()

    return jsonify(ideas)


# API Route: Add a new idea
#Note that we have a request object available in context.
@app.route('/api/add_idea', methods=['POST'])
def api_add_idea():
    #Get all the request data.
    data = request.json
    title = data.get('title')
    content = data.get('content')
    categories = data.get("categories")
    tags = data.get('tags', [])
    #Negative Assertion.
    if not title or not content:
        return jsonify({'error': 'Title and content are required'}), 400
    #Insert Idea.
    add_idea(title, content, categories, tags)
    #Give user success message.
    return jsonify({'message': 'Idea added successfully'}), 201

@app.route('/api/delete_idea', methods=['POST'])
def api_delete_idea():
    data = request.json 
    rID = data.get("recordID")
    if not rID:
        return jsonify({'error': 'invalid recordID. Deletion request failed.'})
    delete_idea(rID)
    return jsonify({'result': 'Deletion request processed successfully.'})


@app.route("/api/random_ideas", methods=["POST"])
def api_random_ideas():
    try:
        count = int(request.json.get("count", 0))
        if count < 1 or count > 10:
            return jsonify({"error": "Count must be between 1 and 10"}), 400

        all_ideas = get_ideas()
        if not all_ideas:
            return jsonify([])

        # Get random indices
        random_ideas = random.sample(all_ideas, min(count, len(all_ideas)))
        return jsonify(random_ideas)
    except ValueError:
        return jsonify({"error": "Invalid input"}), 400

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
 
