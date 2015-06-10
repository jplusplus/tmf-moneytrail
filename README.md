In this document, you'll find how to locally install the visualization, as well as generate translations, deploy the site and other details.

  - [Installation](#installation)
  - [Running a local web server](#running-a-local-web-server)
  - [Integrating translations](#integrating-translations)
  - [Generating static SVG versions](#generating-static-svg-versions)
  - [Pushing the site to the live server](#pushing-the-site-to-the-live-server)
  - [Showing the site in different languages](#showing-the-site-in-different-languages)
  - [Adding a new translation](#adding-a-new-translation)


## Installation

After cloning the repository and `cd`ing to it, run

    make install

## Running a local web server

Simple:

    make run

## Integrating translations

Running

    make build

will pull the latest version of the shared Google Sheet and integrate all the translations available. This conversion script doesn't require any dependencies. In case you run into an error, please [file an issue](https://github.com/jplusplus/tmf-moneytrail/issues/new) and we'll head in to fix things.

## Generating static SVG versions

TODO

## Pushing the site to the live server

In order to deploy the site to GitHub Pages, do

    make deploy

## Showing the site in different languages

Adding the `lang` parameter will set the language to use.

For example, the Swedish version is accessible through http://jplusplus.github.io/tmf-moneytrail?lang=sv-SE .

## Adding a new translation

See the [TRANSLATING.md](https://github.com/jplusplus/tmf-moneytrail/blob/master/TRANSLATING.md) file for the steps needed for adding another language.