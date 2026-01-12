const allBooks = [
    { name: "physics", status: "available" },
    { name: "computer science", status: "available" },
    { name: "mathematics", status: "available" },
    { name: "chemistry", status: "available" },
    { name: "biology", status: "available" },
    { name: "history", status: "available" },
    { name: "literature", status: "available" },
    { name: "philosophy", status: "available" },
    { name: "psychology", status: "available" },
    { name: "economics", status: "available" },
    { name: "sociology", status: "available" },
    { name: "political science", status: "available" },
    { name: "geography", status: "available" },
    { name: "astronomy", status: "available" },
    { name: "geology", status: "available" },
    { name: "statistics", status: "available" },
    { name: "programming", status: "available" },
    { name: "data science", status: "available" },
    { name: "machine learning", status: "available" },
    { name: "artificial intelligence", status: "available" },
    { name: "calculus", status: "available" },
    { name: "linear algebra", status: "available" },
    { name: "organic chemistry", status: "available" },
    { name: "molecular biology", status: "available" },
];

const BOOKS_PER_PAGE = 8;
let currentPage = 1;
let filteredBooks = [...allBooks];

const bookInput = document.getElementById("bookInput");
const borrowBtn = document.getElementById("borrowBtn");
const messageDiv = document.getElementById("message");
const bookList = document.getElementById("bookList");
const borrowedList = document.getElementById("borrowedList");
const modal = document.getElementById("confirmModal");
const modalCancel = document.getElementById("modalCancel");
const modalConfirm = document.getElementById("modalConfirm");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

let modalResolve = null;

function getAvailableBooks() {
    return allBooks.filter(b => b.status === "available");
}

function getBorrowedBooks() {
    return allBooks.filter(b => b.status === "borrowed");
}

function renderBooks() {
    const available = getAvailableBooks();
    const borrowed = getBorrowedBooks();
    
    const totalPages = Math.ceil(available.length / BOOKS_PER_PAGE) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    
    const start = (currentPage - 1) * BOOKS_PER_PAGE;
    const pageBooks = available.slice(start, start + BOOKS_PER_PAGE);
    
    bookList.innerHTML = "";
    borrowedList.innerHTML = "";
    
    pageBooks.forEach(book => {
        const card = document.createElement("div");
        card.className = `book-card available`;
        card.innerHTML = `
            <h3>${book.name}</h3>
            <span class="book-status available">Available</span>
        `;
        bookList.appendChild(card);
    });
    
    borrowed.forEach(book => {
        const card = document.createElement("div");
        card.className = `book-card borrowed`;
        card.innerHTML = `
            <h3>${book.name}</h3>
            <span class="book-status borrowed">Borrowed</span>
        `;
        borrowedList.appendChild(card);
    });
    
    pageInfo.textContent = `Page ${currentPage} of ${totalPages} (${available.length} available)`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
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
        const book = allBooks.find(b => b.name === name.toLowerCase() && b.status === "available");
        if (book) {
            resolve("Book is available");
        } else {
            reject("Book is not available or already borrowed");
        }
    });
}

function showConfirmModal() {
    return new Promise((resolve) => {
        modalResolve = resolve;
        modal.classList.remove("hidden");
    });
}

function hideConfirmModal() {
    modal.classList.add("hidden");
    modalResolve = null;
}

modalCancel.addEventListener("click", () => {
    if (modalResolve) {
        modalResolve(false);
        hideConfirmModal();
    }
});

modalConfirm.addEventListener("click", () => {
    if (modalResolve) {
        modalResolve(true);
        hideConfirmModal();
    }
});

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        if (modalResolve) {
            modalResolve(false);
            hideConfirmModal();
        }
    }
});

function updateStatus(name) {
    return new Promise((resolve) => {
        const book = allBooks.find(b => b.name === name.toLowerCase());
        if (book) {
            book.status = "borrowed";
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
        
        const confirmed = await showConfirmModal();
        if (!confirmed) {
            showMessage("Borrow request canceled", "error");
            return;
        }
        
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

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderBooks();
    }
}

function nextPage() {
    const available = getAvailableBooks();
    const totalPages = Math.ceil(available.length / BOOKS_PER_PAGE) || 1;
    if (currentPage < totalPages) {
        currentPage++;
        renderBooks();
    }
}

bookInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        borrowBook();
    }
});

prevBtn.addEventListener("click", prevPage);
nextBtn.addEventListener("click", nextPage);

renderBooks();