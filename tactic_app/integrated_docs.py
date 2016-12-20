import requests, markdown
import re


def remove_lt_whitespace(txt):
    newtxt = re.sub(r"^(\s*)", "", txt)
    newtxt = re.sub(r"(\s*)$", "", newtxt)
    return newtxt


def get_api_from_wiki():
    r = requests.get("https://raw.githubusercontent.com/wiki/bsherin/tactic/Tile-Commands.md", timeout=3)
    the_source = r.text

    res = re.findall(r"\#\#(.*)([\s\S]*?)(?=\#\#)|$", the_source)
    newres = []
    for r in res:
        sectext = re.findall("```python([\s\S]*?)---", str(r[1]))
        for i, m in enumerate(sectext):
            sectext[i] = list(re.findall(r"([\s\S]*?)```([\s\S]*)", sectext[i])[0])
            sectext[i][0] = remove_lt_whitespace(sectext[i][0])
            sectext[i][0] = re.sub(r"(\n\s*)", r", ", sectext[i][0])
            sectext[i][1] = markdown.markdown(remove_lt_whitespace(sectext[i][1]))
        newres.append([r[0], sectext])
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
        cat_list = []
        for entry in cat_array[1]:
            cat_list += entry[0].split(", self.")
        revised_cat_list = []
        for ent in cat_list:
            signature = re.sub("self\.", "", ent)
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
    api_array = get_api_from_wiki()
    api_html = get_api_html(api_array)
    api_dict_by_category, ordered_api_categories = create_api_dict_by_category(api_array)
    api_dict_by_name = create_api_dict_by_name(api_dict_by_category)
except:
    api_array = []
    api_html = ""
