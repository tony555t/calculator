var defaultQuotes = [
    { text: "If you want to go fast, go alone. If you want to go far, go together.", category: "unity" },
    { text: "The child who is not embraced by the village will burn it down to feel its warmth.", category: "community" },
    { text: "When the roots of a tree begin to decay, it spreads death to the branches.", category: "wisdom" },
    { text: "A wise person will always find a way.", category: "wisdom" },
    { text: "The lion does not turn around when a small dog barks.", category: "strength" },
    { text: "Ubuntu: I am because we are.", category: "unity" },
    { text: "Smooth seas do not make skillful sailors.", category: "perseverance" },
    { text: "However far the stream flows, it never forgets its source.", category: "heritage" },
    { text: "When spider webs unite, they can tie up a lion.", category: "unity" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", category: "wisdom" }
];

var quotes = [];
var currentCategory = "all";
var quotesShownCount = 0;
var filteredQuotes = [];

function saveQuotes() {
    try {
        var quotesJson = JSON.stringify(quotes);
        localStorage.setItem('dynamicQuotes', quotesJson);
        console.log('Quotes saved to local storage');
    } catch (error) {
        alert('Error saving quotes: ' + error.message);
    }
}

function saveFilterPreference(category) {
    try {
        localStorage.setItem('lastSelectedFilter', category);
        console.log('Filter preference saved: ' + category);
    } catch (error) {
        console.log('Error saving filter preference: ' + error.message);
    }
}

function loadFilterPreference() {
    try {
        var savedFilter = localStorage.getItem('lastSelectedFilter');
        if (savedFilter) {
            currentCategory = savedFilter;
            console.log('Filter preference loaded: ' + savedFilter);
            return savedFilter;
        }
    } catch (error) {
        console.log('Error loading filter preference: ' + error.message);
    }
    return "all";
}

function loadQuotes() {
    try {
        var savedQuotes = localStorage.getItem('dynamicQuotes');
        if (savedQuotes) {
            quotes = JSON.parse(savedQuotes);
            console.log('Quotes loaded from local storage');
        } else {
            quotes = defaultQuotes.slice();
            saveQuotes();
            console.log('Using default quotes');
        }
    } catch (error) {
        console.log('Error loading quotes, using defaults: ' + error.message);
        quotes = defaultQuotes.slice();
    }
}

function saveLastQuote(quote) {
    try {
        var lastQuoteData = {
            text: quote.text,
            category: quote.category,
            timestamp: new Date().toLocaleString()
        };
        sessionStorage.setItem('lastQuoteViewed', JSON.stringify(lastQuoteData));
        updateLastQuoteDisplay();
    } catch (error) {
        console.log('Error saving to session storage: ' + error.message);
    }
}

function getLastQuote() {
    try {
        var lastQuote = sessionStorage.getItem('lastQuoteViewed');
        if (lastQuote) {
            return JSON.parse(lastQuote);
        }
    } catch (error) {
        console.log('Error loading from session storage: ' + error.message);
    }
    return null;
}

function updateLastQuoteDisplay() {
}

function populateCategories() {
    var categoryFilter = document.getElementById('categoryFilter');
    var allCategories = ['all'];
    
    for (var i = 0; i < quotes.length; i++) {
        var cat = quotes[i].category;
        if (allCategories.indexOf(cat) === -1) {
            allCategories.push(cat);
        }
    }
    
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    for (var i = 1; i < allCategories.length; i++) {
        var option = document.createElement('option');
        option.value = allCategories[i];
        option.text = allCategories[i].charAt(0).toUpperCase() + allCategories[i].slice(1);
        categoryFilter.appendChild(option);
    }
    
    categoryFilter.value = currentCategory;
    
    console.log('Categories populated: ' + allCategories.length + ' total');
}

function filterQuotes() {
    var categoryFilter = document.getElementById('categoryFilter');
    var selectedCategory = categoryFilter.value;
    
    currentCategory = selectedCategory;
    
    saveFilterPreference(selectedCategory);
    
    filteredQuotes = [];
    for (var i = 0; i < quotes.length; i++) {
        if (selectedCategory === "all" || quotes[i].category === selectedCategory) {
            filteredQuotes.push(quotes[i]);
        }
    }
    
    updateFilteredDisplay();
    updateLastQuoteDisplay();
    buildCategoryButtons();
    
    console.log('Filter applied: ' + selectedCategory + ' (' + filteredQuotes.length + ' quotes)');
}

function updateFilteredDisplay() {
    var quoteDisplay = document.getElementById("quoteDisplay");
    
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = "No quotes found in the '" + currentCategory + "' category. Try adding some or select a different category!";
    } else {
        quoteDisplay.innerHTML = "Showing " + filteredQuotes.length + " quote(s) in '" + 
            (currentCategory === "all" ? "all categories" : currentCategory) + 
            "'. Click 'Show New Quote' to see a random quote from this selection.";
    }
}

function showRandomQuote() {
    var availableQuotes = filteredQuotes.length > 0 ? filteredQuotes : [];

    if (availableQuotes.length === 0) {
        document.getElementById("quoteDisplay").innerHTML = "No quotes available in the selected category!";
        return;
    }

    var randomIndex = Math.floor(Math.random() * availableQuotes.length);
    var quote = availableQuotes[randomIndex];

    var quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = '<div class="quote-text">"' + quote.text + '"</div>' +
                             '<div class="quote-category">' + quote.category + '</div>';

    saveLastQuote(quote);

    quotesShownCount++;
    updateStats();
}

