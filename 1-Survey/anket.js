
const form = document.querySelector(".question-form");
const result = document.querySelector(".result");


form.addEventListener("submit", e=> {
    e.preventDefault(); 
    const user = []
    const userAnsw = document.querySelectorAll(".form-check-input:checked")
    userAnsw.forEach((answer) => {
        user.push(answer.value)
    })
    
    let totalQuestion = document.querySelectorAll(".form-check-input").length / 2; 
    
    
    yes = 0;
    user.forEach((answer) => {
        if (answer === "e") {
            yes++
        }
    })
    score = Math.floor(yes / totalQuestion * 100)
    
    result.classList.remove("d-none");

    let points = 0;
    const stop = setInterval(() => {
        result.querySelector("span").textContent = `%${points}`;
        if (points === score) {
            clearInterval(stop);
        } else {
            points++
        }
    }, 5)
    
    result.querySelector("#bar").style.width = (score + "%")



})

    




// setTimeout(() => {
//     console.log("asd")
// }, 2000)

// setInterval(() => {            // verilen aralıklarla çalışr
//     console.log("asd")
// }, 2000)

// let i = 0;
// const bastir = setInterval(() => {            
//     console.log("asd")
//     i++;
//     if (i === 4) {
//         clearInterval(bastir)           // verilen değerde durur
//     }
// }, 2000)


