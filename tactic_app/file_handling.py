__author__ = 'bls910'
import copy
import re
import csv
import os
import xmltodict
from xml.parsers.expat import ExpatError

def read_xml_file_to_dict_list(the_file):
    raw_xml = the_file.read()
    try:
        parsed_xml = xmltodict.parse(raw_xml)
    except ExpatError as e:
        return (None, e)

    # Assume we are getting a dict of the form:
    # {"collection_name": {"some_tag": [list of dicts]}
    # We will treat each of the dicts in the list as tags.

    collection_name = parsed_xml.keys()[0]
    some_tag = parsed_xml[collection_name].keys()[0]
    list_of_dicts = parsed_xml[collection_name][some_tag]

    # Next we want to find any fields that have lists and convert them to dicts
    # I expect that any xml tag that contains a list will have an attribute _key
    # For example, <CODEDCLIP _key="CLIP">
    # that tells it which of its fields to use as a key
    # unfortunately xmltodict puts this within the dicts a level down

    new_list_of_dicts = []
    for a_dict in list_of_dicts:
        new_list_of_dicts.append(convert_lists_to_dicts(a_dict))
    return (collection_name, new_list_of_dicts)

def load_a_list(the_file):
    raw_list = the_file.readlines()
    fixed_list = []

    # the next loop is to get rid of weird characters that tend to appera
    # the second line in the loop might not be needed anymore.
    for w in raw_list:
        w  = "".join([x for x in w if (x.isalnum() or x == "\'" or x =="-")])
        fixed_list.append(re.sub(r'\s+$', '', w))
    return fixed_list

def read_csv_file_to_dict_list(csvfile):
    dialect = csv.Sniffer().sniff(csvfile.read(1024))
    csvfile.seek(0)
    try:
        reader = csv.DictReader(csvfile, dialect=dialect)
        filename, file_extension = os.path.splitext(csvfile.filename)
        new_list_of_dicts = []
        for row in reader:
            new_list_of_dicts.append(row)
    except csv.Error as e:
        return (None, e)
    return (filename, new_list_of_dicts)

def convert_lists_to_dicts(a_dict):
    new_dict = {}
    for (the_key, the_val) in a_dict.items():
        if type(the_val) == list:
            _key = the_val[0]["@_key"]
            for it in the_val:
                new_it = copy.deepcopy(it)
                del new_it["@_key"]
                new_dict[the_key + "_" + it[_key]] = convert_lists_to_dicts(new_it)
        else:
            new_dict[the_key] = the_val
    return new_dict



