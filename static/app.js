document.addEventListener('DOMContentLoaded', () => {
    const ideaList = document.getElementById('idea-list');
    const categorySearch = document.getElementById('search-by-category');
    const tagSearch = document.getElementById('search-by-tag');
    const textSearch = document.getElementById('search-by-text');
    const addIdeaForm = document.getElementById('ideaForm');
    const addSubmitBtn = document.getElementById('addSubmitBtn');
    const randomizeBtn = document.getElementById('randomizeBtn');
    const randomCount = document.getElementById('randomCount');
    const searchSubmit = document.getElementById('search-tag-submit');
    const searchTextSubmit = document.getElementById('search-text-submit');
    const deleteButton = document.getElementById('deletebutton');
    const searchfilterForm = document.getElementById('search-tag-form');
    const searchTextForm = document.getElementById('search-text-form');

    // Fetch and display all ideas, optionally filtering by tag
    const fetchIdeas = async (categories = '', tags = '') => {
        //const response = await fetch(`/api/ideas${tag ? `?tag=${tag}` : ''}`);
        const response =     await fetch('/api/ideas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ categories, tags }),
        });
        //Process incoming body in second promise.
        const ideas = await response.json();
        displayIdeas(ideas);
    };

    const textSearchIdeas = async (text = '') => {
        //const response = await fetch(`/api/ideas${tag ? `?tag=${tag}` : ''}`);
        const response = await fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });
        //Process incoming body in second promise.
        const ideas = await response.json();
        displayIdeas(ideas);
    };


    // Display ideas in the list
    const displayIdeas = (ideas) => {
        ideaList.innerHTML = '';
        if (ideas.length === 0) {
            ideaList.innerHTML = 'No ideas available. Repository Empty (!)';
        } else {
            ideas.forEach(idea => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>${idea.title}</strong><br>
                    <em>Categories: ${idea.categories.join(', ')}</em><br>
                    <em>Tags: ${idea.tags.join(', ')}</em><br>
                    <div id="ideacontent">${idea.content}</div>
                    <hr>
                `;
                ideaList.appendChild(li);
            });
        }
    };

    searchTextSubmit.addEventListener('click', () => {
        //An annoying double-click sometimes occurs:
        searchTextSubmit.disabled = true;
        const text = textSearch.value.toLowerCase();
        //Search, and then call displayIdeas()
        textSearchIdeas(text);
        //Reactivate after 0.25s
        setTimeout(() => {
            searchTextSubmit.disabled = false;
        }, 100); 
        searchTextForm.reset();
    });

    // Handle search input
    searchSubmit.addEventListener('click', () => {
        //An annoying double-click sometimes occurs:
        searchSubmit.disabled = true;
        const categories = categorySearch.value.trim();
        const tags = tagSearch.value.trim();
        fetchIdeas(categories, tags);  // Fetch ideas based on search tag
        //Reactivate after 0.25s
        setTimeout(() => {
            searchSubmit.disabled = false;
        }, 250); 
        searchfilterForm.reset();
    });

    // Handle form submission (adding a new idea)
    addSubmitBtn.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('ideaTitle').value;
        const content = document.getElementById('ideaContent').value;
        const tags = document.getElementById('ideaTags').value.split(',').map(tag => tag.trim().toLowerCase());
        const categories = document.getElementById('ideaCategories').value.split(',').map(tag => tag.trim().toLowerCase());
        await fetch('/api/add_idea', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, tags, categories }),
        });
        
        // Clear the form and refresh the idea list
        ideaForm.reset();
        fetchIdeas();
    });

    // Function to fetch and display random ideas based on user input
    async function fetchRandomIdeas() {
        const count = parseInt(randomCount.value) || -1;
        
        if (count < 1 || count > 10) {
            alert("Please enter a number between 1 and 10.");
            return;
        }
        try {
            const response = await fetch('/api/random_ideas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ count }),
            });
            //const response = await fetch(`/api/random_ideas?count=${count}`);
            //response.json processes body - this is an error case.
            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.error || "Something went wrong!");
                return;
            }
            //main case: no error and 2XX status code recieved.
            const ideas = await response.json();

            //reset the box on success:
            randomCount.value = "";

            displayIdeas(ideas);  // Display the random ideas in the same list
        } catch (error) {
            console.error("Error fetching random ideas:", error);
            alert("Failed to fetch random ideas.");
        }
    }

    // Event listener for the Randomize button
    randomizeBtn.addEventListener('click', fetchRandomIdeas);

    async function deleteIdea() {
        //An annoying double-click sometimes occurs. Deactivate.
        deleteButton.disabled = true;

        //Fetch the ID. check it is numeric and integer, or in range.
        //Some invalid/error cases mapped to -1

        const recordID = parseInt(document.getElementById("recordID").value) || -1;

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
                alert(errorData.error || "ERROR: Deletion request failed.");
                return;
            }
            //main case: no error and 2XX status code recieved.
            //process body
            const msg = await response.json();
            console.log("response message is: " + msg.status);

        } catch (error) {
            console.error("Error deleting random idea:", error);
        }

        //Reactivate our button after 0.1s
        setTimeout(() => {
            deleteButton.disabled = false;
        }, 100); 
    }

    // Handle search input
    deleteButton.addEventListener('click', deleteIdea);

    // Initial fetch (loads all ideas)
    fetchIdeas();

    // DOM Elements
    const addIdeaBtn = document.getElementById('addbutton');
    const blurredScreen = document.getElementById('blurredScreen');
    const closeFormBtn = document.getElementById('closeFormBtn');
    const ideaForm = document.getElementById('ideaForm');

    // Event listener to show the form
    addIdeaBtn.addEventListener('click', () => {
        blurredScreen.style.display = 'flex'; // Display the blurred screen
    });

    // Event listener to close the form
    closeFormBtn.addEventListener('click', () => {
        blurredScreen.style.display = 'none'; // Hide the blurred screen
    });



});
