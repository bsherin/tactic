import requests, markdown
import re, os

def get_api_from_rst():
    f = open("./docs/Tile-Commands.rst")
    txt = f.read()
    categories = re.findall(r".. category_start([\s\S]*?).. category_end", txt)
    newres = []
    for cat in categories:
        catname = re.findall(r"\n*(.*?)\n", cat)[0]
        methods = re.findall(r"py:method:: ([\s\S]*?)(?=\n *?\.\.|$)", cat)
        mlist = []
        for m in methods:
            msig = re.findall(r"(^.*)", m)[0]
            mbody =re.findall(r"\n\n([\s\S]*)", m)[0]
            mlist.append([msig, mbody])
        newres.append([catname, mlist])
    return newres


def get_api_html(ar):
    result = ""
    for section in ar:
        result += "<h4>{}</h4>\n".format(section[0])
        for entry in section[1]:
            result += "<button class='accordion btn btn-info'>{}</button>\n<div class='accordion-panel'><p>{}</p></div>\n".format(entry[0], entry[1])
    return result

def create_api_dict_by_category(api_array):
    result = {}
    ordered_categories = []
    for cat_array in api_array:
        cat_list = [entry[0] for entry in cat_array[1]]
        revised_cat_list = []
        for signature in cat_list:
            short_name = re.findall("(^.*?)\(", signature)[0]
            revised_cat_list.append({"name": short_name, "signature": signature})
        result[cat_array[0]] = revised_cat_list
        ordered_categories.append(cat_array[0])
    return result, ordered_categories

def create_api_dict_by_name(api_dict_by_category):
    result = {}
    for cat_name, cat_list in api_dict_by_category.items():
        for entry in cat_list:
            result[entry["name"]] = {"signature": entry["signature"], "category": cat_name}
    return result


try:
    print("getting api from directory " + os.getcwd())
    api_array = get_api_from_rst()
    api_dict_by_category, ordered_api_categories = create_api_dict_by_category(api_array)
    api_dict_by_name = create_api_dict_by_name(api_dict_by_category)
except:
    print("unable to get api")
    api_array = []
    api_dict_by_category = {}
    api_dict_by_name = {}
    ordered_api_categories = []
    api_html = ""
