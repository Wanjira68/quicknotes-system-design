# QuickNotes Database Design

## 1. Overview

QuickNotes uses a relational database to store users, notes, and tags. The database keeps information organized and uses primary keys and foreign keys to connect related records.

## 2. Entities

### Users

Stores information about people who use QuickNotes.

- `id`: Integer, primary key.
- `name`: VARCHAR(100), user's name.
- `email`: VARCHAR(255), user's email address, unique.
- `created_at`: TIMESTAMP, account creation date.

### Notes

Stores notes created by users.

- `id`: Integer, primary key.
- `user_id`: Integer, foreign key referencing `users.id`.
- `title`: VARCHAR(100), note title.
- `body`: TEXT, note content.
- `created_at`: TIMESTAMP, date the note was created.
- `updated_at`: TIMESTAMP, date the note was last updated.

### Tags

Stores labels that users can apply to notes.

- `id`: Integer, primary key.
- `name`: VARCHAR(50), tag name, unique.
- `created_at`: TIMESTAMP, date the tag was created.

### Note_Tags

Connects notes and tags in a many-to-many relationship.

- `note_id`: Integer, foreign key referencing `notes.id`.
- `tag_id`: Integer, foreign key referencing `tags.id`.
- Composite primary key: (`note_id`, `tag_id`).

## 3. Relationships

### One-to-Many: Users and Notes

One user can create many notes, but each note belongs to one user. The `user_id` foreign key in the `notes` table connects each note to its owner.

### Many-to-Many: Notes and Tags

One note can have many tags, and one tag can be applied to many notes. The `note_tags` table connects notes and tags using the `note_id` and `tag_id` foreign keys.

### Relationship Summary

- `users` → `notes`: One-to-many.
- `notes` ↔ `tags`: Many-to-many through `note_tags`.

## 4. SQL CREATE TABLE Statements

The following SQL statements create the four tables and define their primary keys, foreign keys, and constraints.

### Create Users Table

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Create Notes Table

```sql
CREATE TABLE notes (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Create Tags Table

```sql
CREATE TABLE tags (
    id INTEGER PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Create Note_Tags Table

```sql
CREATE TABLE note_tags (
    note_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (note_id, tag_id),
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

The composite primary key in `note_tags` prevents the same tag from being attached to the same note more than once. The cascading deletes remove related links when a note or tag is deleted.

## 5. Example SQL Queries

### Query 1: Get All Notes for a User

This query retrieves notes belonging to a specific user.

```sql
SELECT id, title, body, created_at
FROM notes
WHERE user_id = 1
ORDER BY created_at DESC;
```

### Query 2: Get Notes with Their Owners

This query uses a `JOIN` to show each note alongside the name and email of its owner.

```sql
SELECT notes.title, notes.body, users.name, users.email
FROM notes
JOIN users ON notes.user_id = users.id;
```

### Query 3: Get Tags for Each Note

This query joins three tables to retrieve the tags attached to each note.

```sql
SELECT notes.title, tags.name AS tag_name
FROM notes
JOIN note_tags ON notes.id = note_tags.note_id
JOIN tags ON note_tags.tag_id = tags.id;
```

### Query 4: Count Notes per User

This query counts how many notes each user has created.

```sql
SELECT users.name, COUNT(notes.id) AS total_notes
FROM users
LEFT JOIN notes ON users.id = notes.user_id
GROUP BY users.id, users.name;
```

## 6. Indexing

Create an index on `notes.user_id`:

```sql
CREATE INDEX idx_notes_user_id ON notes(user_id);
```

**Reason:** The index helps the database find notes belonging to a particular user more quickly, especially when the database contains many notes.

## 7. Why SQL Instead of NoSQL?

QuickNotes uses a relational SQL database because its data has clear relationships between users, notes, and tags.

### Reasons for Choosing SQL

1. **Relationships:** Foreign keys connect notes to users and connect notes to tags through the `note_tags` table.
2. **Data integrity:** Primary keys, foreign keys, and unique constraints help prevent invalid or duplicate records.
3. **Reliable transactions:** SQL databases support transactions, helping ensure that related changes are completed consistently.
4. **Flexible queries:** SQL supports filtering, sorting, grouping, and joining data across multiple tables.
5. **Structured data:** Users, notes, and tags have well-defined fields that fit naturally into relational tables.

### Why Not NoSQL?

A NoSQL database can be useful for flexible or rapidly changing data structures and certain large-scale workloads. However, QuickNotes has structured data and clear relationships that benefit from relational constraints and joins.

For this project, a relational SQL database is a straightforward choice that supports consistency, data integrity, and efficient querying.