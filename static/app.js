document.addEventListener('DOMContentLoaded', () => {
    //set at TL scope for event bindings.
    const addSubmitButton = document.getElementById('add-submit-button');
    const randomizeButton = document.getElementById('randomize-button');
    const searchTagCatSubmit = document.getElementById('search-tag-cat-submit');
    const searchTextSubmit = document.getElementById('search-text-submit');
    const deleteButton = document.getElementById('delete-button');

    // TL dom elements.
    const addIdeaButton = document.getElementById('add-button');
    const blurredScreen = document.getElementById('blurred-screen');
    const closeFormButton = document.getElementById('close-form-button');
    const ideaForm = document.getElementById('idea-form');

    /* Fetch and display all ideas. Basic fetch method.
     Q: Why are there two sets of promises (await)?
     A: Fetch returns headers, and defers the body of the response
     (as it could be several megabytes in size).
     So for the body we call await resp.json() again, with a second
     promise.
     */
    const fetchIdeas = async () => {
        try {
            const response =     await fetch('/api/get_all_ideas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });

            if (!response.ok) {  //Error 4XX or 5XX
                const errorData = await response.json();
                console.log(errorData.error);
            }
            //otherwise, we got ideas. Getting ideas signals success.
            const ideas = await response.json();
            displayIdeas(ideas);
        }  //Unspecified FE Errors
        catch (err) {
            console.log(err)
        }
    };

    const displayIdeas = (ideas) => {
        const ideaList = document.getElementById('idea-list');
        ideaList.innerHTML = ''; 
        if (ideas.length === 0) {
            ideaList.innerHTML = 'No ideas available. Repository Empty (!)';
        } else {
            const gridContainer = document.createElement('div');
            gridContainer.classList.add('idea-grid');
            ideas.forEach(idea => {
                const note = document.createElement('div');
                note.classList.add('idea-note');
                note.innerHTML = `
                    <strong>${idea.title}</strong><br>
                    <em>Categories: ${idea.categories.join(', ')}</em><br>
                    <em>Tags: ${idea.tags.join(', ')}</em><br>
                    <br /><br />
                    <div id="idea-data">${idea.content}</div>
                `;
                gridContainer.appendChild(note);
            });
            ideaList.appendChild(gridContainer);
        }
    };

    async function sendTextSearch(e) {
        //STOP GET requests.
        e.preventDefault();
        //STOP Double click.
        searchTextSubmit.disabled = true;

        // DOM Elements
        const textSearch = document.getElementById('search-by-text');
        const searchTextForm = document.getElementById('search-text-form');
        // User Input
        const text = textSearch.value;

        //Text has the same constraints as content in AddIdeas. Same Regex.
        //Also can't be empty.
        if (isInvalidContent(text)) {
            console.log("Error: Text is either empty, or has invalid characters.");
            searchTextSubmit.disabled = false;
            return;
        }

        try {
            const response = await fetch('/api/text_search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {  //Error 4XX or 5XX
                const errorData = await response.json();
                console.log(errorData.error);
            }
            //Supplied Ideas indicates a success.
            const ideas = await response.json();
            displayIdeas(ideas);
        }  //Unspecified FE Errors
        catch (err) {
            console.log("TextSearch: " + err);
        }

        setTimeout(() => {
            searchTextSubmit.disabled = false;
        }, 50); 

        searchTextForm.reset();
    }

    async function sendTagCatSearch(e) {
        //STOP GET requests.
        e.preventDefault();
        //STOP double-click events.
        searchTagCatSubmit.disabled = true;

        //DOM Elements
        const searchfilterForm = document.getElementById('search-tag-form');

        //User Input 
        const categories = document.getElementById('search-by-category').value.split(',')
        .map(category => category.trim().toLowerCase()).filter(category => category !== "");
        const tags = document.getElementById('search-by-tag').value.split(',')
        .map(tag => tag.trim().toLowerCase()).filter(tag => tag !== "");

        //First check that both categories and tags are not empty.
        if ((categories.length === 0) && (tags.length === 0)) {
            console.log("Error: Both category and tag fields are empty.");
            searchTagCatSubmit.disabled = false;
            return;
        }

        if ((categories.length !== 0) && isREInvalid(categories)) {
            console.log("Error: Invalid charcters detected in category field.");
            searchTagCatSubmit.disabled = false;
            return;
        }

        if ((tags.length !== 0) && isREInvalid(tags)) {
            console.log("Error: Invalid charcters detected in tag field.");
            searchTagCatSubmit.disabled = false;
            return;
        }

        try {
            const response =  await fetch('/api/ct_search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categories, tags }),
            });

            if (!response.ok) {  //Error 4XX or 5XX
                const errorData = await response.json();
                console.log(errorData.error);
            }
            //otherwise, we got ideas. Getting ideas signals success.
            const ideas = await response.json();
            displayIdeas(ideas);
        }  //Unspecified FE Errors
        catch (err) {
            console.log("TagSearch: " + err);
        }

        setTimeout(() => {
            searchTagCatSubmit.disabled = false;
        }, 100); 
        //If we have a user error, we don't reset form (see logic above).
        searchfilterForm.reset();
    }

    // Function to fetch and display random ideas based on user input
    async function fetchRandomIdeas(e) {
        //STOP GET requests.
        e.preventDefault();
        //STOP double-click events.
        randomizeButton.disabled = true;

        //Dom Element
        const randomForm = document.getElementById("random-ideas-form");
        //User Field
        const randomCount = document.getElementById('random-count');
        
        count = parseInt(randomCount.value) || -1;
        
        if (count < 1 || count > 12) {
            console.log("Error: Number must be between 1 and 12");
            randomizeButton.disabled = false;
            return;
        }
        try {
            const response = await fetch('/api/random_ideas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ count }),
            });

            if (!response.ok) {  //Error 4XX or 5XX
                const errorData = await response.json();
                alert(errorData.error);
                return;
            }
            const ideas = await response.json();
            displayIdeas(ideas);
        } catch (error) {
            console.log("RandomIdeas: " +  error);
        }
        setTimeout(() => {
            randomizeButton.disabled = false;
        }, 50); 
        randomForm.reset();
    }

    async function deleteIdea(e) {
        deleteButton.disabled = true;

        //Fetch the ID. check it is numeric and integer, or in range.
        //Some invalid/error cases mapped to -1
        const recordID = parseInt(document.getElementById("record-id").value) || -1;

        //Screen invalid and negative numbers
        if (recordID <= 0){ //Then terminate
            console.log("Warning: Invalid record number. Enter number between 1 and N.")
            deleteButton.disabled = false;
            return;
        }  

        //Things probably OK. Send our POST.
        try {
            const response = await fetch('/api/delete_idea', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recordID }),
            });
            //const response = await fetch(`/api/random_ideas?count=${count}`);
            //response.json processes body - this is an error case.
            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData.error || "ERROR: Deletion request failed.");
                return;
            }
            //main case: no error and 2XX status code recieved.
            //process body
            const msg = await response.json();
            console.log("response message is: " + msg.status);

        } catch (error) {
            console.error("Error deleting random idea:", error);
        }

        setTimeout(() => {
            deleteButton.disabled = false;
        }, 100); 
    }

    function addScreenOff(e) {
        blurredScreen.style.display = 'none';
    }

    function addScreenOn(e) {
        blurredScreen.style.display = 'flex';
    }

    //Designed by chatGPT.
    //assumes we have run .trim()
    function isInvalidContent(input) {
        // Check if the string is empty
        if (input.length === 0) {
            return true;
        }
        // Check if the string is alphanumeric or has normal spaces " "
        const isREValid = /^[a-zA-Z0-9_\-,;?!.]+$/.test(input);
        if (!isREValid) {
            return true;
        }
        return false;
    }

    //for the search filter, we can have empty cat/tag,
    //so this call is decoupled from isInvalidTagCat.
    function isREInvalid(input) {
        return !(/^[a-zA-Z0-9_-]+$/.test(input));
    }

    function isInvalidTagCat(input) {
        // Is field empty, or does it have invalid chars?
        return ((input.length === 0) || isREInvalid(input));
        /*if (input.length === 0) {
            return true;
        }
        if (!isREValid(input)) {
            return true;
        }
        return false; */
    }

    async function sendIdea(e) {
        //STOP GET requests.
        e.preventDefault();
        //STOP double-click events.
        addSubmitButton.disabled = true;

        const title = document.getElementById('idea-title').value;
        const content = document.getElementById('idea-content').value;
        const tags = document.getElementById('idea-tags').value.split(',')
        .map(tag => tag.trim().toLowerCase()).filter(tag => tag !== "");
        const categories = document.getElementById('idea-categories').value.split(',')
        .map(category => category.trim().toLowerCase()).filter(category => category !== "");
        const errorMessageBox = document.getElementById("add-error-message");

        //check title and content are not empty, + valid.
        if (isInvalidContent(title) || isInvalidContent(content)) {
            //write a message to error box, and make it visible.
            errorMessageBox.innerText = "Title or Content field empty, or invalid characters."
            errorMessageBox.style.display = "inline-block";
            addSubmitButton.disabled = false;
            return;
        }
        //check if tags or categories are empty.
        if (isInvalidTagCat(tags) || isInvalidTagCat(categories)) {
            errorMessageBox.innerText = "Categories or Tags field empty, or invalid characters."
            errorMessageBox.style.display = "inline-block";
            addSubmitButton.disabled = false;
            return;
        }

        try {
            const response = await fetch('/api/add_idea', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, tags, categories }),
            });

            //Check if code 4XX/5XX occured.
            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData.error || "ERROR: Server/Submission Error.");
            }
            else {
                const msg = await response.json();
                console.log(msg.status);
            }
        }  //Unspecified FE Errors
        catch (err) {
            console.log("AddIdea: " + err)
        }

        // Clear the form+errors
        ideaForm.reset();
        errorMessageBox.innerText = "";
        errorMessageBox.style.display = "none";

        fetchIdeas();

        // Re-enable
        setTimeout(() => {
            addSubmitButton.disabled = false;
        }, 50); 
    }

    /*Extended call syntax allows us to add more args more easily, if
    we want to in later versions of the code.
    Async Calls (fetch+POST) */

    addSubmitButton.addEventListener('click', async (e) => { sendIdea(e); });
    searchTagCatSubmit.addEventListener('click', async (e) => { sendTagCatSearch(e); }); 
    searchTextSubmit.addEventListener('click', async (e) => { sendTextSearch(e); });
    randomizeButton.addEventListener('click', async (e) => { fetchRandomIdeas(e); });
    deleteButton.addEventListener('click', async (e) => { deleteIdea(e); });

    //Event Listeners for UI calls:
    addIdeaButton.addEventListener('click', (e) => {  addScreenOn(e); });
    closeFormButton.addEventListener('click', (e) => { addScreenOff(e); });

    // Initial fetch (loads all ideas)
    fetchIdeas();
});
