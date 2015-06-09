#!/usr/bin/env python
# -*- coding: utf-8
'''
Convert the Migrants Files data from the Google Sheet CSV export to JSON structured for
our viz.
'''

import csv
import json
import urllib2

VIZ_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1wC72sDmuN-mvwgMcSWhO-R3E-1wmSE19B_KiW7RBRSc/export?format=csv&gid=397042903"
TRANSLATION_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1wC72sDmuN-mvwgMcSWhO-R3E-1wmSE19B_KiW7RBRSc/export?format=csv&gid=1180374955"


def fetch_viz_data():
    response = urllib2.urlopen(VIZ_SHEET_CSV_URL)
    data = csv.DictReader(response)
    return data


def fetch_translation_data():
    response = urllib2.urlopen(TRANSLATION_SHEET_CSV_URL)
    data = csv.DictReader(response)
    return data


def get_object_from_id(l, id):
    for row in l['children']:
        if row['id'] == id:
            return row
    return None


def replace_field_name(row, name, newname):
    if row.get(name) is not None:
        row[newname] = row[name]
        del row[name]
    return row


def parse_row(row, outdata, lang="en-US"):
    # amounts should be int
    row['amount'] = int(row['amount'].replace(",", ""))

    fields_to_remove = []
    if lang == "en-US":
        # remove all other languages
        for field in row:
            if field.startswith(("title-", "text-")):
                fields_to_remove.append(field)
    else:
        # remove all other languages
        for field in row:
            if field in ("title", "text") or (field.startswith(("title-", "text-")) and field not in ("title-" + lang, "text-" + lang)):
                fields_to_remove.append(field)
    for field in fields_to_remove:
        del row[field]

    if not lang == "en-US":
        # convert field names to remove lang suffix
        replace_field_name(row, "title-" + lang, "title")
        replace_field_name(row, "text-" + lang, "text")

    if not row.get('parent'):
        # this is a node
        outdata['children'].append(row)
    else:
        # this is a subnode
        parent_row = get_object_from_id(outdata, row['parent'])
        if not parent_row.get('subnodes'):
            parent_row['subnodes'] = [row]
        else:
            parent_row['subnodes'].append(row)


def generate_json_files(langs=("en-US",)):
    for lang in langs:
        outdata = {}
        outdata['title'] = 'root'
        outdata['children'] = []

        # populate JSON with objects
        viz_data = fetch_viz_data()
        for row in viz_data:
            parse_row(row, outdata, lang)

        # add the i18n details (decimal separators, etc)
        trans_data = fetch_translation_data()
        relevant_row = [r for r in trans_data if r['lang'] == lang][0]
        i18n_info = {}
        i18n_info['title'] = relevant_row['title']
        i18n_info['subtitle'] = relevant_row['subtitle']
        i18n_info['thousands_separator'] = relevant_row['thousands_separator']
        if i18n_info['thousands_separator'] == "space":
            i18n_info['thousands_separator'] = " "

        i18n_info['decimal_separator'] = relevant_row['decimal_separator']
        i18n_info['millions'] = relevant_row['millions']
        i18n_info['millions_abbrev'] = relevant_row['millions_abbrev']
        outdata['i18n'] = i18n_info

        import codecs
        if lang == "en-US":
            f = codecs.open("data.json", "w", "utf-8")
        else:
            f = codecs.open("data-%s.json" % lang, "w", "utf-8")
        f.write(json.dumps(outdata, indent=2))
        f.close()


def detect_langs(viz_data, trans_data):
    langs = ["en-US"]
    # See which langs are in the viz data
    text_langs = [l.replace("text-", "") for l in viz_data.next().keys() if l.startswith("text-")]
    title_langs = [l.replace("title-", "") for l in viz_data.next().keys() if l.startswith("title-")]
    if not text_langs == title_langs:
        orphan_langs = [l for l in text_langs if l not in title_langs]
        raise ValueError("Please double-check that all languages have a title and text field! (offending languages: %s)" % " ".join(orphan_langs))
    viz_langs = title_langs
    # And cross-reference with the translation data
    trans_langs = [r['lang'] for r in trans_data]
    # en-US is in by default
    trans_langs.remove("en-US")
    if not viz_langs == trans_langs:
        orphan_langs = [l for l in viz_langs if l not in trans_langs]
        raise ValueError("Please double-check that all languages are specified in the Translation Extra sheet! (offending languages: %s)" % " ".join(orphan_langs))
    langs.extend(viz_langs)
    return langs

# First, fetch the most recent data
viz_data = fetch_viz_data()
trans_data = fetch_translation_data()

# Detect the existing languages
langs = detect_langs(viz_data, trans_data)
print langs

generate_json_files(langs)
