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
    const resolvedMessage =
      message ||
      getSearchMessage(
        "errorGeneric",
        "There was a problem with search. Please try again later.",
      );
    const sanitizedMessage = DOMPurify.sanitize(resolvedMessage);
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

// Read translated search messages from the page when available.
function getSearchMessage(key, fallback) {
  if (
    typeof window !== "undefined" &&
    window.SEARCH_I18N &&
    window.SEARCH_I18N.messages &&
    window.SEARCH_I18N.messages[key]
  ) {
    return window.SEARCH_I18N.messages[key];
  }
  return fallback;
}

function getIndexUrl(searchResults) {
  if (searchResults && searchResults.dataset && searchResults.dataset.indexUrl) {
    return searchResults.dataset.indexUrl;
  }

  const formWithIndex = document.querySelector("form[data-index-url]");
  if (formWithIndex && formWithIndex.dataset.indexUrl) {
    return formWithIndex.dataset.indexUrl;
  }

  const dataIndexElement = document.querySelector("[data-search-index-url]");
  if (dataIndexElement && dataIndexElement.dataset.searchIndexUrl) {
    return dataIndexElement.dataset.searchIndexUrl;
  }

  return "/index.json";
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
      `<div class='alert'>${getSearchMessage(
        "minChars",
        "Please enter at least 2 characters to search",
      )}</div>`;
  }
} catch (error) {
  console.error("Error initializing search:", error);
  displayError(
    getSearchMessage(
      "errorGeneric",
      "There was a problem with search. Please try again later.",
    ),
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
          `<div class='alert'>${getSearchMessage(
            "minChars",
            "Please enter at least 2 characters to search",
          )}</div>`;
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
      getSearchMessage(
        "errorGeneric",
        "There was a problem with search. Please try again later.",
      ),
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
      `<div class="spinner-border text-primary" role="status"><span class="visually-hidden">${getSearchMessage(
        "loading",
        "Loading...",
      )}</span></div>`;

    const indexUrl = getIndexUrl(searchResults);
    fetch(indexUrl)
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
          populateResults(result);
        } else {
          searchResults.insertAdjacentHTML(
            "beforeend",
            `<div class='alert'>${getSearchMessage(
              "noMatches",
              "No matches found",
            )}</div>`,
          );
        }
      })
      .catch((error) => {
        console.error("Error executing search:", error);
        displayError();
      });
  } catch (error) {
    console.error("Error in search execution:", error);
    displayError();
  }
}

function populateResults(result) {
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
    const templateDefinition = templateElement.innerHTML;

    for (const [key, value] of result.entries()) {
      if (!value || !value.item) {
        console.warn("Skipping invalid search result item", value);
        continue;
      }

      const contents = value.item.contents || "";
      let snippet = "";
      const snippetHighlights = [];
      let start;
      let end;

      if (fuseOptions.tokenize) {
        snippetHighlights.push(searchQuery);
      } else {
        if (value.matches) {
          for (const mvalue of value.matches) {
            if (!mvalue || typeof mvalue.key !== "string") {
              continue;
            }

            if (
              mvalue.key === "tags" ||
              mvalue.key === "categories"
            ) {
              snippetHighlights.push(mvalue.value);
            } else if (
              mvalue.key === "contents" &&
              Array.isArray(mvalue.indices) &&
              mvalue.indices.length > 0
            ) {
              try {
                start =
                  mvalue.indices[0][0] - summaryInclude > 0
                    ? mvalue.indices[0][0] - summaryInclude
                    : 0;
                end =
                  mvalue.indices[0][1] + summaryInclude < contents.length
                    ? mvalue.indices[0][1] + summaryInclude
                    : contents.length;
                snippet += contents.substring(start, end);

                if (typeof mvalue.value === "string") {
                  const highlightValue =
                    mvalue.indices[0][1] - mvalue.indices[0][0] + 1;
                  if (
                    highlightValue > 0 &&
                    mvalue.indices[0][0] < mvalue.value.length
                  ) {
                    snippetHighlights.push(
                      mvalue.value.substring(
                        mvalue.indices[0][0],
                        mvalue.indices[0][0] + highlightValue,
                      ),
                    );
                  }
                }
              } catch (e) {
                console.warn("Error processing match indices", e);
              }
            }
          }
        }
      }

      if (snippet.length < 1 && contents) {
        snippet += contents.substring(0, summaryInclude * 2);
      }

      try {
        // Insert the templated result
        const tags = value.item.tags || "";
        const categories = value.item.categories || "";
        const output = render(templateDefinition, {
          key: key,
          title: value.item.title || getSearchMessage("untitled", "Untitled"),
          link: value.item.permalink || "#",
          tags: Array.isArray(tags) ? tags.join(',') : tags,
          categories: Array.isArray(categories) ? categories.join(',') : categories,
          snippet: snippet || getSearchMessage("noPreview", "No preview available"),
        });
        searchResults.insertAdjacentHTML("beforeend", output);
        
        // Add tags/categories as clickable badges
        const resultElement = document.getElementById(`summary-${key}`);
        if (resultElement && typeof addTagsToResult === 'function') {
          addTagsToResult(resultElement);
        }

        // Add highlighting after insertion
        for (const snipvalue of snippetHighlights) {
          if (!snipvalue) continue;

          const summaryElem = document.getElementById(`summary-${key}`);
          if (summaryElem && typeof Mark !== "undefined") {
            try {
              const markInstance = new Mark(summaryElem);
              markInstance.mark(snipvalue);
            } catch (e) {
              console.warn("Error highlighting text:", e);
            }
          }
        }
      } catch (error) {
        console.error("Error rendering search result:", error);
      }
    }
  } catch (error) {
    console.error("Error populating results:", error);
    displayError(
      getSearchMessage(
        "errorGeneric",
        "There was a problem with search. Please try again later.",
      ),
    );
  }
}

function render(templateString, data) {
  try {
    if (!templateString || !data) {
      throw new Error("Invalid template or data");
    }

    let conditionalMatches, conditionalPattern, copy;
    conditionalPattern = /\$\{\s*isset ([a-zA-Z]*) \s*\}(.*)\$\{\s*end\s*}/g;

    // Since loop below depends on re.lastIndex, we use a copy to capture any manipulations
    copy = templateString;

    while ((conditionalMatches = conditionalPattern.exec(templateString)) !== null) {
      if (conditionalMatches.length < 3) continue;

      if (data[conditionalMatches[1]]) {
        // Valid key, remove conditionals, leave contents
        copy = copy.replace(conditionalMatches[0], conditionalMatches[2]);
      } else {
        // Not valid, remove entire section
        copy = copy.replace(conditionalMatches[0], "");
      }
    }

    let result = copy;

    // Now any conditionals removed we can do simple substitution
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key];
        if (value !== undefined && value !== null) {
          const find = `\\$\\{\\s*${key}\\s*\\}`;
          const re = new RegExp(find, "g");
          result = result.replace(re, value);
        }
      }
    }

    return result;
  } catch (error) {
    console.error("Error rendering template:", error);
    return `<div class="alert alert-danger">${getSearchMessage(
      "errorGeneric",
      "There was a problem with search. Please try again later.",
    )}</div>`;
  }
}
