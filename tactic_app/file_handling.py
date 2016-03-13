__author__ = 'bls910'
import copy
import re
import csv
import os
import sys
import xmltodict
from xml.parsers.expat import ExpatError

def read_xml_file_to_dict(the_file):
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

def make_fieldnames_unique(flist):
    new_list = []
    for fname in flist:
        counter = 1
        if fname in new_list:
            while fname + str(counter) in new_list:
                counter += 1
            fname = fname + str(counter)
        new_list.append(fname)
    return new_list

def read_csv_file_to_dict(csvfile):
    csvfile.seek(0)
    i = 0
    try:
        reader = csv.reader(csvfile)
        header_list = reader.next()
        header_list = make_fieldnames_unique(header_list)
        reader = csv.DictReader(csvfile, dialect="excel", fieldnames=header_list)
        filename, file_extension = os.path.splitext(csvfile.filename)
        result_dict = {}
        for row in reader:
            for (key, val) in row.items():
                row[key] = utf_solver(val)
            row["__filename__"] = filename
            row["__id__"] = i
            result_dict[str(i)] = row
            i += 1
        csvfile.seek(0)
        header_list = ["__id__", "__filename__"] + header_list

    except csv.Error as e:
        return (None, e, None)
    return (filename, result_dict, header_list)

def read_tsv_file_to_dict(tsvfile):
    tsvfile.seek(0)
    i = 0
    try:
        header_list = tsvfile.readline().rstrip().split("\t")
        header_list = make_fieldnames_unique(header_list)
        filename, file_extension = os.path.splitext(tsvfile.filename)
        result_dict = {}
        for line in tsvfile:
            row = {}
            for col, val in enumerate(line.rstrip().split("\t")):
                row[header_list[col]] = utf_solver(val)
            row["__filename__"] = filename
            row["__id__"] = i
            result_dict[str(i)] = row
            i += 1
        tsvfile.seek(0)
        header_list = ["__id__", "__filename__"] + header_list

    except csv.Error as e:
        return (None, e, None)
    return (filename, result_dict, header_list)

def utf_solver(txt):
    return txt.decode("utf-8", 'ignore').encode("ascii", "ignore")

def read_txt_file_to_dict(txtfile):
    try:
        filename, file_extension = os.path.splitext(txtfile.filename)
        lines = txtfile.readlines()
        result_dict = {}
        i = 0
        for l in lines:
            result_dict[str(i)] = {"__id__": i, "__filename__": filename, "text": utf_solver(l)}
            i = i + 1

        header_list = ["__id__", "__filename__", "text"]
    except:
        ermsg = "Error reading text file " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return (None, {"message": ermsg}, None)
    return (filename, result_dict, header_list)

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



