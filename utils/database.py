import json
import os

# File path for storing ideas
#We run from root, so our path starts from there.
IDEAS_FILE = './data/ideas.json'

# Load ideas from the file
# If file does not exist, create it.
def get_ideas():
    if not os.path.exists(IDEAS_FILE):
        print("WARNING: no ideas.json file detected. Creating a new empty file...")
        # Create the new file using the correct file path
        with open(IDEAS_FILE, 'w') as file:
            json.dump([], file)  # Initialize with an empty list (empty JSON structure)
        # Need to return empty json structure.
        return []
    
    # If the file exists, load and return its contents
    with open(IDEAS_FILE, 'r') as file:
        return json.load(file)
    
# Save ideas to the file
def save_ideas(ideas):
    with open(IDEAS_FILE, 'w') as file:
        json.dump(ideas, file, indent=4)

# Add a new idea
def add_idea(title, content, categories, tags):
    ideas = get_ideas()
    #id is just length+1. Easy.
    new_idea = {
        "id": len(ideas) + 1,
        "title": title,
        "content": content,
        "categories":categories,
        "tags": tags,
    }
    ideas.append(new_idea)
    #For upto 10000 ideas (500 bytes each ~5mb, time is still < 1s) so acceptable.
    save_ideas(ideas)
    return

#Delete an idea from the database file:
def delete_idea(rID):
    ideas = get_ideas()
    #remove the offending idea.
    filtered_ideas = [idea for idea in ideas if idea.get('id') != rID]
    #Re-enumerate the ideas. First entry starts at 1.
    renumbered_ideas = [{**idea, 'id': i + 1} for i, idea in enumerate(ideas)]
    save_ideas(renumbered_ideas)
    return

# Search ideas by tag
def search_ideas(tag):
    ideas = get_ideas()
    return [idea for idea in ideas if tag in idea.get('tags', [])]
 
