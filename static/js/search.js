summaryInclude = 60;

const fuseOptions = {
  shouldSort: true,
  includeMatches: true,
  threshold: 0.0,
  tokenize: true,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    { name: "title", weight: 0.9 },
    { name: "contents", weight: 0.5 },
    { name: "tags", weight: 0.3 },
    { name: "categories", weight: 0.3 },
  ],
};

// Display error message in the search results container
function displayError(message) {
  const searchResultsElement = document.getElementById("search-results");
  if (searchResultsElement) {
    const sanitizedMessage = DOMPurify.sanitize(message);
    searchResultsElement.innerHTML = `<div class="alert alert-danger">${sanitizedMessage}</div>`;
  } else {
    console.error("Search results container not found");
  }
}

// Safely get DOM element with error handling
function getElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.error(`Element with ID '${id}' not found`);
  }
  return element;
}

// Debounce function to prevent excessive search calls
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Function to update URL with search query
function updateURL(query) {
  try {
    // Create a URL object from the current URL
    const url = new URL(window.location.href);

    if (query && query.length >= 2) {
      // Set or update the 's' parameter
      url.searchParams.set("s", query);
    } else {
      // Remove the 's' parameter if query is empty or too short
      url.searchParams.delete("s");
    }

    // Update the URL without reloading the page
    window.history.replaceState({}, "", url.toString());
  } catch (error) {
    console.error("Error updating URL:", error);
    // Continue without URL update - non-critical error
  }
}

// Safe parameter extraction with error handling
function param(name) {
  try {
    const paramValue = (location.search.split(`${name}=`)[1] || "").split("&")[0];
    return paramValue ? decodeURIComponent(paramValue).replace(/\+/g, " ") : "";
  } catch (error) {
    console.error(`Error parsing URL parameter '${name}':`, error);
    return "";
  }
}

// Format date for display
function formatDate(dateString) {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date)) return '';
    
    return date.toLocaleDateString(undefined, {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

// Highlight search terms in text
function highlightText(text, searchQuery) {
  if (!text || !searchQuery) return text;
  
  try {
    // Create a case-insensitive regex for the search query
    const regex = new RegExp(`(${searchQuery.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  } catch (error) {
    console.error("Error highlighting text:", error);
    return text;
  }
}

// Get search query from URL parameter
const searchQuery = param("s");
try {
  const searchInput = getElement("search-query");
  const searchResults = getElement("search-results");

  if (searchInput && searchQuery) {
    searchInput.value = searchQuery;
    executeSearch(searchQuery);
  } else if (searchResults) {
    searchResults.innerHTML =
      "<div class='alert'>Please enter at least 2 characters to search</div>";
  }
} catch (error) {
  console.error("Error initializing search:", error);
  displayError(
    "There was a problem initializing the search. Please try again later.",
  );
}

// Add event listener for real-time searching
document.addEventListener("DOMContentLoaded", () => {
  try {
    const searchInput = getElement("search-query");
    if (!searchInput) {
      throw new Error("Search input not found");
    }

    // Create debounced search function - 300ms is a good balance
    const debouncedSearch = debounce((query) => {
      // Update URL with current search query
      updateURL(query);

      const searchResults = getElement("search-results");
      if (!searchResults) {
        throw new Error("Search results container not found");
      }

      if (query.length >= 2) {
        executeSearch(query);
      } else if (query.length === 0 || query.length === 1) {
        searchResults.innerHTML =
          "<div class='alert'>Please enter at least 2 characters to search</div>";
      }
    }, 300);

    // Set up input event for real-time searching
    searchInput.addEventListener("input", function () {
      const query = this.value.trim();
      debouncedSearch(query);
    });

    // Handle form submission to prevent page reload
    const searchForm = searchInput.closest("form");
    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query.length >= 2) {
          updateURL(query);
          executeSearch(query);
        }
      });
    }
  } catch (error) {
    console.error("Error setting up search event listeners:", error);
    displayError(
      "There was a problem setting up the search functionality. Please try reloading the page.",
    );
  }
});

function executeSearch(searchQuery) {
  try {
    if (!searchQuery || typeof searchQuery !== "string") {
      throw new Error("Invalid search query");
    }

    const searchResults = getElement("search-results");
    if (!searchResults) {
      throw new Error("Search results container not found");
    }

    // Show loading indicator
    searchResults.innerHTML =
      '<div class="d-flex justify-content-center my-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';

    fetch("/index.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.status} ${response.statusText}`,
          );
        }
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Received invalid data format from server");
        }

        const pages = data;
        const fuse = new Fuse(pages, fuseOptions);
        const result = fuse.search(searchQuery);

        // Clear previous results only when we have new results to show
        searchResults.innerHTML = "";

        if (result.length > 0) {
          // Display result count
          searchResults.insertAdjacentHTML(
            "beforeend",
            `<div class="alert alert-info mb-4">${result.length} result${result.length > 1 ? 's' : ''} found for "${DOMPurify.sanitize(searchQuery)}"</div>`
          );
          populateResults(result, searchQuery);
        } else {
          searchResults.insertAdjacentHTML(
            "beforeend",
            "<div class='alert alert-warning'>No matches found. Try adjusting your search terms.</div>",
          );
        }
      })
      .catch((error) => {
        console.error("Error executing search:", error);
        displayError(`Failed to search: ${error.message}`);
      });
  } catch (error) {
    console.error("Error in search execution:", error);
    displayError("There was a problem with the search. Please try again later.");
  }
}