function updateStats() {
    var total = quotes.length;
    var categoryList = [];

    for (var i = 0; i < quotes.length; i++) {
        var cat = quotes[i].category;
        if (categoryList.indexOf(cat) === -1) {
            categoryList.push(cat);
        }
    }

    document.getElementById("totalQuotes").innerHTML = total;
    document.getElementById("totalCategories").innerHTML = categoryList.length;
    document.getElementById("quotesShown").innerHTML = quotesShownCount;
    
    var filteredCount = currentCategory === "all" ? total : filteredQuotes.length;
    document.getElementById("totalQuotes").innerHTML = total + " (showing " + filteredCount + ")";
}

function addQuote() {
    var newText = document.getElementById("newQuoteText").value;
    var newCategory = document.getElementById("newQuoteCategory").value;

    if (newText === "" || newCategory === "") {
        alert("Please fill in both fields.");
        return;
    }

    var newQuote = {
        text: newText,
        category: newCategory.toLowerCase()
    };
    quotes.push(newQuote);

    saveQuotes();

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    alert("New quote added and saved!");

    populateCategories();
    filterQuotes();
    buildCategoryButtons();
    updateStats();
    hideForm();
}

function exportToJson() {
    try {
        var quotesJson = JSON.stringify(quotes, null, 2);
        var blob = new Blob([quotesJson], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        
        var downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'my-quotes-' + new Date().toISOString().split('T')[0] + '.json';
        downloadLink.style.display = 'none';
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        URL.revokeObjectURL(url);
        alert('Quotes exported successfully!');
    } catch (error) {
        alert('Error exporting quotes: ' + error.message);
    }
}

function importFromJsonFile(event) {
    var file = event.target.files[0];
    if (!file) {
        return;
    }

    var fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            var importedQuotes = JSON.parse(event.target.result);
            
            if (!Array.isArray(importedQuotes)) {
                alert('Invalid file format. Please upload a valid JSON array of quotes.');
                return;
            }

            for (var i = 0; i < importedQuotes.length; i++) {
                if (!importedQuotes[i].text || !importedQuotes[i].category) {
                    alert('Invalid quote format in file. Each quote must have "text" and "category" properties.');
                    return;
                }
            }

            for (var i = 0; i < importedQuotes.length; i++) {
                quotes.push(importedQuotes[i]);
            }

            saveQuotes();
            populateCategories();
            filterQuotes();
            buildCategoryButtons();
            updateStats();
            
            alert('Successfully imported ' + importedQuotes.length + ' quotes!');
            
            document.getElementById('importFile').value = '';
            
        } catch (error) {
            alert('Error reading file: ' + error.message + '. Please check that it is a valid JSON file.');
        }
    };
    
    fileReader.onerror = function() {
        alert('Error reading file. Please try again.');
    };
    
    fileReader.readAsText(file);
}

function clearAllData() {
    if (confirm('Are you sure you want to clear all quotes? This cannot be undone.')) {
        localStorage.removeItem('dynamicQuotes');
        localStorage.removeItem('lastSelectedFilter');
        sessionStorage.removeItem('lastQuoteViewed');
        quotes = defaultQuotes.slice();
        currentCategory = "all";
        saveQuotes();
        populateCategories();
        filterQuotes();
        buildCategoryButtons();
        updateStats();
        updateLastQuoteDisplay();
        document.getElementById("quoteDisplay").innerHTML = 'All data cleared. Click "Show New Quote" to start fresh!';
        alert('All data cleared successfully!');
    }
}

function toggleForm() {
    var form = document.getElementById("addQuoteForm");
    var btn = document.getElementById("toggleForm");

    if (form.style.display === "none" || form.style.display === "") {
        form.style.display = "block";
        btn.innerHTML = "Cancel";
    } else {
        form.style.display = "none";
        btn.innerHTML = "Add Quote";
    }
}

function hideForm() {
    document.getElementById("addQuoteForm").style.display = "none";
    document.getElementById("toggleForm").innerHTML = "Add Quote";
}

function buildCategoryButtons() {
    var allCategories = ["all"];

    for (var i = 0; i < quotes.length; i++) {
        var cat = quotes[i].category;
        if (allCategories.indexOf(cat) === -1) {
            allCategories.push(cat);
        }
    }

    var buttonDiv = document.getElementById("categoryButtons");
    buttonDiv.innerHTML = "";

    for (var j = 0; j < allCategories.length; j++) {
        var btn = document.createElement("button");
        btn.innerHTML = allCategories[j];
        btn.className = "category-btn";

        if (allCategories[j] === currentCategory) {
            btn.className += " active";
        }

        btn.onclick = (function(catName) {
            return function() {
                currentCategory = catName;
                buildCategoryButtons();
                if (catName !== "all") {
                    showRandomQuote();
                }
            }
        })(allCategories[j]);

        buttonDiv.appendChild(btn);
    }
}

window.onload = function() {
    loadQuotes();
    
    currentCategory = loadFilterPreference();
    
    document.getElementById("newQuote").onclick = showRandomQuote;
    document.getElementById("toggleForm").onclick = toggleForm;
    document.getElementById("exportBtn").onclick = exportToJson;
    document.getElementById("clearBtn").onclick = clearAllData;

    populateCategories();
    filterQuotes();
    buildCategoryButtons();
    updateStats();
    updateLastQuoteDisplay();
    
    console.log('Application initialized with ' + quotes.length + ' quotes');
    console.log('Active filter: ' + currentCategory);
};