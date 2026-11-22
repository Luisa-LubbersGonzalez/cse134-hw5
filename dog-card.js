const sampleDogs = [
    {
        src: "pictures/perla3.jpg", alt: "A picture of a black, hairy dachshund chihuahua mix named Perla. She is looking up slightly at the camera in a Target shopping cart.", caption: "Perla, 14-year-old dachshund chihuahua mix"
    }, 
    {
        src: "pictures/toby2.jpg", alt: "A picture of a white and brown dachshund chihuahua mix named Toby. He is slightly smiling while laying on a pink blanket", caption: "Toby, 11-year-old dachshund chihuahua mix"
    },
    {
        src: "pictures/dogs1.jpg", alt: "A picture of two dachshund chihuahua mixes, one black wearing a yellow dress, and another white and brown one wearing a turquoise shirt", caption:"Toby and Perla, when they were 10 years old, wearing clothes"
    },
    {
        src: "pictures/manchas.jpg", alt: "A picture of a white and brown pitbull and boxer mix, covering a dog toy with his two paws while seated.", caption: "Manchas, a 9-year-old pitbull boxer mix"
    }
];

const DOG_API_URL = "https://dog.ceo/api/breeds/image/random";

function getBreedFromURL(url) {
    const parts = url.pathname.split("/");
    const breedIndex = parts.indexOf("breeds") + 1;
    const rawBreed = parts[breedIndex];

    if (breedIndex === 0 || !rawBreed) {
        return "dog";
    }
    return rawBreed.split("-").reverse().join(" ");
}

class DogCard extends HTMLElement {
    static get observedAttributes() {
        return ["compact"];
    }
    constructor(){
        super();
        this.currentIndex = 0;
        this.isLoading = false;
        this.handleNextClick = this.handleNextClick.bind(this);
        this.handleRandomClick = this.handleRandomClick.bind(this);
    }
    connectedCallback() {
        if (!this.image) {
            this.buildInterface();
        }
        this.nextButton.addEventListener("click", this.handleNextClick);
        this.randomButton.addEventListener("click", this.handleRandomClick);
        this.showDog(this.currentIndex);
        this.updateCompact();
    }
    disconnectedCallback() {
        this.nextButton.removeEventListener("click", this.handleNextClick);
        this.randomButton.removeEventListener("click", this.handleRandomClick);
    }
    attributeChangedCallback(name) {
        if (name === "compact") {
            this.updateCompact();
        }
    }
    buildInterface() {
        const fragment = document.createDocumentFragment();
        const heading = document.createElement("h2");
        heading.textContent = "Meet My Dogs";
        fragment.appendChild(heading);
        
        this.image = document.createElement("img");
        this.image.width = 315;
        this.image.height = 472;
        fragment.appendChild(this.image);
        
        this.caption = document.createElement("p");
        this.caption.className = "dog-caption";
        fragment.appendChild(this.caption);

        const controls = document.createElement("div");
        controls.className = "dog-controls";

        this.nextButton = document.createElement("button");
        this.nextButton.type = "button";
        this.nextButton.textContent = "Show one of my dogs";
        controls.appendChild(this.nextButton);

        this.randomButton = document.createElement("button");
        this.randomButton.type = "button";
        this.randomButton.textContent = "Surprise me with a dog";
        controls.appendChild(this.randomButton);

        fragment.appendChild(controls);

        this.status = document.createElement("p");
        this.status.className = "dog-status";
        this.status.setAttribute("role", "status");
        fragment.appendChild(this.status);

        this.appendChild(fragment);
    }

    showDog(index) {
        const dog = sampleDogs[index];

        this.image.src = dog.src;
        this.image.alt = dog.alt;
        this.caption.textContent = dog.caption;

        this.status.textContent = "Dog " + (index + 1) + " of " + sampleDogs.length;
    }

    handleNextClick() {
        this.currentIndex = (this.currentIndex + 1) % sampleDogs.length;
        this.showDog(this.currentIndex);
    }
    handleRandomClick() {
        if (this.isLoading) {
            return;
        }
        this.loadRandomDog();
    }
    async loadRandomDog() {
        this.isLoading = true;
        this.setAttribute("aria-busy", "true");
        this.randomButton.textContent = "Fetching a dog picture";
        this.status.textContent = "Fetching a random dog picture";

        try {
            const response = await fetch(DOG_API_URL);
            if (!response.ok) {
                throw new Error("HTTP status " + response.status);
            }
            const data = await response.json();
            if (data?.status !== "success" || typeof data?.message !== "string") {
                throw new Error("Unexpected response from the Dog CEO API.");
            }
            const imageUrl = new URL(data.message);
            if (imageUrl.protocol !== "https:"){
                throw new Error("Image URL is not HTTPS.");
            }
            const breed = getBreedFromURL(imageUrl);
            
            this.image.src = imageUrl.href;
            this.image.alt = "A random photo of a " + breed + " from the Dog CEO API";
            this.caption.textContent = "Random dog: " + breed;

            this.status.textContent = "Random dog loaded: " + breed + ".";
        } catch (error) {
            console.error("could not load a random dog.", error);
            this.status.textContent = "Sorry, couldn't load a random dog. Check your connection and try again.";
        } finally {
            this.isLoading = false;
            this.removeAttribute("aria-busy");
            this.randomButton.textContent = "Surprise me with a dog";
        }
    }
    updateCompact() {
        if (!this.caption) {
            return;
        }
        this.caption.hidden = this.hasAttribute("compact");
    }
}

customElements.define("dog-card", DogCard);

const dogCard = document.querySelector("dog-card");
const detailsToggle = document.querySelector("#dog-details-toggle");

function updateToggleLabel() {
    if (dogCard.hasAttribute("compact")) {
        detailsToggle.textContent = "Show dog details";
    } else {
        detailsToggle.textContent = "Hide dog details";
    }
}

if (dogCard !== null && detailsToggle !== null) {
    updateToggleLabel();
    detailsToggle.hidden = false;
    detailsToggle.addEventListener("click", function() {
        dogCard.toggleAttribute("compact");
        updateToggleLabel();
    });
}