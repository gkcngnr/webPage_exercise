const form = document.querySelector(".question-form");
const result = document.querySelector(".result");
const correct = [7, 10, 3]

form.addEventListener("submit", e=>{
    e.preventDefault();
    const user = []
    const userAnsw = document.querySelectorAll(".form-check-input:checked")
    userAnsw.forEach((answer) => {
        user.push(answer.value)
    })

    total = correct.length;
    correctAns = 0;
    // for (let i=0; i<total; i++) {
    //     if (correct[i] == user[i]) {
    //     correctAns++
    // }
    // }
    
    correct.forEach((answer, index) => {
        if (answer == user[index]) {
            correctAns++
        }
    })

    result.classList.remove("d-none");
    result.querySelector("span").textContent = `${correctAns}/${total}`;

    result.querySelector("#bar").style.width = `${correctAns*100/total}%`;

    if (correctAns == 0) {
        result.querySelector("#empty").classList.remove("d-none")
        
    } else if (correctAns == total) {
        result.querySelector("#full").classList.remove("d-none")
    } 

    document.querySelector(".btn").setAttribute("disabled", "");
})