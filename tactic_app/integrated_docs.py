import requests
import re


def remove_lt_whitespace(txt):
    newtxt = re.sub(r"^(\s*)", "", txt)
    newtxt = re.sub(r"(\s*)$", "", newtxt)
    return newtxt


def get_api_from_wiki():
    r = requests.get("https://raw.githubusercontent.com/wiki/bsherin/tactic/Tile-Commands.md")
    the_source = r.text

    res = re.findall(r"\#\#(.*)([\s\S]*?)(?=\#\#)|$", the_source)
    newres = []
    for r in res:
        sectext = re.findall("```python([\s\S]*?)---", str(r[1]))
        for i, m in enumerate(sectext):
            sectext[i] = list(re.findall(r"([\s\S]*?)```([\s\S]*)", sectext[i])[0])
            sectext[i][0] = remove_lt_whitespace(sectext[i][0])
            sectext[i][0] = re.sub(r"(\n\s*)", r", ", sectext[i][0])
            sectext[i][1] = remove_lt_whitespace(sectext[i][1])
        newres.append([r[0], sectext])
    return newres


def get_api_html(ar):
    result = ""
    for section in ar:
        for entry in section[1]:
            result += "<h3>{}</h3>\n<div>{}</div>\n".format(entry[0], entry[1])
    return result


api_array = get_api_from_wiki()
api_html = get_api_html(api_array)




