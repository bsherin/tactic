
from tactic_app.shared_dicts import weight_functions
import numpy

def weight_function(wfunc):
    weight_functions[wfunc.__name__] = wfunc
    return wfunc

# Here are some assorted weighting functions

@weight_function
def pure_tf(tf, df, cf):
    return tf

@weight_function
def tf(tf, df, cf):
    if tf == 0:
        result = 0
    else:
        result = (1 + numpy.log(tf))
    return result

@weight_function
def tfidf(tf, df, cf):
    if tf == 0 or df == 0:
        result = 0
    else:
        result = (1 + numpy.log(tf)) / df
    return result

