const signInLink = document.querySelector('.signinLink');
const signUpLink = document.querySelector('.signupLink');

const wrapper = document.querySelector('.wrapper');

console.log(wrapper)

signUpLink.addEventListener('click', () => {
    wrapper.classList.toggle('active');
});

signInLink.addEventListener('click', () => {
    wrapper.classList.toggle('active');
});