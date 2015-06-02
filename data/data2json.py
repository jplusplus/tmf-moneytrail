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
        if row['id'] == id:
            return row
    return None


def replace_field_name(row, name, newname):
    if row.get(name) is not None:
        row[newname] = row[name]
        del row[name]
    return row


for row in data:
    # change col names
    replace_field_name(row, "Title", "title")
    replace_field_name(row, "Text", "text")
    replace_field_name(row, "ID", "id")
    replace_field_name(row, "Amount", "amount")
    replace_field_name(row, "Parent", "parent")
    replace_field_name(row, "Tags", "tags")
    # turn tags into a list
    if row.get('tags'):
        row['tags'] = [t.strip() for t in row['tags'].split(',')]
        for tag in row['tags']:
            all_tags.append(tag)
    # amounts should be int
    row['amount'] = int(row['amount'])
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
