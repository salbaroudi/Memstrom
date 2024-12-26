## Memory Malestrom (Memstrom):

This project stores notes in a flat database file, and has a web interface to
interact with them, and display them.  Notes can be anything, and are typed with
category and tag markers that can be entered by the user.

The main idea of this app is to catalouge all relevent notes a user might have,
and display them in various ways in order for the user to organize their life,
or seek out new ideas.

### General Design Choices:
- All submissions to the BE are via POST (not GET or PUT).
- coding conventions:
    - lowerUpperUpper (variables and Functions).
    - PATHS_NAMES (upper case and underscores).
    - use try catch all the time.
    - for promises, use the .error()
    - only complex functions get comments at top.
    - minimal dependency on libraries (use raw javascript).
    - each operation will have a flask /endpoint (no big dispatcher - helper functions OK).
    - render_template used to serve original page - afterwards JS calls to pass data back and forth.


### Basic and Features [TODO]:
- Adjust datafile to add a category tag. [X]
- First, fix the front end with the current code base (broken) [X]
- Remove submit on keystroke - submit by button press [X]
    - Add disable button (double clicks occur) [X]
- Note Display: Just a list in the LHS of the screen [X].
- Search with no input returns all tags [X]
- POST-ify all requests (remove GETS) [X]
- If no data file found, generate the empty file "[X]".
- Add a note - implement Catagories [X]
    - make all lower case [X]
- Delete a note by ID []
    - read notes file, delete from structure, write back.
- Edit a note by ID []:
    - read notes file, extract, display to user FE.
    - user submits edited note back, update accordingly.
- Filter for Notes: By Category List and Tag List:
    - assume intersection (AND)
    - filter down, and send back results to FE.
- Search for Notes by: []
    - text (in the body or title)
    - if no constraints, return all notes in a list.
- A single note can be found by typing in RefID and pressing "Edit"
- Note Randomizer: []
    - Enter a number between 1 and 10.
    - Hit Randomize: Randomly selected notes appear.
    - Filtration occurs before we select random items.
    - Error cases: Not enough notes, or the empty set.
- Filter bar works on Search and Randomizer. Does not work on Add/Edit/Delete note. []
    - if the user has stuff in the textboxes, it is ignored.
- Three separate sections exist: [] 
    - Add/Delete/Edit individual notes.
    - Search/Filter/Display sets of notes.
    - Random Selections section.

### Extended Features (later) TODO:
- For notes filtering, union (or) and intersection (and) option.
- Stnadardization of Tags/Categories (checkbox functionality)
    - user just adds tags and categories to the files in the backend, they are autoloaded.
- Post-It note / stylized display of 1-10 notes on the screen (more human like and ideosyncratic).
- For tags and catagories: spaces with underscores only.
- Error messages currently go to JS console. Need a box on screen for these!
- On post-it notes: deletion buttons for ease.
Fixing username mistakes (adding a line for test).