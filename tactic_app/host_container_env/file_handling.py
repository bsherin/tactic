import copy
import re
import csv
import os
import sys
import xmltodict
import chardet
import openpyxl
from xml.parsers.expat import ExpatError
from exception_mixin import generic_exception_handler


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


def load_a_list(raw_text):
    raw_list = raw_text.splitlines()
    fixed_list = []

    # the next loop is to get rid of weird characters that tend to appera
    # all of it is commented out at this point. doesn't seem to be necessary any longer
    for w in raw_list:
        # w = "".join([x for x in w if (x.isalnum() or x == "\'" or x == "-")])
        # fixed_list.append(re.sub(r'\s+$', '', w))
        fixed_list.append(w)
    return fixed_list


def make_fieldnames_unique(flist):
    new_list = []
    standard_fields = ["__id__", "__filename__"]
    for fname in flist:
        if len(fname) == 0:
            fname = "column"
        counter = 1
        if fname in new_list and fname not in standard_fields:
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


def read_table_file_to_list(tsvfile, csv_options=None):
    tsvfile.seek(0)
    standard_fields = ["__id__", "__filename__"]

    try:
        raw_text = tsvfile.read()
        encoding = chardet.detect(raw_text[:100000])["encoding"]
        raw_lines = raw_text.splitlines()
        decoded_lines = []
        decoding_problems = []
        for k, raw_line in enumerate(raw_lines[1:]):
            try:
                decoded_line = raw_line.decode(encoding)
                decoded_lines.append(decoded_line)
            except UnicodeDecodeError as ex:
                decoding_problems.append(generic_exception_handler.extract_short_error_message(ex))

        if csv_options is not None:
            defaults = {"delimiter": ",",
                        "quoting": csv.QUOTE_MINIMAL,
                        "skipinitialspace": True}
            full_csv_options = copy.deepcopy(defaults)
            full_csv_options["delimiter"] = bytes(csv_options["delimiter"], "utf-8").decode("unicode_escape")
            full_csv_options["quoting"] = getattr(csv, csv_options["quoting"])
            delimiter = full_csv_options["delimiter"]
            dialect = None
        else:
            dialect = csv.Sniffer().sniff(raw_text[:1024].decode(encoding, "ignore"))
            tsvfile.seek(0)
            delimiter = dialect.delimiter
            full_csv_options = None

        header_list = raw_lines[0].decode(encoding, "ignore").rstrip().split(delimiter)
        header_list = [header for header in header_list]
        header_list = make_fieldnames_unique(header_list)
        filename, file_extension = os.path.splitext(tsvfile.filename)
        result_list = []

        if dialect is not None:
            creader = csv.reader(decoded_lines, dialect)
        else:
            creader = csv.reader(decoded_lines, **full_csv_options)
        i = 0
        for rlist in creader:
            try:
                row = {}
                for col, val in enumerate(rlist):
                    if header_list[col] in standard_fields:
                        continue
                    row[header_list[col]] = val
                row["__filename__"] = filename
                row["__id__"] = i
            except Exception as ex:
                decoding_problems.append(generic_exception_handler.extract_short_error_message(ex))
            else:
                result_list.append(row)
                i += 1

        tsvfile.seek(0)
        header_list = add_standard_fields(header_list)
    except Exception as ex:
        ermsg = generic_exception_handler.extract_short_error_message(ex, "Error reading text file")
        return None, {"message": ermsg}, None, None, None
    return filename, result_list, header_list, encoding, decoding_problems


# Field names in mongo cannot contain dots or null characters, and they must not start with a dollar sign
def make_keys_mongo_valid(key_list):
    return [re.sub("\.", "_", k) for k in key_list]


