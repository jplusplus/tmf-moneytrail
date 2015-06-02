#!/usr/bin/env python
# -*- coding: utf-8
'''
Convert the Migrants Files data from the Google Sheet CSV export to JSON structured for
our viz.
'''

import csv
import json

data = csv.DictReader(open("data-initial.csv"))

outdata = {}
outdata['title'] = 'root'
outdata['children'] = []

all_tags = []


def get_object_from_id(l, id):
    for row in l['children']:
        if row['ID'] == id:
            return row
    return None

for row in data:
    if not row['Parent']:
        # don't include the parent_id row
        del row['Parent']
        # change col names
        row['title'] = row['Title']
        del row['Title']
        row['text'] = row['Text']
        del row['Text']
        # make amount into a proper int
        row['amount'] = int(row['Amount'])
        # turn tags into a list
        tags = row['Tags']
        del row['Tags']
        row['tags'] = [t.strip() for t in tags.split(',')]
        for tag in row['tags']:
            all_tags.append(tag)
        outdata['children'].append(row)
    else:
        parent_row = get_object_from_id(outdata, row['Parent'])
        if not parent_row.get('subnodes'):
            parent_row['subnodes'] = [row]
        else:
            parent_row['subnodes'].append(row)

import codecs
f = codecs.open("data.json", "w", "utf-8")
f.write(json.dumps(outdata))
f.close()

# remove duplicate tags
all_tags = list(set(all_tags))
tagdict = {"tags": all_tags}
tf = open("tags.json", "w")
tf.write(json.dumps(tagdict))
tf.close()
