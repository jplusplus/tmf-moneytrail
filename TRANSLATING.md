
Steps for adding a translation
------------------------------

The steps to add a new translation involve editing the [working spreadsheet]()

* Determine the translation identifier using the <language>-<country/region>
  syntax, e.g. _pt-BR_. For more detail, see [this
  document](http://www.i18nguy.com/unicode/language-identifiers.html).

* Add the translated titles and texts to the _Items to be visualized_ sheet.
  They should occupy new columns, which **must** be named using the convention
  "Title [code]" and "Text [code]", where [code] is replaced by the language
  identifier set in the step above. E.g. "Title de-DE", without brackets or
  quotation marks.

* Add the necessary fields to the _Translations_ sheet. These are:
  * Decimal and thousands separators; for cases where a space is used, write "space".
  * Translation for "millions", as well as its abbreviated form.
