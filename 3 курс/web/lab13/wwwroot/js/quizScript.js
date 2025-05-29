"use strict"



function elementAppearAnimation(element) {
    return new Promise(async function (resolve, reject) {
        const content = element

        const opacityGoal = 1
        let opacityChange = 0

        const interval = setInterval(() => {
            opacityChange = opacityChange + 0.05

            content.style.opacity = opacityChange

            if (opacityChange >= opacityGoal) {
                content.style.opacity = opacityGoal
                resolve()
                clearInterval(interval)
            }

        }, 15)

    })
}

function elementDisappearAnimation(element) {
    return new Promise(async function (resolve, reject) {
        const content = element

        const opacityGoal = 0
        let opacityChange = 1

        const interval = setInterval(() => {
            opacityChange = opacityChange - 0.05

            content.style.opacity = opacityChange

            if (opacityChange <= opacityGoal) {
                content.style.opacity = opacityGoal

                resolve()
                clearInterval(interval)
            }

        }, 15)

    })
}

function loadInitialContent() {
    return new Promise(async function (resolve, reject) {
        const adress = "/Quiz/QuestionForm"

        const response = await fetch(adress, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
        })

        const responseHtml = await response.text()

        document.querySelector(".content").innerHTML = responseHtml;
        

        resolve()

    })
}

function loadNextContent() {
    return new Promise(async function (resolve, reject) {
        const quizForm = document.getElementById("quizForm");

        const adress = "/Quiz/QuestionProcess"

        const formData = new FormData(quizForm);
        const response = await fetch(adress, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData,
        })

        const responseHtml = await response.text()

        document.querySelector(".content").innerHTML = responseHtml;

        await resolve()
    })    

}

function handleNextBtn() {
    
    const nextBtn = document.getElementById("nextBtn")

    nextBtn.addEventListener("click", async (event) => {

        event.preventDefault()

        document.getElementById("btnPressed").value = "next"

        const content = document.getElementById("content")

        elementDisappearAnimation(content).then(() => {
            loadNextContent().then(() => {
                elementAppearAnimation(content)
            })
        })


    })
}

function handleFinishBtn() {
    const nextBtn = document.getElementById("nextBtn")
    const finishBtn = document.getElementById("finishBtn")
    const content = document.getElementById("content")
    const title = document.getElementById("title")

    finishBtn.addEventListener("click", async (event) => {

        event.preventDefault()

        document.getElementById("btnPressed").value = "finish"

        finishBtn.style.opacity = "0"
        nextBtn.style.opacity = "0"
        title.style.opacity = "0"

        elementDisappearAnimation(content).then(() => {
            finishBtn.style.display = "none"
            nextBtn.style.display = "none"
            title.style.display = "none"

            loadNextContent().then(() => {
                elementAppearAnimation(content)
            })
        })
    })
}


loadInitialContent().then(() => {
    document.getElementById("wrapper").style.opacity = "1"

    const content = document.getElementById("content")

    elementAppearAnimation(content).then(() => {
        handleNextBtn()
        handleFinishBtn()
    })
})

