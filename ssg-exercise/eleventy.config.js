module.exports = function (eleventyConfig) {
    // Copy non-page files into the built site unchanged
    eleventyConfig.addPassthroughCopy("style.css");
    eleventyConfig.addPassthroughCopy("theme.js");
    eleventyConfig.addPassthroughCopy("pictures");

    // Don't build the README into a page
    eleventyConfig.ignores.add("README.md");
};