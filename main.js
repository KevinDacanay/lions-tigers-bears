let timer
let deleteFirstPhotoDelay

async function start() {
    try {
        const response = await fetch("https://dog.ceo/api/breeds/list/all")
        const data = await response.json()
        createBreedList(data.message)
    } catch (error) {
        console.log("There was a problem fetching the breed list")
    }
}

start()

function createBreedList(breedList) {
    document.getElementById("breed").innerHTML =
        `
        <select onchange="loadByBreed(this.value)">
            <option>Choose a Dog breed</option>
            ${Object.keys(breedList).map(function (breed) {
                return `<option>${breed}</option>`
            }).join("")}
        </select>
        `
}

async function loadByBreed(breed) {
    if (breed !== "Choose a Dog breed") {
        try {
            const response = await fetch(`https://dog.ceo/api/breed/${breed}/images`)
            const data = await response.json()
            createSlideshow(data.message)
        } catch (error) {
            console.log("There was a problem fetching the breed images")
        }
    }
}

function createSlideshow(data) {
    let currentPos = 0
    clearInterval(timer)
    clearTimeout(deleteFirstPhotoDelay)

    if (data.length > 1) {
        document.getElementById("slideshow").innerHTML =
            `
            <div class="slide" style="background-image: url('${data[0]}')"></div>
            <div class="slide" style="background-image: url('${data[1]}')"></div>
            `

        currentPos = 2
        if (data.length === 2) currentPos = 0

        timer = setInterval(nextSlide, 3000)
    } else if (data.length === 1) {
        document.getElementById("slideshow").innerHTML =
            `
            <div class="slide" style="background-image: url('${data[0]}')"></div>
            <div class="slide"></div>
            `
    }

    function nextSlide() {
        document.getElementById("slideshow").insertAdjacentHTML(
            "beforeend",
            `<div class="slide" style="background-image: url('${data[currentPos]}')"></div>`
        )

        deleteFirstPhotoDelay = setTimeout(function () {
            const firstSlide = document.querySelector(".slide")
            if (firstSlide) {
                firstSlide.remove()
            }
        }, 3000)

        if (currentPos + 1 >= data.length) {
            currentPos = 0
        } else {
            currentPos++
        }
    }
}
