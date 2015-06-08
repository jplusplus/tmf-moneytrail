
Steps for adding a translation
------------------------------

The steps to add a new translation involve editing the [working spreadsheet](https://docs.google.com/spreadsheets/d/1wC72sDmuN-mvwgMcSWhO-R3E-1wmSE19B_KiW7RBRSc)

* Determine the translation identifier using the [language]-[country/region]
  syntax, e.g. _pt-BR_. Note the hyphen, don't use underscores! For more detail, see [this
  document](http://www.i18nguy.com/unicode/language-identifiers.html).

* Add the translated titles and texts to the **Items to be visualized** sheet.
  They should occupy new columns for the title and text (2 for each new language). 
  They **must** be named using the convention
  "Title [code]" and "Text [code]", where [code] is replaced by the language
  identifier set in the step above. E.g. "Title de-DE", without brackets or
  quotation marks.

* Add the necessary fields to the **Translation extra** sheet. These are:
  * Title and subtitle for the viz ("The Migrants Files" and "The Money Trail")
  * Decimal and thousands separators; for cases where a space is used, write "space".
  * Translation for "millions", as well as its abbreviated form.
