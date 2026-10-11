# QuickNotes API Design

## 1. Overview

The QuickNotes API allows users to create, view, update, and delete notes. It also allows users to view tags and organize their notes.

The API uses REST principles and JSON for request and response data. All endpoints use HTTPS in production.

Base URL:

`https://api.quicknotes.com/v1`

## 2. REST Endpoints

| Method | Path | Description | Success Status |
|---|---|---|---|
| GET | `/notes` | List the current user's notes | 200 OK |
| GET | `/notes/{noteId}` | Retrieve one note by ID | 200 OK |
| POST | `/notes` | Create a new note | 201 Created |
| PATCH | `/notes/{noteId}` | Update an existing note | 200 OK |
| DELETE | `/notes/{noteId}` | Delete a note | 204 No Content |
| GET | `/tags` | List the current user's tags | 200 OK |
| POST | `/notes/{noteId}/tags/{tagId}` | Add a tag to a note | 201 Created |

The `{noteId}` and `{tagId}` values identify individual resources. The API checks that the authenticated user is allowed to access each resource.

## 3. Request and Response Examples

### A. Create a note

**Request**

`POST /v1/notes`

Headers:

```http
Content-Type: application/json
Authorization: Bearer <access-token>
```

Request body:

```json
{
  "title": "Study JavaScript",
  "body": "Practise arrays and functions."
}
```

**Success response — 201 Created**

```json
{
  "id": 101,
  "userId": 7,
  "title": "Study JavaScript",
  "body": "Practise arrays and functions.",
  "createdAt": "2026-10-01T10:00:00Z",
  "updatedAt": "2026-10-01T10:00:00Z"
}
```

The server creates the note, assigns its ID and timestamps, and returns the new resource.

### B. List notes

**Request**

`GET /v1/notes?limit=10&offset=0`

Headers:

```http
Authorization: Bearer <access-token>
```

**Success response — 200 OK**

```json
{
  "data": [
    {
      "id": 101,
      "userId": 7,
      "title": "Study JavaScript",
      "body": "Practise arrays and functions.",
      "createdAt": "2026-10-01T10:00:00Z",
      "updatedAt": "2026-10-01T10:00:00Z"
    },
    {
      "id": 102,
      "userId": 7,
      "title": "Buy groceries",
      "body": "Milk, bread and eggs.",
      "createdAt": "2026-10-01T11:00:00Z",
      "updatedAt": "2026-10-01T11:00:00Z"
    }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 2
  }
}
```

The server returns only notes belonging to the authenticated user. Pagination prevents the API from returning too many notes in one response.

## 4. Other Endpoint Behaviours

### Retrieve one note

`GET /v1/notes/{noteId}`

Returns the requested note with status `200 OK` when it exists and the user has permission to view it.

### Update a note

`PATCH /v1/notes/{noteId}`

Example request body:

```json
{
  "title": "Practise JavaScript",
  "body": "Review arrays and objects."
}
```

Returns the updated note with status `200 OK`.

### Delete a note

`DELETE /v1/notes/{noteId}`

Returns `204 No Content` when the note is successfully deleted. The response has no body.

### List tags

`GET /v1/tags`

Returns the authenticated user's tags with status `200 OK`.

### Add a tag to a note

`POST /v1/notes/{noteId}/tags/{tagId}`

Creates a relationship between the note and tag. Returns `201 Created` when the relationship is created.

## 5. Error Status Codes

| Status Code | Name | When It Is Used |
|---|---|---|
| 400 | Bad Request | The request contains invalid data |
| 401 | Unauthorized | Authentication is missing or invalid |
| 403 | Forbidden | The user is not allowed to perform the action |
| 404 | Not Found | The requested resource does not exist or is not accessible |
| 500 | Internal Server Error | An unexpected server error occurs |

### Example error response

**Request:** `POST /v1/notes` with a missing title.

**Response:** `400 Bad Request`

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The title field is required."
  }
}
```

Error responses use a consistent JSON structure so that client applications can display helpful messages.

## 6. Validation and Security

- A note must have a title.
- The title cannot exceed 100 characters.
- The API validates request bodies before saving data.
- Users must authenticate before accessing their private notes.
- Users can only view, update, or delete notes they own.
- The API uses parameterized database queries to reduce SQL injection risks.
- HTTPS protects data while it travels between the client and server.
- Pagination limits the number of records returned by list endpoints.

## 7. Design Decisions

REST endpoints use HTTP methods consistently: GET reads resources, POST creates resources, PATCH updates resources, and DELETE removes resources.

JSON provides a simple format that JavaScript clients can send and receive. Standard HTTP status codes make it easier for clients to identify successful requests and handle errors correctly.

The API separates its public interface from its internal database implementation, allowing the database or server implementation to change without changing the endpoint design.