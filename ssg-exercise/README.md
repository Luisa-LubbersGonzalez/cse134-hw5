I built my Home and Travel page with Eleventy (index.html & my-travels.html). I had both pages use a shared footer, like the HW writeup suggested. It is located in '_includes/footer.html'. Below are the instructions on how to install the dependencies

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