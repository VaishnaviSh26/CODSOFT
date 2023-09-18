const entry = document.getElementById('entry')
const form = document.getElementById('form')
const ul = document.getElementById('todo-list')
const alertP = document.querySelector('.alert')

const clearBtn = document.querySelector('.clear-btn')
const submitBtn = document.querySelector('.submit-btn')
const cancelBtn = document.querySelector('.cancel-btn')

let editFlag = false
let editElement;
let editID;

// Local Storage
// let items = []
let LSkey = 'items';


form.addEventListener('submit', addItem)
clearBtn.addEventListener('click', clearItems)
cancelBtn.addEventListener('click', setBackToDefault);

//load our LS with the window global object
window.addEventListener('DOMContentLoaded', setupItems)

function addItem(e) {
    e.preventDefault()
    let val = entry.value
    let id = new Date().getTime().toString()

    if (val && !editFlag) {
        createLIS(val, id)
        displayAlert('A new item has been added!', 'alert-success')
        clearBtn.classList.remove('d-none')

        // Local Storage
        addToLS(val, id)
    } 
    else if(val && editFlag){
        editElement.innerText = val
        displayAlert("value changed", "alert-success");
        //Local Storage
        editLS(val, editID)
        setBackToDefault()
    }
    else {
        displayAlert('Please type something!', 'alert-danger')
    }

    entry.value = null
}

function createLIS(val,id) {
    const li = document.createElement('li')
    li.className = 'list-item';
    li.setAttribute('data-id',id)
    li.innerHTML = `
    <p class="text">${val}</p>
    <i class="bx bxs-edit bx-sm"></i>
    <i class="bx bx-check bx-sm"></i>
    <i class="bx bxs-trash bx-sm"></i>`;

    li.querySelector('.bx.bxs-edit').addEventListener('click', editItem)
    li.querySelector('.bx.bx-check').addEventListener('click', checkItem)
    li.querySelector('.bx.bxs-trash').addEventListener('click', deleteItem)

    ul.append(li)
}

function editItem() {
    console.log('edit')

    editFlag =true

    console.log(this.previousElementSibling)

    editID = this.parentElement.dataset.id

    let pText = this.previousElementSibling
    editElement = pText

    entry.value = this.previousElementSibling.innerText

    submitBtn.innerText = 'Edit'
    cancelBtn.classList.remove('d-none')
    ul.querySelectorAll('.bx').forEach(i => {
        i.classList.add('v-none')
    })
    clearBtn.classList.add('d-none')
}
function checkItem() {
    console.log('check')
    console.log(this)
    console.log(this.parentElement)
    this.parentElement.classList.toggle('liChecked')
}
function deleteItem() {
    console.log('delete')
    //Local Storage Id
    let id = this.parentElement.dataset.id

    ul.removeChild(this.parentElement)
    displayAlert('one item was removed!', 'alert-danger')
    if (ul.children.length === 0) {
        clearBtn.classList.add('d-none')
    }

    removeFromLS(id)
}

function displayAlert(msg, styles) {
    alertP.innerText = msg;
    alertP.classList.add(styles)
    setTimeout(() => {
        alertP.innerText = '';
        alertP.classList.remove(styles)
    }, 1500);
}

function clearItems() {
    ul.innerHTML = null
    displayAlert('All items were removed!', 'alert-danger')
    clearBtn.classList.add('d-none')

    // Local Storage
    localStorage.clear()
}

function setBackToDefault() {
    editFlag = false;
    editElement = undefined

    entry.value = null
    submitBtn.innerText = 'Submit'
    cancelBtn.classList.add('d-none')
    ul.querySelectorAll('.bx').forEach(i => {
        i.classList.add('v-none')
    })
    clearBtn.classList.add('d-none')
}

// Local Storage
function addToLS(val,id) {
    let obj = {id, val}
    let items = getLS()
    items.push(obj)
    localStorage.setItem(LSkey, JSON.stringify(items))
}

function getLS() {
    return localStorage.getItem(LSkey) ?
    JSON.parse(localStorage.getItem(LSkey)) :
    []
}

function removeFromLS(id) {
    let items = getLS()
    items=items.filter(item => item.id !== id)
    //update Local Storage
    localStorage.setItem(LSkey, JSON.stringify(items))
    //if
    if(items.length === 0){
        localStorage.removeItem(LSkey)
    }
}

function editLS(val, editID){
    let items = getLS()
    items=items.map(item => {
        if(item.id==editID) item.val = val
        return item
    })
    //update Local Storage
    localStorage.setItem(LSkey, JSON.stringify(items))

}

function setupItems() {
    console.log(localStorage.getItem(LSkey))
    let items = getLS()
    if(items.length > 0){
    items.forEach(item => {
        const {id, val} = item
        console.log(val)
        createLIS(val)
    })
    clearBtn.classList.remove('d-none')
}
}