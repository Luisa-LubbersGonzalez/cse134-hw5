## Path to SSG Exercise Folder

Folder: ssg-exercise/
Pages: index.html (home page) & my-travels.html

I chose to have both pages share a footer, which can be found at ssg-exercise/_includes/footer.html

## Install dependencies
```
cd ssg-exercise
npm install
```

## Build the exercise
```
npx @11ty/eleventy
```
Any pages that are genereated should now be in the '_site/' folder.

## Preview Locally
```
npx @11ty/eleventy --serve
```
Home/Index page should be located at http://localhost:8080/
My Travels page should be located at http://localhost.8080/my-travels.html

When editing '_includes/footer.html', with the session still live, the saved edits should appear on the two pages automatically or with a refresh. 

## Design Note
Someone on my About Me page wants to get to know me a little. My dogs are a big part of my life, so the `<dog-card>` component lets
them look through photos of my own dogs, or see a random dog for fun. If they
just want the pictures, the "Hide dog details" button switches to a compact view,
and the site remembers that choice the next time they visit.

One action traced: 
1. **Control:** The visitor clicks the "Surprise me with a dog" button inside `<dog-card>`.
2. **Handler:** `handleRandomClick()` runs. If a request is already loading, it
   stops so the visitor can't start a second request by double-clicking. Otherwise it calls `loadRandomDog()`.
3. **API request:** `loadRandomDog()` sends a GET request with `fetch()` to
   `https://dog.ceo/api/breeds/image/random`.
4. **Checking the response:** The code checks `response.ok`, reads the JSON, and
   makes sure `status` is `"success"` and `message` is a string. It also checks that
   the image URL uses HTTPS. The breed name is taken from the image URL path.
5. **DOM update:** The component changes the `<img>` `src` and `alt`, sets the
   caption to "Random dog: [breed]", and updates the status line. All text is set
   with `textContent`, not `innerHTML`.

While they wait, the button text changes to "Fetching a dog picture", the status
line says "Fetching a random dog picture", and the card gets `aria-busy="true"`. The
status line is a `role="status"` live region, so screen readers announce it.

When successful, the new dog photo appears with a caption naming the breed, and the
status says "Random dog loaded: [breed]."

If it fails, the photo that was already showing stays on the card, and the status says "Sorry, couldn't load a random dog. Check your connection and try again." The
button goes back to normal so the visitor can try again. The "Show one of my dogs"
button still works because those photos are stored on my site, not loaded from the API.