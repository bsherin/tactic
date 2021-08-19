import requests, markdown
import re, os
from docutils.core import publish_string


def get_api_from_rst():
    f = open("./docs/Tile-Commands.rst")
    txt = f.read()
    categories = re.findall(r".. category_start([\s\S]*?).. category_end", txt)
    newres = []
    for cat in categories:
        catname = re.findall(r"\n*(.*?)\n", cat)[0]
        methods = re.findall(r"py:(method|attribute):: ([\s\S]*?)(?=\n *?\.\.|$)", cat)
        mlist = []
        for m in methods:
            kind = m[0]
            msig = re.findall(r"(^.*)", m[1])[0]
            mbody = re.findall(r"\n\n([\s\S]*)", m[1])[0]
            mlist.append([msig, mbody, kind])
        newres.append([catname, mlist])
    return newres


def get_object_api_from_rst():
    f = open("./docs/Object-Oriented-API.rst")
    txt = f.read()
    categories = re.findall(r".. category_start([\s\S]*?).. category_end", txt)
    newres = {}
    ordered_catnames = []
    for cat in categories:
        catname = re.findall(r"\n*(.*?)\n", cat)[0]
        ordered_catnames.append(catname)
        classes = re.findall(r"py:class:: ([\s\S]*?)(?=\n *?\.\. py:class::|$)", cat)
        global_consts = re.findall(r"py:data:: ([\s\S]*?)(?=\n *?\.\. |$)", cat)
        newres[catname] = []
        for const in global_consts:
            const_name = re.findall(r"^([a-zA-Z()]*)", const)[0]
            const_body = process_body(re.findall(r"\n\n([\s\S]*)", const)[0])
            newres[catname].append([const_name,
                                    {"signature": const_name, "body": const_body, "kind": "global"}, "global"])
        for cla in classes:
            cname = re.findall(r"^([a-zA-Z()]*)", cla)[0]
            methods = re.findall(r"py:(method|attribute):: ([\s\S]*?)(?=\n *?\.\.|$)", cla)
            mlist = []
            for m in methods:
                kind = m[0]
                msig = re.findall(r"(^.*)", m[1])[0]
                mbody = process_body(re.findall(r"\n\n([\s\S]*)", m[1])[0])
                mlist.append({"signature": msig, "body": mbody, "kind": kind})
            newres[catname].append([cname, mlist, "class"])
    return ordered_catnames, newres


def get_api_html(ar):
    result = ""
    for section in ar:
        result += "<h4>{}</h4>\n".format(section[0])
        for entry in section[1]:
            result += "<button class='accordion btn btn-info'>{}</button>\n<div class='accordion-panel'><p>{}</p></div>\n".format(entry[0], entry[1])
    return result


def get_tile_command_html():
    f = open("./docs/_build/html/Tile-Commands.html")
    txt = f.read()
    return txt


def process_body(rbody):
    raw_body = rbody.strip()
    raw_body = re.sub(":py:class:", "", raw_body)
    raw_body = re.sub("\n\n", "XXX", raw_body)
    raw_body = re.sub("\n", " ", raw_body)
    raw_body = re.sub("XXX", "\n\n", raw_body)
    raw_body = re.sub("(\:param [a-z]* )", ":", raw_body)
    raw_body = re.sub("\:py\:meth\:", "", raw_body)
    return publish_string(raw_body, writer_name='html').decode("utf-8")


def create_api_dict_by_category(_api_array):
    result = {}
    ordered_categories = []
    for cat_array in _api_array:
        # cat_list = [entry[0] for entry in cat_array[1]]
        revised_cat_list = []
        for entry in cat_array[1]:
            signature = entry[0]
            kind = entry[2]
            if kind == "attribute":
                short_name = signature
            else:
                short_name = re.findall("(^.*?)\(", signature)[0]
            body = process_body(entry[1])
            revised_cat_list.append({"name": short_name, "signature": signature, "body": body, "kind": kind})
        result[cat_array[0]] = revised_cat_list
        ordered_categories.append(cat_array[0])
    return result, ordered_categories


def create_api_dict_by_name(_api_dict_by_category):
    result = {}
    for cat_name, cat_list in _api_dict_by_category.items():
        for entry in cat_list:
            result[entry["name"]] = {"signature": entry["signature"], "category": cat_name}
    return result


try:
    api_array = get_api_from_rst()
    api_dict_by_category, ordered_api_categories = create_api_dict_by_category(api_array)
    api_dict_by_name = create_api_dict_by_name(api_dict_by_category)
    ordered_object_categories, object_api_dict_by_category = get_object_api_from_rst()

except Exception as ex:
    print("unable to get api")
    eresult = type(ex).__name__
    if len(ex.args) > 0:
        eresult += " " + str(ex.args[0])
    print(eresult)
    api_array = []
    api_dict_by_category = {}
    api_dict_by_name = {}
    ordered_api_categories = []
    tile_command_html = ""
    api_html = ""
