const books = [
    { name: "physics", status: "available" },
    { name: "computer", status: "available" },
    { name: "math", status: "available" },
    { name: "science", status: "available" },
];

const bookInput = document.getElementById("bookInput");
const borrowBtn = document.getElementById("borrowBtn");
const messageDiv = document.getElementById("message");
const bookList = document.getElementById("bookList");
const borrowedList = document.getElementById("borrowedList");

function renderBooks() {
    bookList.innerHTML = "";
    borrowedList.innerHTML = "";
    
    books.forEach(book => {
        const card = document.createElement("div");
        card.className = `book-card ${book.status.toLowerCase()}`;
        card.innerHTML = `
            <h3>${book.name}</h3>
            <span class="book-status ${book.status.toLowerCase()}">${book.status}</span>
        `;
        
        if (book.status === "available") {
            bookList.appendChild(card);
        } else {
            borrowedList.appendChild(card);
        }
    });
}

function showMessage(text, type = "info") {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    
    setTimeout(() => {
        messageDiv.textContent = "";
        messageDiv.className = "message";
    }, 4000);
}

function checkAvailability(name) {
    return new Promise((resolve, reject) => {
        const book = books.find(b => b.name === name.toLowerCase() && b.status === "available");
        if (book) {
            resolve("Book is available");
        } else {
            reject("Book is not available or already borrowed");
        }
    });
}

function borrowBookPromise() {
    return new Promise((resolve, reject) => {
        const want = confirm("Book is available.\nDo you want to borrow this book?");
        if (want) {
            resolve("You have successfully borrowed this book");
        } else {
            reject("Borrow request canceled");
        }
    });
}

function updateStatus(name) {
    return new Promise((resolve) => {
        const book = books.find(b => b.name === name.toLowerCase());
        if (book) {
            book.status = "Borrowed";
            resolve("Book status updated to Borrowed");
        }
    });
}

async function borrowBook() {
    const bookName = bookInput.value.trim().toLowerCase();
    
    if (!bookName) {
        showMessage("Please enter a book name", "error");
        return;
    }
    
    borrowBtn.disabled = true;
    borrowBtn.textContent = "Processing...";
    
    try {
        await checkAvailability(bookName);
        showMessage("Book is available", "success");
        
        await borrowBookPromise();
        showMessage("You have successfully borrowed this book", "success");
        
        await updateStatus(bookName);
        showMessage("Book status updated to Borrowed", "info");
        
        renderBooks();
        bookInput.value = "";
    } catch (error) {
        showMessage(error, "error");
    } finally {
        borrowBtn.disabled = false;
        borrowBtn.textContent = "Borrow";
    }
}

bookInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        borrowBook();
    }
});

renderBooks();