# QuickNotes System Design

## Project Description

QuickNotes is a simple notes application that demonstrates how a web client communicates with a REST API. Users can load notes, create new notes, and delete existing notes through the browser.

This project also documents how a production-ready notes system could be designed, including its REST API, relational database, and scalable system architecture.

## Features

- Load notes from a REST API.
- Create notes with a title and body.
- Delete notes.
- Display loading, success, error, and empty states.
- Validate note titles before submission.
- Safely display user-provided text using `textContent`.
- Document API endpoints, database tables, and system architecture.

## Technologies Used

- HTML5
- CSS3
- JavaScript (Fetch API and async/await)
- JSONPlaceholder test API
- SQL
- Markdown and Mermaid diagrams
- Git and GitHub

## How to Run the API Client

1. Clone this repository from GitHub.
2. Open the project folder in Visual Studio Code.
3. Open the project using the Live Server extension.
4. Click **Load Notes** to retrieve notes from the API.
5. Enter a title and optional body, then click **Create Note**.
6. Click **Delete** to remove a displayed note.

The API endpoint used by the client is:

`https://jsonplaceholder.typicode.com/posts`

**Important:** JSONPlaceholder is a testing service. Creating or deleting a note simulates the API operation; changes are not permanently stored on the server.

## Project Documentation

- [REST API Design](docs/api-design.md) — REST endpoints, request and response examples, status codes, and error handling.
- [Database Design](docs/data-model.md) — entities, relationships, SQL table definitions, queries, and indexing.
- [System Architecture](docs/architecture.md) — requirements, capacity estimates, architecture diagram, request flows, trade-offs, and reliability.

## What I Learned

1. How to use JavaScript's Fetch API and `async/await` to communicate with a REST API.
2. How HTTP methods such as GET, POST, and DELETE represent different operations.
3. Why API requests need error handling, validation, and clear status messages.
4. How relational database tables use primary keys and foreign keys to represent relationships.
5. How caching, load balancing, read replicas, and background workers can support a scalable system.
6. How Git commits help track project changes and document development progress.

## Future Improvements

- Connect the application to a persistent backend and database.
- Add user registration and authentication.
- Allow users to edit notes and organize them with tags.
- Add automated tests and deployment instructions.