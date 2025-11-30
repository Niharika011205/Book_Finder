# 🔧 How CRUD Operations Work

This document explains how each CRUD operation is implemented in the Book Finder & Library Manager.

---

## 📚 Overview

The app uses **JSON Server** as a REST API backend. All data is stored in `db.json`.

**Base URL**: `http://localhost:5000`

---

## 1️⃣ CREATE - Add Book to Library

### User Action
User clicks "Add to Library" on a search result.

### Frontend Code
**File**: `frontend/src/api/library.js`

```javascript
export const addBookToLibrary = async (book) => {
  const newBook = {
    ...book,
    status: 'to-read',
    favourite: false,
    notes: '',
    addedAt: new Date().toISOString()
  };
  const response = await axios.post(`${API_BASE}/books`, newBook);
  return response.data;
};
```

### API Call
```http
POST http://localhost:5000/books
Content-Type: application/json

{
  "googleId": "abc123",
  "title": "JavaScript: The Good Parts",
  "authors": ["Douglas Crockford"],
  "thumbnail": "https://...",
  "description": "...",
  "status": "to-read",
  "favourite": false,
  "notes": "",
  "addedAt": "2025-11-30T10:00:00.000Z"
}
```

### What Happens
- JSON Server generates a unique `id`
- Book is added to `books` array in `db.json`
- Response returns the created book with its `id`

---

## 2️⃣ READ - Get All Library Books

### User Action
User navigates to "My Library" page.

### Frontend Code
**File**: `frontend/src/api/library.js`

```javascript
export const getLibraryBooks = async () => {
  const response = await axios.get(`${API_BASE}/books`);
  return response.data;
};
```

### API Call
```http
GET http://localhost:5000/books
```

### Response
```json
[
  {
    "id": "1",
    "googleId": "abc123",
    "title": "JavaScript: The Good Parts",
    "authors": ["Douglas Crockford"],
    "status": "reading",
    "favourite": true,
    "notes": "Great book!"
  },
  ...
]
```

### What Happens
- JSON Server reads `db.json`
- Returns all books in the `books` array
- Frontend displays them in `LibraryList` component

---

## 3️⃣ UPDATE - Edit Book Details

### User Action
User clicks "Edit", changes status/favourite/notes, and clicks "Save".

### Frontend Code
**File**: `frontend/src/api/library.js`

```javascript
export const updateBook = async (id, updates) => {
  const response = await axios.patch(`${API_BASE}/books/${id}`, updates);
  return response.data;
};
```

### API Call
```http
PATCH http://localhost:5000/books/1
Content-Type: application/json

{
  "status": "finished",
  "favourite": true,
  "notes": "Loved it!"
}
```

### What Happens
- JSON Server finds the book by `id`
- Merges the updates with existing data
- Saves to `db.json`
- Returns the updated book

### PATCH vs PUT
- **PATCH**: Updates only specified fields (we use this)
- **PUT**: Replaces the entire object

---

## 4️⃣ DELETE - Remove Book from Library

### User Action
User clicks "Delete" and confirms.

### Frontend Code
**File**: `frontend/src/api/library.js`

```javascript
export const deleteBook = async (id) => {
  await axios.delete(`${API_BASE}/books/${id}`);
};
```

### API Call
```http
DELETE http://localhost:5000/books/1
```

### What Happens
- JSON Server finds the book by `id`
- Removes it from `books` array in `db.json`
- Returns status 200 (success)

---

## 🔄 Complete Flow Example

### Adding a Book to Library

1. **User searches** "React" → calls Google Books API
2. **User clicks** "Add to Library" on a result
3. **Frontend** calls `addBookToLibrary(book)`
4. **POST request** sent to JSON Server
5. **JSON Server** adds book to `db.json` with new `id`
6. **Response** returns created book
7. **Frontend** refreshes library list
8. **User sees** book in "My Library"

### Editing a Book

1. **User opens** "My Library"
2. **GET request** fetches all books
3. **User clicks** "Edit" on a book
4. **User changes** status to "finished", marks as favourite
5. **User clicks** "Save"
6. **Frontend** calls `updateBook(id, { status: 'finished', favourite: true })`
7. **PATCH request** sent to JSON Server
8. **JSON Server** updates book in `db.json`
9. **Frontend** refreshes library list
10. **User sees** updated book

---

## 🛠️ Testing CRUD Operations

### Test with Browser DevTools
1. Open DevTools (F12)
2. Go to Network tab
3. Perform actions in the app
4. See API calls in real-time

### Test with Postman/Thunder Client
```bash
# GET all books
GET http://localhost:5000/books

# POST new book
POST http://localhost:5000/books
Body: { "title": "Test Book", "authors": ["Test Author"] }

# PATCH update book
PATCH http://localhost:5000/books/1
Body: { "status": "finished" }

# DELETE book
DELETE http://localhost:5000/books/1
```

### Test by Viewing db.json
Open `db.json` in your editor and watch it update in real-time as you use the app!

---

## 📊 Data Flow Diagram

```
User Action → React Component → API Function → Axios → JSON Server → db.json
                                                                         ↓
User sees update ← React re-renders ← State updates ← Response ← ←  ←  ←
```

---

## 🎓 Key Concepts

1. **REST API**: JSON Server provides RESTful endpoints
2. **HTTP Methods**: GET (read), POST (create), PATCH (update), DELETE (delete)
3. **Async/Await**: All API calls are asynchronous
4. **State Management**: React useState/useEffect manage UI state
5. **Data Persistence**: db.json stores data permanently

---

## 💡 Learning Exercise

Try modifying the code:
1. Add a "rating" field (1-5 stars)
2. Add a "dateFinished" field for finished books
3. Add filtering by status (show only "reading" books)
4. Add sorting by title or date added

All you need to do is:
- Update the data structure in `addBookToLibrary`
- Add UI fields in `LibraryBookCard`
- Use the same CRUD functions!
