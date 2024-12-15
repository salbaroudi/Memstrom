import json
import os

# File path for storing ideas
#We run from root, so our path starts from there.
IDEAS_FILE = './data/ideas.json'

# Load ideas from the file
def get_ideas():
    if not os.path.exists(IDEAS_FILE):
        # Need to return empty json structure.
        return []
    with open(IDEAS_FILE, 'r') as file:
        return json.load(file)

# Save ideas to the file
def save_ideas(ideas):
    with open(IDEAS_FILE, 'w') as file:
        json.dump(ideas, file, indent=4)

# Add a new idea
def add_idea(title, content, tags):
    ideas = get_ideas()
    #id is just length+1. Easy.
    new_idea = {
        "id": len(ideas) + 1,
        "title": title,
        "content": content,
        "tags": tags,
    }
    ideas.append(new_idea)
    #For upto 10000 ideas (500 bytes each ~5mb, time is still < 1s) so acceptable.
    save_ideas(ideas)

# Search ideas by tag
def search_ideas(tag):
    ideas = get_ideas()
    return [idea for idea in ideas if tag in idea.get('tags', [])]
 
