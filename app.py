from flask import Flask, render_template, request, jsonify
import random
from utils.database import get_ideas, add_idea, filter_ideas,search_ideas, delete_idea

#General Points: 
#  - This app mainly accepts POST requests.
#  - Only the inital root (/) query can be a GET.

# Initialize Flask app
app = Flask(__name__)

# Support functions: 
def error_500_raised(e):
    print("Error: Unspecified error occured: " + str(e))
    return jsonify({'error': 'Unspecified Error - check back-end'}), 500

#  Home Route - Main UI
@app.route('/')
def index():
    return render_template('index.html')

# Tag and Catagory Filter Search
# We rely on FE turning data into lists.
@app.route('/api/ct_search', methods=['POST'])
def api_ct_search():
    data = request.json
    categories = data.get('categories')
    tags = data.get('tags')

    print(f"Received categor(ies): {categories}")
    print(f"Received tag(s): {tags}")

    try:
        # If either non-empty, use them and search
        if (tags or categories):  
            '''prepare for search call, make some sets.
            We need the empty set, NOT the empty string set
            use set comprehension, filter out empty strings with if condition. '''
            input_cats = set(cats for cats in categories if cats)
            input_tags = set(tagz for tagz in tags if tagz)
            ideas = filter_ideas(input_cats,input_tags)
            return jsonify(ideas), 200
        else: #Both fields empty - error.
            return jsonify({"error":"User category and tag fields both empty!"}), 400
    except Exception as e:
       error_500_raised(e)


# API Route: Get all ideas.
@app.route('/api/get_all_ideas', methods=['POST'])
def api_get_ideas():
    try:
        data = request.json
        #4XX User error: Only send empty body.
        if data:
            return jsonify({'error':'Request JSON body must be empty {}. Rejected.'}), 400
        else:
            ideas = get_ideas()
            return jsonify(ideas), 200
    except Exception as e:
        error_500_raised(e)

# API Route: Search Title or Content text.
@app.route('/api/text_search', methods=['POST'])
def api_search_ideas():
    try: 
        data = request.json
        text = data.get('text')
        print(f"Recieved Search Text: {text}")
        if not text:
            print("error")
            return jsonify({'error': 'Search text empty!'}), 400
        return jsonify(search_ideas(text)), 200
    except Exception as e:
        error_500_raised(e)

# API Route: Add a new idea to repo.
@app.route('/api/add_idea', methods=['POST'])
def api_add_idea():
    try: 
        data = request.json
        title = data.get('title')
        content = data.get('content')
        categories = data.get("categories", [])
        tags = data.get('tags', [])
        if not title or not content or not categories or not tags:
            return jsonify({'error': 'One or more fields empty. Resubmit request.'}), 400
        add_idea(title, content, categories, tags)
        return jsonify({'status': 'Idea added successfully'}), 201
    except Exception as e:
        error_500_raised(e)

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
        if count < 1 or count > 12:
            return jsonify({"error": "Count must be between 1 and 12"}), 400
        all_ideas = get_ideas()
        if not all_ideas:
            return jsonify({"error": "Idea Repository empty!!"}), 400
        # Get random indices
        random_ideas = random.sample(all_ideas, min(count, len(all_ideas)))
        return jsonify(random_ideas), 200
    except Exception as e:
        error_500_raised(e)

# Run the app
if __name__ == '__main__':
    app.run(debug=True)

