"use strict"

function emptyFieldValidation() {
    const firstValue = document.getElementById("firstValue").value
    const secondValue = document.getElementById("secondValue").value

    if (firstValue === "" || secondValue === "") {
        return false
    } else {
        return true
    }
}

function divByZeroValidation() {
    const mathOperSignPopup = document.getElementById("mathOperSign")
    const selectedSign = mathOperSignPopup.value
    if (selectedSign === "div") {

        const secondValue = document.getElementById("secondValue").value
        if (secondValue === "0") {
            return false
        } else {
            return true
        }

    } else {
        return true
    }
}


document.getElementById('calcForm').addEventListener('submit', (event) => {
    event.preventDefault()
});

const calcForm = document.getElementById("calcForm");
const calcBtn = document.getElementById("calcBtn")

calcBtn.addEventListener("click", async () => {

    if (divByZeroValidation() && emptyFieldValidation()) {


        const targetController = document.getElementById("targetController")
        const adress = "/Calc/" + targetController.value

        const formData = new FormData(calcForm);
        const response = await fetch(adress, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData,
        })

        const result = await response.text()

        document.querySelector(".resContainer_res").innerHTML = result;
    }


})















