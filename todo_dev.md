## TODO File:




### General Design Choices:
- All submissions to the BE are via POST (not GET or PUT).
- coding conventions:
    - lowerUpperUpper (variables and Functions).
    - PATHS_NAMES (upper case and underscores).
    - Error Processing:
        - use try/catch judiciously.
        - usage of positive assertions in blocks.
        - for promises, use the .error()
    - only complex functions get comments at top.
    - minimal dependency on libraries (raw javascript).
    - each operation will have a flask /endpoint (no big dispatcher - helper functions OK).
    - *render_template* used to serve original page - afterwards JS calls to pass data back and forth.


### Milestone 1A: Basic and Features [TODO]:
- [X] Get a basic code template (flask + js) from chatGPT 
- [X] Adjust datafile to add a category tag. 
- [X] First, fix the front end with the current code base (broken).
- [X] Remove submit on keystroke - submit by button press.
- [X] Disable double-click functionality.
- [X] Note Display: Just a list in the LHS of the screen.
- [X] Search with no input returns all tags. 
- [X] POST-ify all requests.
- [X] If no data file found, generate the empty file .
- [X] Add a note: implement Catagories [X]
- [X] Make all tags/notes lower case - tolowercase() call for FE submit
- [X] Delete a note by ID 
- [X] Alter Front End Listings
- [X] after any form submission, the form must reset 
- [X] Clear search/filter/add/random input boxes on submit (auto).
- [X] Note Randomizer: 1-10 input, display random notes.
- [X] Filter for Notes: By Category List and Tag List:
    - assume intersection (AND)
    - filter down, and send back results to FE.
- [X] Search for Notes by strings: []
    - text (in the body or title)
    - search details:
        - substring search. all lowercase'd by code for simplicity.
        - best for small phrases, not long sentences (high error rate).
    - if no constraints, return all notes in a list.
- [X] Add Notes v2: Blur screen with centered pop-up box.
    - two different modes, two different code paths.

### Milestone 1B: Code Refactoring for Basic Features:
- 


- Add an Error/Status box (reports to user).

### Extended Features (later) TODO:
- Edit a note by ID []:
    - read notes file, extract, display to user FE.
    - user submits edited note back, update accordingly.
- For notes filtering, union (or) and intersection (and) option.
- Stnadardization of Tags/Categories (checkbox functionality)
    - user just adds tags and categories to the files in the backend, they are autoloaded.
- Post-It note / stylized display of 1-10 notes on the screen (more human like and ideosyncratic).
- For tags and catagories: spaces with underscores only.
- Error messages currently go to JS console. Need a box on screen for these!
- On post-it notes: deletion buttons for ease.
Fixing username mistakes (adding a line for test).
- last action is printed to console, so user may recover.