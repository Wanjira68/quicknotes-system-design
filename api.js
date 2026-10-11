const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadButton = document.getElementById("load-btn");
const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");
const submitButton = document.getElementById("submit-btn");
const statusMessage = document.getElementById("status");
const notesList = document.getElementById("notes-list");

let notes = [];

// Show loading, success, or error messages.
function showStatus(message, type = "") {
  statusMessage.textContent = message;
  statusMessage.className = type;
}

// Reusable function for making API requests.
async function request(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// Display notes safely using textContent.
function renderNotes() {
  notesList.replaceChildren();

  if (notes.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent = "No notes to display.";
    notesList.appendChild(emptyMessage);
    return;
  }

  notes.forEach((note) => {
    const item = document.createElement("li");
    item.className = "note";

    const title = document.createElement("h3");
    title.textContent = note.title;

    const body = document.createElement("p");
    body.textContent = note.body || "No note body provided.";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteNote(note.id, deleteButton));

    item.append(title, body, deleteButton);
    notesList.appendChild(item);
  });
}

// GET: Load the first 10 notes.
async function loadNotes() {
  loadButton.disabled = true;
  showStatus("Loading notes...", "loading");

  try {
    const data = await request(`${API_URL}?_limit=10`);
    notes = data;
    renderNotes();

    if (notes.length === 0) {
      showStatus("No notes found.", "success");
    } else {
      showStatus(`Successfully loaded ${notes.length} notes.`, "success");
    }
  } catch (error) {
    showStatus(`Could not load notes: ${error.message}`, "error");
  } finally {
    loadButton.disabled = false;
  }
}

// POST: Create a note.
async function createNote(event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (!title) {
    showStatus("Please enter a title.", "error");
    titleInput.focus();
    return;
  }

  if (title.length > 100) {
    showStatus("The title must be 100 characters or fewer.", "error");
    titleInput.focus();
    return;
  }

  submitButton.disabled = true;
  showStatus("Creating note...", "loading");

  try {
    const newNote = await request(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        body,
        userId: 1
      })
    });

    notes.unshift(newNote);
    renderNotes();
    noteForm.reset();
    showStatus("Note created successfully.", "success");
  } catch (error) {
    showStatus(`Could not create note: ${error.message}`, "error");
  } finally {
    submitButton.disabled = false;
  }
}

// DELETE: Remove a note.
async function deleteNote(id, deleteButton) {
  const previousText = deleteButton.textContent;
  deleteButton.disabled = true;
  deleteButton.textContent = "Deleting...";
  loadButton.disabled = true;

  showStatus("Deleting note...", "loading");

  try {
    await request(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    notes = notes.filter((note) => note.id !== id);
    renderNotes();
    showStatus("Note deleted successfully.", "success");
  } catch (error) {
    showStatus(`Could not delete note: ${error.message}`, "error");
    deleteButton.textContent = previousText;
    deleteButton.disabled = false;
  } finally {
    loadButton.disabled = false;
  }
}

// Connect the buttons and form to their functions.
loadButton.addEventListener("click", loadNotes);
noteForm.addEventListener("submit", createNote);

// Show the initial empty state.
renderNotes();