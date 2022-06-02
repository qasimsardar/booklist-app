//Book Class: Represents a Book
class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI Class: Handles the UI tasks

class UI{
    static displayBooks(){

        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book){
        const list = document.getElementById('book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');

        container.insertBefore(div, form);

        // Vanish in 3 sec
        setTimeout(() => document.querySelector('.alert').remove(), 3000)
    }

    static clearFields(){
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }

    static deleteBook(el){
        if (el.classList.contains('delete')){
            el.parentElement.parentElement.remove();

            //Remove from storage
            UI.removeBooks(el.parentElement.previousElementSibling.textContent)

            //Show success message
            UI.showAlert('Book Removed', 'success')
        }
    }

}

//Store Class: Handles Storage

class Store{
    static getBooks(){
        let books;
        if (localStorage.getItem('books') === null){
            books = [];
        }
        else{
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }
    static addBooks(book){
        const books = Store.getBooks();
        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBooks(isbn){
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Event: Display Books

document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Add a Book
document.getElementById('book-form').addEventListener('submit', (e) => {

    //prevent actual submit
    e.preventDefault();

    //Get form values
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;

    //validate
    if (title === '' || author === '' || isbn === ''){
        UI.showAlert('Please fill in all fields', 'danger')
    }
    else{
        //Instantiate book
        const book = new Book(title, author, isbn);

        //Add book to UI
        UI.addBookToList(book);

        //Add book to store
        Store.addBooks(book);

        //Show success message
        UI.showAlert('Book Added', 'success')

        //Clear Fields
        UI.clearFields();
    }

    
});


//Event: Remove a Book

document.getElementById('book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target);
});