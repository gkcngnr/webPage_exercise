const addNew = document.querySelector(".newDos");
const dos = document.querySelector(".dos");
const find = document.querySelector(".search input")

function generateNew(newDo) {
    dos.innerHTML += 
    `
    <li class="list-group-item d-flex justify-content-between align-items-center">
        <span class="todos">${newDo}</span>
        <i class="fa-solid fa-trash-can del"></i>
    </li>
    `;
}

const trynew = () => {
    const newDo = addNew.add.value.trim();  //öndeki sondaki boşlukları siler. trimEnd ve trimStart da var
    
    if (user.includes(newDo.toLowerCase()) ) {
        document.querySelector(".exist").classList.remove("d-none");
        
        var blink = document.querySelector('.blink');
        
        setInterval(function() {
            blink.style.opacity = (blink.style.opacity == 0.6 ? 1 : 0.6);
        }, 500);
    } else if (newDo.length) {
        generateNew(newDo)
        user.push(newDo)
        document.querySelector(".exist").classList.add("d-none");
        //const asd = document.getElementsByName("add")[0].value = ""
        addNew.reset();
    } 
}

const user = []
const spanValue = document.querySelectorAll(".todos")
spanValue.forEach((doo) => {
    user.push(doo.innerText.toLowerCase())
})

    
addNew.addEventListener('submit', e=> {
    e.preventDefault();
    trynew();
});

document.querySelector(".new").addEventListener("click", e=> {
    trynew();
})

dos.addEventListener("click", e=> {
    if (e.target.classList.contains("del")) {
        e.target.parentElement.remove();
    }
})


const filterToDo = (term) => {
    //console.log(dos.children)                 HTML Collection (forEach dönmez)
    //console.log(Array.from(dos.children))     HTML Collection u array yapar
    Array.from(dos.children)
    .filter(todo => !todo.textContent.toLowerCase().includes(term)) // ! ile içermiyorsa yaptık
    .forEach(todo => todo.classList.add("filtered"))

    Array.from(dos.children)
    .filter(todo => todo.textContent.toLowerCase().includes(term)) 
    .forEach(todo => todo.classList.remove("filtered"))
}

find.addEventListener("keyup", () => {
    
    const term = find.value.trim().toLowerCase();       // find tanımlarken input seçtiğimiz için direk value dedik
    filterToDo(term);

})
