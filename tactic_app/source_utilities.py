import re

def extract_globals_from_source(source):
    pattern = re.compile(r'(.*?)@user_tile', re.DOTALL)
    result = pattern.match(source)
    return result.groups()[0]