import json
import os

#General Notes:
# - For upto 10000 ideas (500 bytes each ~5mb, 
# read time is still < 1s) so acceptable just to R/W from
# file for every operation. Object/RAM storage will
# be implemented later, if increasing complexity demands it.

# File path for storing ideas
IDEAS_FILE = './data/ideas.json'

# Load ideas from the file
def get_ideas():
    # If file does not exist, create it.
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
        json.dump(ideas, file, indent=3)

# Add a new idea
def add_idea(title, content, categories, tags):
    ideas = get_ideas()

    new_idea = {
        "id": len(ideas) + 1,
        "title": title,
        "content": content,
        "categories":categories,
        "tags": tags,
    }

    ideas.append(new_idea)
    save_ideas(ideas)
    return

#Delete an idea from the database file:
# Does this even work??
def delete_idea(rID):
    ideas = get_ideas()
    #remove the offending idea.
    filtered_ideas = [idea for idea in ideas if idea.get('id') != rID]
    #Re-enumerate the ideas. First entry starts at 1.
    renumbered_ideas = [{**idea, 'id': i + 1} for i, idea in enumerate(ideas)]
    save_ideas(renumbered_ideas)
    return

# Filter ideas by tag
# Takes two sets (of strings) as input.
def filter_ideas(categories,tags):
    #list of dictionary objects - representing json objects.
    ideas = get_ideas()
    filtered_ideas = []
    #Mixture of sets and lists, and mutation is being exploited (yuck)
    #here, but it is fast as we just load all ideas on-the-fly.
    for idea in ideas:
        idea['categories'] = set(idea['categories'])
        idea['tags'] = set(idea['tags'])
        #check our current idea
        if categories.issubset(idea['categories']) and tags.issubset(idea['tags']):
            idea['categories'] = list(idea['categories'])
            idea['tags'] = list(idea['tags'])
            filtered_ideas.append(idea)
    return filtered_ideas

#search the title or content (lowercase) with our substring text.
def search_ideas(text):
    print(text)
    ideas = get_ideas()
    search_result = [idea for idea in ideas if ((text in idea['content'].lower()) or (text in idea['title'].lower()))]
    return search_result