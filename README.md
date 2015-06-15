In this document, you'll find how to locally install the visualization, as well as generate translations, deploy the site and other details.

  - [Installation](#installation)
  - [Running a local web server](#running-a-local-web-server)
  - [Integrating translations](#integrating-translations)
  - [Generating static SVG versions](#generating-static-svg-versions)
  - [Pushing the site to the live server](#pushing-the-site-to-the-live-server)
  - [Showing the site in different languages](#showing-the-site-in-different-languages)
  - [Adding a new translation](#adding-a-new-translation)
  - [Iframe embed](#iframe-embed)


## Installation

After cloning the repository and `cd`ing to it, run

    make install

## Running a local web server

Simple:

    make run

## Integrating translations

Running

    make build

will pull the latest version of the shared Google Sheet and integrate all the translations available. This conversion script doesn't require any dependencies. 

After building, check if there were changes to the repo (with `git status`). If there are, commit them and deploy the changes (using `make deploy`, see below).

In case you run into an error, please [file an issue](https://github.com/jplusplus/tmf-moneytrail/issues/new) and we'll head in to fix things.

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

##Iframe embed

To embed the app in an iframe add the following code in the parent page.

In the body of the HTML, where you want the iframe to appear, add this div

    <div id="mf-moneytrail"></div>


At the bottom of the HTML, just before closing the `</body>` add a link to [pym.js](http://blog.apps.npr.org/pym.js/dist/pym.min.js)

    <script src="js/pym.min.js"></script>

Below pym.js add the following

        <script>
            var pymParent = new pym.Parent('mf-moneytrail', 'http://jplusplus.github.io/tmf-moneytrail/index.html', {});
        </script>