def read_excel_file(xlfile):
    xlfile.seek(0)
    try:
        filename, file_extension = os.path.splitext(xlfile.filename)
        wb = openpyxl.reader.excel.load_workbook(xlfile)
        sheet_names = wb.sheetnames
        doc_dict = {}
        header_dict = {}

        for sname in sheet_names:
            sheet_list = []
            ws = wb[sname]
            allrows = tuple(ws.rows)
            header_row = allrows[0]
            header_list = []
            for c in header_row:
                try:
                    if c.value is None:
                        header_list.append("None")
                    elif not c.data_type == openpyxl.cell.cell.TYPE_STRING:
                        header_list.append(str(c.value))
                    else:
                        header_list.append(c.value)
                except Exception as ex:
                    erstr = "Error getting cell {} of excel sheet {}".format(c.coordinate, sname)
                    ermsg = generic_exception_handler.extract_short_error_message(ex, erstr)
                    return None, {"message": ermsg}, None
            header_list = make_fieldnames_unique(header_list)
            header_list = make_keys_mongo_valid(header_list)
            highest_nonblank_line = 0
            highest_nonblank_column = 0
            for i, line in enumerate(allrows[1:]):
                row = {}
                for col, c in enumerate(line):
                    try:
                        the_val = c.value
                        if the_val is not None:
                            highest_nonblank_line = i
                            if col > highest_nonblank_column:
                                highest_nonblank_column = col
                        if not c.data_type == openpyxl.cell.cell.TYPE_STRING:
                            the_val = str(the_val)
                        row[header_list[col]] = the_val
                    except Exception as ex:
                        erstr = "Error getting cell {} of excel sheet {}".format(c.coordinate, sname)
                        ermsg = generic_exception_handler.extract_short_error_message(ex, erstr)
                        return None, {"message": ermsg}, None
                row["__filename__"] = filename
                row["__id__"] = i
                sheet_list.append(row)
            sheet_list = sheet_list[:highest_nonblank_line + 1]
            for r in sheet_list:
                for col in range(highest_nonblank_column + 1, len(header_list)):
                    del r[header_list[col]]
            doc_dict[sname] = sheet_list
            header_list = header_list[:highest_nonblank_column + 1]
            header_list = add_standard_fields(header_list)
            header_dict[sname] = header_list
    except Exception as ex:
        ermsg = generic_exception_handler.extract_short_error_message(ex, "Error reading excel file")
        return None, {"message": ermsg}, None
    return filename, doc_dict, header_dict


def read_csv_file_to_list(csvfile, csv_options=None):
    return read_table_file_to_list(csvfile, csv_options)


# def read_tsv_file_to_list(tsvfile):
#     return read_table_file_to_list(tsvfile, "\t")


def read_txt_file_to_list(txtfile):
    decoding_problems = []
    try:
        filename, file_extension = os.path.splitext(txtfile.filename)
        raw_text = txtfile.read()
        detected = chardet.detect(raw_text[:100000])
        try:
            decoded_text = raw_text.decode(detected["encoding"])
        except UnicodeDecodeError as ex:
            decoding_problems.append(generic_exception_handler.extract_short_error_message(ex))
            decoded_text = raw_text.decode(detected["encoding"], "ignore")

        lines = decoded_text.splitlines()
        result_list = []
        i = 0
        for ln in lines:
            result_list.append({"__id__": i, "__filename__": filename, "text": ln})
            i = i + 1

        header_list = ["__id__", "__filename__", "text"]
    except Exception as ex:
        ermsg = generic_exception_handler.extract_short_error_message(ex, "Error reading text file")
        return None, {"message": ermsg}, None, None
    return filename, result_list, header_list, detected["encoding"], decoding_problems


def read_freeform_file(txtfile):
    try:
        filename, file_extension = os.path.splitext(txtfile.filename)
        raw_text = txtfile.read()
        detected = chardet.detect(raw_text[:100000])
        decoding_problems = []
        try:
            decoded_text = raw_text.decode(detected["encoding"])
        except UnicodeDecodeError as ex:
            decoding_problems.append(generic_exception_handler.extract_short_error_message(ex))
            decoded_text = raw_text.decode(detected["encoding"], "ignore")
    except Exception as ex:
        ermsg = generic_exception_handler.extract_short_error_message(ex, "Error reading text file")
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
