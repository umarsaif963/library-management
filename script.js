const out = document.getElementById("output");

let books = [
    { name: "physics", status: "available" },
    { name: "computer", status: "available" },
    { name: "math", status: "available" },
    { name: "science", status: "available" },
];

function checkAvailabilty(name) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < books.length; i++) {
            if (books[i].name === name && books[i].status == "available") {
                resolve("Book is available");
                return;
            }
        }
        reject("Book is not available");
    });
}

function borrowBook(wantbook){
    return new Promise((resolve, reject) => {
        if(wantbook.toLowerCase() === "yes"){
            resolve("You have successfully borrowed this book");
        }
        else{
            reject("Borrow request canceled");
        }
    });
}

function updateStatus(name) {
    return new Promise((resolve) => {
        for (let i = 0; i < books.length; i++) {
            if (books[i].name === name) {
                books[i].status = "Borrowed";
                resolve("Book status updated to Borrowed");
                return;
            }
        }
    });
}

function borrowProcess(book_Name) {
    return checkAvailabilty(book_Name)
        .then((msg) => {
            out.innerHTML += msg +"<br>";
            const want = prompt("Book is available.\nDo you want to borrow this book? (yes/no)");
            return borrowBook(want);
        })
        .then((msg) => {
            out.innerHTML += msg +"<br>";
            return updateStatus(book_Name);
        })
        .then((msg)=>{
            out.innerHTML += msg +"<br>";
            return msg;
        })
        .catch(err=> out.innerHTML += err +"<br>");
}

function ok() {
    const book = document.getElementById("input").value;
    borrowProcess(book);
}
