'use strict'

const passwordInput = document.querySelector("#account_password");
const toggleBtn = document.querySelector("#hide-show-btn")


toggleBtn.addEventListener("click", e => {
    e.preventDefault()
    passwordInput.setAttribute("type", passwordInput.getAttribute("type") == "password" ? "text" : "password")
    toggleBtn.textContent = passwordInput.getAttribute("type") == "password" ? "Show" : "Hide"
})