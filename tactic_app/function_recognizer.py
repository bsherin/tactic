import re

# Python identifiers start with a letter or _,
#and continue with these or digits.
IDENT = '[A-Za-z_][A-Za-z_0-9]*'

# Commas between identifiers can have any amout of space on either side.
COMMA = '\s*,\s*'

# Parameter list can contain some positional parameters.
# For simplicity we ignore now named parameters, *args, and **kwargs.
# We catch the entire list.
PARAM_LIST = '\((' + IDENT+'?' + '(?:' + COMMA+IDENT + ')*'+ ')?\)'
PARAM_LIST_NO_CAPTURE = '\(' + IDENT+'?' + '(?:' + COMMA+IDENT + ')*'+ '?\)'

# Definition starts with 'def', then identifier, some space, and param list.

BODY = ':.*\n([\s\S]*?(?=$|\sdef ))'
BODY_NO_CAPTURE = ':.*\n[\s\S]*?(?=$|\sdef )'
DEF = 'def\s+(' + IDENT + ')\s*' + PARAM_LIST + BODY
DEF_FULL_CODE = '(?:\n|^)(.*?def\s+(' + IDENT + ')\s*' + PARAM_LIST_NO_CAPTURE + BODY_NO_CAPTURE + ")"

ident_rx = re.compile(IDENT)
def_rx = re.compile(DEF)
def_fc = re.compile(DEF_FULL_CODE)

# This function returns a tuple with (function_name, args, function_body)
def get_functions_parse(code):
    matches = def_rx.findall(code)
    return matches

# This function returns a dictionary where the keys are function names and the values are the full function code
def get_functions_full_code(code):
    matches = def_fc.findall(code)
    func_dict = {}
    for tup in matches:
        func_dict[tup[1]] = tup[0]
    return func_dict


test_string = """def test(s):
    match = def_rx.match(s)
    if match:
        name, paramlist = match.groups()
        # extract individual params
        params = [x.group() for x in ident_rx.finditer(paramlist or '')]
        print s, name, params
    else:
        print s, 'does not match'
def test2(b, c):
    print 'hello'
    return"""


# from function_recognizer import test_string, def_rx, def_fc
# def_rx.findall(test_string)
# def_fc.findall(test_string)


