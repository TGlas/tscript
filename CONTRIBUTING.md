# Getting started

1. `git clone git@github.com:TGlas/tscript.git`
2. install nodejs and npm
3. run `npm ci`

-   To build run `npm run build`
-   To run the unittest `npm test`
-   To watch for changes and compile run `npm run dev`

# Using prettier

This project uses [Prettier](https://prettier.io/) for code formatting. Many editors have plugins for Prettier (listed under "Editor Support"), which ensure that the editor automatically applies the correct style when reformatting files. If you need to do so manually, there are two commands that can help you:

-   `npm run test:fmt` checks that the project is properly formatted
-   `npm run prettier` reformats the project

If the `check-format` check fails on your pull request, it's most likely enough to run `npm run prettier` and commit the changes.

If there's something that Prettier complains about that you _absolutely_ need to be formatted in a specific way, you can use `prettier-ignore` comments to tell prettier to ignore a part of a file ([see documentation](https://prettier.io/docs/en/ignore.html)).