function populateResults(result, searchQuery) {
  try {
    if (!Array.isArray(result)) {
      throw new Error("Invalid search results");
    }

    const searchResults = getElement("search-results");
    if (!searchResults) {
      throw new Error("Search results container not found");
    }

    const templateElement = document.getElementById("search-result-template");
    if (!templateElement) {
      throw new Error("Search result template not found");
    }
    const templateContent = templateElement.innerHTML;

    // Create a document fragment to efficiently add multiple results
    const fragment = document.createDocumentFragment();
    
    for (const [key, value] of result.entries()) {
      if (!value || !value.item) {
        console.warn("Skipping invalid search result item", value);
        continue;
      }

      // Get the item data
      const item = value.item;
      
      // Create excerpt
      let snippet = "";
      if (item.contents) {
        // Try to find the first match in the content to center the snippet there
        const matches = value.matches?.filter(match => match.key === 'contents') || [];
        
        if (matches.length > 0 && matches[0].indices && matches[0].indices.length > 0) {
          // Get the first match position
          const firstMatchIdx = matches[0].indices[0][0];
          
          // Calculate start and end positions for the snippet
          const halfSnippetLength = Math.floor(summaryInclude / 2);
          let start = Math.max(0, firstMatchIdx - halfSnippetLength);
          let end = Math.min(item.contents.length, firstMatchIdx + halfSnippetLength);
          
          // Extract the snippet
          snippet = item.contents.substring(start, end);
          
          // Add ellipsis if needed
          if (start > 0) snippet = "..." + snippet;
          if (end < item.contents.length) snippet = snippet + "...";
        } else {
          // If no specific match found, just take the beginning
          snippet = item.contents.substring(0, summaryInclude) + "...";
        }
      }
      
      // Sanitize and highlight the snippet
      snippet = DOMPurify.sanitize(snippet);
      snippet = highlightText(snippet, searchQuery);

      // Format tags and categories
      const tags = item.tags ? formatTags(item.tags, "tag") : "";
      const categories = item.categories ? formatTags(item.categories, "category") : "";
      
      // Replace template placeholders
      let renderedResult = templateContent
        .replace(/{permalink}/g, item.permalink)
        .replace(/{title}/g, highlightText(DOMPurify.sanitize(item.title), searchQuery))
        .replace(/{snippet}/g, snippet)
        .replace(/{date}/g, item.date || '')
        .replace(/{tags}/g, tags)
        .replace(/{categories}/g, categories);
      
      // Create a temporary container to hold the rendered HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = renderedResult;
      
      // Append the result to the fragment
      fragment.appendChild(tempDiv.firstElementChild);
    }
    
    // Append all results at once
    searchResults.appendChild(fragment);
    
  } catch (error) {
    console.error("Error populating results:", error);
    displayError("Failed to display search results.");
  }
}

function formatTags(tags, type) {
  if (!tags || !Array.isArray(tags)) return "";
  
  const badgeClass = type === "tag" ? "bg-primary" : "bg-secondary";
  
  return tags
    .map(tag => `<span class="badge ${badgeClass} me-1">${DOMPurify.sanitize(tag)}</span>`)
    .join(" ");
}
