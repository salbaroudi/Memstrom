document.addEventListener('DOMContentLoaded', () => {
    const ideaList = document.getElementById('idea-list');
    const tagSearch = document.getElementById('search-by-tag');
    const addIdeaForm = document.getElementById('add-idea-form');
    const randomizeBtn = document.getElementById('randomizeBtn');
    const randomCount = document.getElementById('randomCount');
    const searchSubmit = document.getElementById('search-submit');
    const deleteButton = document.getElementById('deletebutton');
    const searchfilterForm = document.getElementById('search-form');

    // Fetch and display all ideas, optionally filtering by tag
    const fetchIdeas = async (tag = '') => {
        //const response = await fetch(`/api/ideas${tag ? `?tag=${tag}` : ''}`);
        const response =     await fetch('/api/ideas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tag }),
        });
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

    // Handle search input
    searchSubmit.addEventListener('click', () => {
        //An annoying double-click sometimes occurs:
        searchSubmit.disabled = true;
        const tag = tagSearch.value.trim();
        fetchIdeas(tag);  // Fetch ideas based on search tag
        //Reactivate after 0.25s
        setTimeout(() => {
            searchSubmit.disabled = false;
        }, 250); 
        searchfilterForm.reset();
    });

    // Handle form submission (adding a new idea)
    addIdeaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim().toLowerCase());
        const categories = document.getElementById('categories').value.split(',').map(tag => tag.trim().toLowerCase());
        await fetch('/api/add_idea', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, tags, categories }),
        });
        
        // Clear the form and refresh the idea list
        addIdeaForm.reset();
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
});
