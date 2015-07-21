__author__ = 'bls910'
import copy
import xmltodict
from tactic_app import db

def convert_multi_doc_file_to_dict_list(the_file):
    raw_xml = the_file.read()
    parsed_xml = xmltodict.parse(raw_xml)

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



