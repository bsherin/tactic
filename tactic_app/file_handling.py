import copy
import re
import csv
import os
import sys
import xmltodict
import chardet
import openpyxl
from xml.parsers.expat import ExpatError


def read_xml_file_to_dict(the_file):
    raw_xml = the_file.read()
    try:
        parsed_xml = xmltodict.parse(raw_xml)
    except ExpatError as e:
        return None, e

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
    return collection_name, new_list_of_dicts


def load_a_list(the_file):
    raw_list = the_file.readlines()
    fixed_list = []

    # the next loop is to get rid of weird characters that tend to appera
    # the second line in the loop might not be needed anymore.
    for w in raw_list:
        w = "".join([x for x in w if (x.isalnum() or x == "\'" or x == "-")])
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


def add_standard_fields(header_list):
    standard_fields = ["__id__", "__filename__"]
    new_list = copy.copy(header_list)
    for skey in standard_fields:
        if skey in new_list:
            new_list.remove(skey)
    new_list = standard_fields + new_list
    return new_list


def read_table_file_to_dict(tsvfile, separator):
    tsvfile.seek(0)
    i = 0
    try:
        raw_text = tsvfile.read()
        encoding = chardet.detect(raw_text[:100000])["encoding"]
        raw_lines = raw_text.splitlines()
        header_list = raw_lines[0].rstrip().split(separator)
        header_list = [utf_solver(header) for header in header_list]
        header_list = make_fieldnames_unique(header_list)
        filename, file_extension = os.path.splitext(tsvfile.filename)
        result_dict = {}
        decoding_problems = []
        for line in csv.reader(raw_lines[1:], delimiter=separator):
            row = {}
            for col, val in enumerate(line):
                try:
                    row[header_list[col]] = val.decode(encoding)
                except UnicodeDecodeError:
                    decoding_problems.append(str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1]))
                    row[header_list[col]] = val.decode(encoding, "ignore")
            row["__filename__"] = filename
            row["__id__"] = i
            result_dict[str(i)] = row
            i += 1
        tsvfile.seek(0)
        header_list = add_standard_fields(header_list)
    except :
        ermsg = "Error reading text file " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return None, {"message": ermsg}, None, None
    return filename, result_dict, header_list, encoding, decoding_problems


# Field names in mongo cannot contain dots or null characters, and they must not start with a dollar sign
def make_keys_mongo_valid(key_list):
    return [re.sub("\.", "_", k) for k in key_list]


def read_excel_file(xlfile):
    xlfile.seek(0)
    try:
        filename, file_extension = os.path.splitext(xlfile.filename)
        wb = openpyxl.reader.excel.load_workbook(xlfile)
        sheet_names = wb.get_sheet_names()
        doc_dict = {}
        header_dict = {}

        for sname in sheet_names:
            sheet_dict = {}
            ws = wb.get_sheet_by_name(sname)
            allrows = tuple(ws.rows)
            header_row = allrows[0]
            header_list = []
            for c in header_row:
                if c.value is None:
                    header_list.append("None")
                elif not c.data_type == c.TYPE_STRING:
                    header_list.append(str(c.value))
                else:
                    header_list.append(utf_solver(c.value))
            header_list = make_fieldnames_unique(header_list)
            header_list = make_keys_mongo_valid(header_list)
            i = 0
            for line in allrows[1:]:
                row = {}
                for col, c in enumerate(line):
                    the_val = c.value
                    if not c.data_type == c.TYPE_STRING:
                        the_val = str(the_val)
                    row[header_list[col]] = the_val
                    row["__filename__"] = filename
                    row["__id__"] = i
                    sheet_dict[str(i)] = row
                i += 1
            doc_dict[sname] = sheet_dict
            header_list = add_standard_fields(header_list)
            header_dict[sname] = header_list
    except:
        ermsg = "Error reading excel file " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return None, {"message": ermsg}, None
    return filename, doc_dict, header_dict


def read_csv_file_to_dict(csvfile):
    return read_table_file_to_dict(csvfile, ",")


def read_tsv_file_to_dict(tsvfile):
    return read_table_file_to_dict(tsvfile, "\t")


def utf_solver(txt):
    return txt.decode("utf-8", 'ignore').encode("ascii", "ignore")


def read_txt_file_to_dict(txtfile):
    decoding_problems = []
    try:
        filename, file_extension = os.path.splitext(txtfile.filename)
        raw_text = txtfile.read()
        detected = chardet.detect(raw_text[:100000])
        try:
            decoded_text = raw_text.decode(detected["encoding"])
        except UnicodeDecodeError:
            decoding_problems.append(str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1]))
            decoded_text = raw_text.decode(detected["encoding"], "ignore")

        lines = decoded_text.splitlines()
        result_dict = {}
        i = 0
        for l in lines:
            result_dict[str(i)] = {"__id__": i, "__filename__": filename, "text": l}
            i = i + 1

        header_list = ["__id__", "__filename__", "text"]
    except:
        ermsg = "Error reading text file " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return None, {"message": ermsg}, None, None
    return filename, result_dict, header_list, detected["encoding"], decoding_problems


def read_freeform_file(txtfile):
    try:
        filename, file_extension = os.path.splitext(txtfile.filename)
        raw_text = txtfile.read()
        detected = chardet.detect(raw_text[:100000])
        decoding_problems = []
        try:
            decoded_text = raw_text.decode(detected["encoding"])
        except UnicodeDecodeError:
            decoding_problems.append(str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1]))
            decoded_text = raw_text.decode(detected["encoding"], "ignore")
    except:
        ermsg = "Error reading text file " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return None, {"message": ermsg}
    return filename, decoded_text, detected["encoding"], decoding_problems


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
