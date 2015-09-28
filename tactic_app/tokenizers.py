'''
Created on Jan 6, 2014

@author: bls910
'''
import re
from nltk import stem  # @UnresolvedImport
stemmer = stem.PorterStemmer()
from shared_dicts import tokenizer_dict


def tokenizer(tfunc):
    global tile_classes
    tokenizer_dict[tfunc.__name__] = tfunc
    return tfunc

@tokenizer
def my_tokenize(text, stem_text=False, alpha_only=False, lower_case=True):
    if lower_case:
        text = text.lower()
    punctuation_class = r"([\.\-\/&\";:\(\)\?\!\]\[\{\}\*#])"
    # Separate most punctuation at end of words

    text = re.sub(r"(\w)" + punctuation_class, r'\1 \2 ', text)
    
    # Separate most punctuation at start of words
    text = re.sub(punctuation_class + r"(\w)", r'\1 \2', text)
    
    # Separate punctuation from other punctuation
    text = re.sub(punctuation_class + punctuation_class, r'\1 \2 ', text)
    
    # Put spaces between + and = signs and digits. Also %s that follow a digit, $s that come before a digit
    text = re.sub(r"(\d)([+=%])", r'\1 \2 ', text)
    text = re.sub(r"([\$+=])(\d)", r'\1 \2', text)
    
    # Separate commas if they're followed by space.
    # (E.g., don't separate 2,500)
    text = re.sub(r"(,\s)", r' \1', text)
    
    #when we have two double quotes make it 1.
    #
    text = re.sub("\"\"", "\"", text)

    # Separate leading and trailing single and double quotes .
    text = re.sub(r"(\'\s)", r' \1', text)
    text = re.sub(r"(\s\')", r'\1 ', text)
    text = re.sub(r"(\"\s)", r' \1', text)
    text = re.sub(r"(\s\")", r'\1 ', text)
    text = re.sub(r"(^\")", r'\1 ', text)
    text = re.sub(r"(^\')", r'\1 ', text)
    text = re.sub(r"('\'$)", r' \1', text)
    text = re.sub(r"('\"$)", r' \1', text)

    #Separate parentheses where appropriate
    text = re.sub(r"(\)\s)", r' \1', text)
    text = re.sub(r"(\s\()", r'\1 ', text)

    # Separate periods that come before newline or end of string.
    text = re.sub('\. *(\n|$)', ' . ', text)
    
    # separate single quotes in the middle of words
    # text = re.sub(r"(\w)(\')(\w)", r'\1 \2 \3', text)
    
    # separate out 's at the end of words
    text = re.sub(r"(\w)(\'s)(\s)", r"\1 s ", text)
    split_text = text.split()
    
    if stem_text:
        result = [stemmer.stem(w) for w in split_text]
        split_text = result

    if alpha_only:
        split_text = return_alpha_only(split_text)
    return split_text

@tokenizer
def my_alpha_only(text):
    return my_tokenize(text, alpha_only=True)

def lower_all(ltext):
    return [w.lower() for w in ltext]

def is_contraction(the_text):
        contraction_patterns = re.compile(r"(?i)(.)('ll|'re|'ve|n't|'s|'m|'d)\b")
        return contraction_patterns.search(the_text)

def return_alpha_only (ltext):
    return [w for w in ltext if (len(w) > 0) and (w.isalpha() or w[0]=='<' or is_contraction(w))]

def remove_spaces(sometext):
    return re.sub(" ", "", sometext)