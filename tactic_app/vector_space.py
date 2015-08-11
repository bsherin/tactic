import numpy as np
from numpy import linalg
from matplotlib import pyplot
from mpl_toolkits.mplot3d import Axes3D
from nltk import FreqDist # @UnresolvedImport
import copy
impatience_number_for_mod = 150

PRINT_VERBOSE = True

# from mpl_toolkits import mplot3d

class Vocabulary(object):
    # Class for creating and holding a vocabulary, taking into account stop and go lists. 
    # Itakes as input a list of documents in text form, and the stoplist and golist.
    # Main important variables maintained are:
    # self._set_vocab
    # self._list_vocab (sorted by _cf_dict)
    # self._sorted_list_vocab (sorted by _df_dict)
    # self._N, _log_N(the number of documents)
    # self._cf_dict (corpus frequencies)
    # self _df_dict/_log_df_dict (document frequencies)
    # self._vocab_index (A dictionary where the words are the keys and the entries are the position of the word in _list_vocab)
    
    def __init__(self, doc_list, stop_list_path = 'stoplist.txt', go_list_path = 'golist.txt'):
        global debug_now
        # myprint("initializing vocabulary")
        # self.read_stop_list(stop_list_path)
        # self.read_go_list(go_list_path)
        self._stop_list = set([])
        self._go_list = set([])
        all_text = []
        for doc in doc_list:
            all_text += doc
        set_vocab = set(all_text)
        
        # Note: we don't want to add words to the vocabulary from the go_list unless they actually appear in the vocabulary.
        # That's why we do it this way, by removing the go_list words from the stop_list
        
        self._stop_list = self._stop_list.difference(self._go_list)
        self._set_vocab = set_vocab.difference(self._stop_list)
        self._N = len(doc_list)
        self._log_N = mylog(self._N) # store this just for speed
        
        # do the frequency counts
        self._cf_dict = FreqDist(all_text)
        self._list_vocab = sorted(self._set_vocab, lambda x, y:self._cf_dict[y] - self._cf_dict[x])
        fdlist = [FreqDist(dl) for dl in doc_list]
        self._df_dict = {}
        self._log_df_dict = {}
        for w in self._set_vocab:
            count = 0
            for fd in fdlist:
                if fd[w] > 0:
                    count += 1
            self._df_dict[w] = count
            self._log_df_dict[w] = mylog(count) # store this just for speed later
        
        i = 0
        self._vocab_index = {}
        for w in self._list_vocab:
            self._vocab_index[w]=i
            i = i + 1
        
        self._sorted_list_vocab = copy.copy(self._list_vocab)
        self._sorted_list_vocab.sort(key = lambda x: -1 * self._cf_dict[x])
        
        # Move words in the go_list to the start of sorted_list_vocab if they are in there at all.
        # This will cause these to be included in the top words used by feature extractors even if they are rare.
        
        for w in self._go_list:
            if w in self._set_vocab:
                self._sorted_list_vocab.remove(w)
                self._sorted_list_vocab = [w] + self._sorted_list_vocab
        return
    
    def vocab_data_table(self):
        the_table = [["Word", "DF", "CF"]]
        for w in self._list_vocab:
            the_table += [[w, self._df_dict[w], self._cf_dict[w]]]
        return the_table
    
    def selected_vocab_data_table(self, sub_vocab):
        the_table = [["Word", "DF", "CF"]]
        for w in sub_vocab:
            the_table += [[w, self._df_dict[w], self._cf_dict[w]]]
        return the_table
    
    def read_stop_list(self, stop_list_name):
        stop_list_slashn = open(stop_list_name).readlines()
        self._stop_list = set([w[:len(w)-1] for w in stop_list_slashn])
        return
    
    def read_go_list(self, go_list_name):
        go_list_slashn = open(go_list_name).readlines()
        self._go_list = set([w[:len(w)-1] for w in go_list_slashn])
        return

class TDMatrix(object):
    def __init__(self, doc_list, ws, normalize_contributions_to_training = False, row_entropy_weighting = False):
        # myprint("initialing TDMatrix")
        self._doc_list = doc_list
        self._ws = ws
        if normalize_contributions_to_training:
            self.build_td_matrix_ne()
        else:
            self.build_td_matrix(row_entropy_weighting)

    def build_td_matrix(self, row_entropy_weighting):
        # notes about optimizing this. All of the time it turns out is spent in compute_doc_vector
        # modifying the matrix doesn't take much time.
        self._td_matrix = np.zeros([len(self._ws._vocab._set_vocab), len(self._doc_list)])
        self._raw_td_matrix = np.zeros([len(self._ws._vocab._set_vocab), len(self._doc_list)])
        i = 0
        for doc in self._doc_list:
            if (np.mod(i, impatience_number_for_mod) == 0) and (i > 0):
                myprint(i)
            vec = self._ws.compute_doc_vector(doc)
            self._td_matrix[:, i] = vec
            i = i + 1
        # myprint('\n')
    
    def build_td_matrix_ne(self, row_entropy_weighting = False):
        # myprint("entering build_td_matrix_ne")
        self._td_matrix = np.zeros([len(self._ws._vocab._set_vocab), len(self._doc_list)])
        self._raw_td_matrix = np.zeros([len(self._ws._vocab._set_vocab), len(self._doc_list)])
        i = 0
        for doc in self._doc_list:
            if (np.mod(i, impatience_number_for_mod) == 0) and (i > 0):
                myprint(i)
            vec = np.zeros([len(self._ws._vocab._set_vocab)])
            for subdoc in doc:
                newvec = normalize(self._ws.compute_doc_vector(subdoc))
                vec = vec + newvec
            self._td_matrix[:, i] = vec
        # myprint('\n')
                
    def build_row_entropy_weight_dict(self):
        i = 0
        for doc in self._doc_list:
            self._raw_td_matrix[:, i] = self._ws.compute_raw_doc_vector(doc)
            i = i + 1
        row_entropy_weight_dict = {}
        log_of_N = mylog(self._raw_td_matrix.shape[1])
        for row in range(self._raw_td_matrix.shape[0]):
            row_ent = self.compute_row_entropy(row)
            row_entropy_weight_dict[self._ws._vocab._list_vocab[row]] = 1 - (row_ent / log_of_N)
        return row_entropy_weight_dict
    
    def compute_row_entropy(self, row):
        cols = self._raw_td_matrix.shape[1]
        H = 0
        cf = self._ws._vocab._cf_dict[self._ws._vocab._list_vocab[row]]
        if (cf != 0):
            lcf = mylog(cf)
            for c in range(cols):
                # in the next line, I add a small amount to every tf
                # the purpose of this is to avoid the case where H=0
                # this would occur if only one tf was non-zero.
                tf = self._raw_td_matrix[row, c] + .01
                if (tf != 0):
                    H += -1 * (tf / cf) * (mylog(tf) - lcf)
        return H
        
class WordSpace(object):
    # This class takes a list of documents in text form.
    # It creates a vocabulary, a TDMatrix, and has some tools for working with them, especially for vector space analysis.
    
    def __init__(self, ref_doc_list, params):
        self._weight_by_s = True
        self._params = params
        # self._weight_factor = weight_factor_dict[params._parameters['wfactor']]
        stop_list_path = self._params._parameters["stop_list_name"]
        go_list_path = self._params._parameters["go_list_name"]
        self._vocab = Vocabulary(ref_doc_list,  stop_list_path, go_list_path)
        self._row_entropy_weight_dict = None
        ref_matrix = TDMatrix(ref_doc_list, self)
        self._td_matrix = ref_matrix._td_matrix
        if params._parameters["row_entropy_weighting"]:
            self._row_entropy_weight_dict = ref_matrix.build_row_entropy_weight_dict()
        dims = params._parameters['dims']
        # note that here I'm assuming there will always be plenty of rows. Only columns is an issue.
        if dims > self._td_matrix.shape[1]:
            print "Dims is greater than the number of columns in the termxdocument matrix."
            dims = self._td_matrix.shape[1]
       
        if params._parameters['fold_matrices']:  
            print "performing the svd and reducing dimensions to ", dims
            T, S, Dt = linalg.svd(self._td_matrix, full_matrices = False)
            print "svd completed"
    
            self._dims = dims
            
            self._T_reduced = T[:, 0:dims]
            self._Dt_reduced = Dt[0:dims, :]
            self._S_reduced = np.diag(S)[0:dims, 0:dims]
            self._B = np.dot(self._S_reduced, self._Dt_reduced)
            # self._B = np.dot(self._S_reduced, Dt)
            self._T_reduced_trans = np.transpose(self._T_reduced)
            print "t reduced shape", self._T_reduced.shape
        else:
            self._T_reduced = self._td_matrix
    
    def compute_doc_vector(self, doc):
        # This seems to take the same amount of time roughly independent of the weight factor.
        docfd = FreqDist(doc)
        return([self._weight_factor(self._vocab, docfd[word], word, self._row_entropy_weight_dict) for word in self._vocab._list_vocab])
    
    def compute_raw_doc_vector(self, doc):
        docfd = FreqDist(doc)
        return([docfd[word] for word in self._vocab._list_vocab])
    
    def compute_unweighted_doc_vector(self, doc):
        return([doc.count(word) for word in self._vocab._list_vocab])

#    def fold_in(self, vec):
#        # Fold_in returns a a vector not included in the initial LSI
#        # currently T_reduced (and its transpose) don't get normalized
#        return np.dot(self._T_reduced_trans, vec)
        
    def fold_matrix(self, m):
        if self._params._parameters['fold_matrices']:
            return np.dot(self._T_reduced_trans, m)
        else:
            return m
    
    def wordvec(self, w):
        # takes a word as an argument and returns the normalized vector assocaited with the word
        # this used to normalize: normalize(self._T_reduced[self._vocab._vocab_index[w]])
        # return self._T_reduced[self._vocab._vocab_index[w]]
        if self._weight_by_s and self._params._parameters['fold_matrices']:
            result = normalize(np.dot(self._T_reduced[self._vocab._vocab_index[w]], self._S_reduced))
        else:
            result = normalize(self._T_reduced[self._vocab._vocab_index[w]])
        return result
        
    def associate(self, w1, w2):
        # Takes two words as inputs and returns the dot products between their normalized word vectors.
        return np.vdot(self.wordvec(w1), self.wordvec(w2))
        
    def associate_from_vec(self, w1, vec):
        # The first input is a word. The second input is a vector.
        # Returns the dot product between the normalized word vector for the word and the given vector.
        #wvec = np.zeros([len(self._vocab._set_vocab)])
        #wvec[self._vocab._vocab_index[w1]] = 1
        #wvec_folded = normalize(self.fold_in(wvec))
        if self._params._parameters['fold_matrices']:
            wvec_folded = normalize(self._T_reduced[self._vocab._vocab_index[w1]])
            return np.vdot(wvec_folded, vec)
        else:
            wvec = np.zeros([len(self._vocab._set_vocab)]) 
            wvec[self._vocab._vocab_index[w1]] = 1
            return np.vdot(wvec, vec)
        
    def build_associate_list(self, target, min_oc=1):
        # takes as input a target word and, optionally, a minimum number of occurrences.
        # returns the words from the wordspace with the highest dot products with the target word.
        # the results are restricted to words that appear more than minimum occurrences specified.
        temp_list = [[w, self.associate(w, target), self._vocab._cf_dict[w]]
                for w in self._vocab._list_vocab if (self._vocab._cf_dict[w] >= min_oc) and not (magnitude(self.wordvec(w)) == 0)]
        return sorted(temp_list, self.associate_item_compare)
        
    def build_associate_list_from_vec(self, target_vec, min_oc=1):
        # The same as build_associate_list except that the target is given as a vector rather than word
        # also, it assumes that the target vec is a document vector. So, for each word we will essentiallyconstruct a document with just one word in it.

        temp_list = [[w, self.associate_from_vec(w, target_vec), self._vocab._cf_dict[w]]
                for w in self._vocab._list_vocab if (self._vocab._cf_dict[w] >= min_oc) and not (magnitude(self.wordvec(w)) == 0)]
        return sorted(temp_list, self.associate_item_compare)
        
    def associate_item_compare (self, x, y):
        if y[1] > x[1]:
                return 1
        else:
                return -1
            
    def print_associate_list (self, al):
        # This just prints an associate list a little bit nicely.
        # The one argument is the associate list which will presumably be produced by build_associate_list
        result = ""
        for item in al:
                result += item[0] + '\t' + str(round(item[1], 3)) + '\t' + str(item[2]) + '\n'
        return result

class SimpleWordSpace(WordSpace):
    def __init__(self, ref_matrix, params):
        # print "entering SimpleWordSpace"
        self._td_matrix = ref_matrix._td_matrix
        self._vocab = ref_matrix._vocab
        self._T_reduced = self._td_matrix # 655 x 54
        self._T_reduced_trans = np.transpose(self._T_reduced) # 54 x 655
        
    #def fold_in(self, vec):
    #    return vec
    
    def associate_from_vec(self, w1, vec):
        # The first input is a word. The second input is a vector.
        # Returns the dot product between the normalized word vector for the word and the given vector.
        wvec = np.zeros([len(self._vocab._set_vocab)]) # 655
        wvec[self._vocab._vocab_index[w1]] = 1
        # wvec = np.dot(self._T_reduced_trans, w1) # 54 x 655, 655
        return np.vdot(wvec, vec) # 655, 655
    
    def wordvec(self, w):
        result = normalize(self._T_reduced[self._vocab._vocab_index[w]])
        return result
    
    def fold_matrix(self, m):
        return m
    
    #def associate_from_vec(self, w1, vec):
    #    wvec = np.zeros([len(vec)])
    #    wvec[self._vocab._vocab_index[w1]] = 1
    #    return np.vdot(wvec, vec)

class COMatrix(TDMatrix):
    def __init__(self, doc_list, vocab, wfactor, singular_values = 200, pre_con = 15, post_con = 15):
        # parameters that define this analysis
        myprint("initialzing COMatrix")
        self.sing_vals = singular_values
        self.pre_context = pre_con
        self.post_context = post_con
        self.wchars = ['-']
        TDMatrix.__init__(self, doc_list, vocab, wfactor)
        return
    
    ## left off here reworking. Will need to rework the Vocabulary class to make this all work.
    
    def build_td_matrix(self, row_entropy_weighting):
        # prepare the column vocabulary
        myprint("entering build_td_matrix in COMatrix")
        self._list_column_vocab = self._vocab._list_vocab[0:1000]
        self._column_vocab = set(self._list_column_vocab)
        i = 0
        self._column_vocab_index = {}
        for w in self._list_column_vocab:
            self._column_vocab_index[w]=i
            i = i + 1
        
        # create the co-occurrence matrix

        self.build_co_matrix()
        self._td_matrix = self.co_matrix
        return
    
    def create_region (self, index, ldoc):
        l = index - self.pre_context
        if l < 0:
            l = 0
        r = index + self.post_context + 1
        if r > len(ldoc):
            r = len(ldoc)
        return ldoc[l:r]
        
    def process_region (self, target, reg):
        for wd in reg:
            if (not (wd == target)) and (wd in self._column_vocab):
                r = self._vocab._vocab_index[target]
                c = self._column_vocab_index[wd]
                self.co_matrix[r, c] = self.co_matrix[r, c] + self._weight_factor(self._vocab, 1, wd)
        return

    def build_co_matrix(self):
        self.co_matrix = np.zeros((len(self._vocab._list_vocab), 1000))
        dnumb = 0
        for doc in self._doc_list:
            if np.mod(dnumb, impatience_number_for_mod) == 0:
                myprint(dnumb)
            i = 0
            for w in doc:
                if w in self._vocab._set_vocab:
                    region = self.create_region(i, doc)
                    self.process_region (w, region)
                i = i + 1
            dnumb += 1
        self.co_matrix = np.sqrt(self.co_matrix)
        return

def normalize(vec):
    mag = np.vdot(vec, vec)
    if mag == 0:
        return vec
    else:
        return(vec / (np.sqrt(mag)))
        
def magnitude(vec):
    return np.vdot(vec, vec)

def normalize_columns(mat):
    mat_norm = np.copy(mat)
    for i in range(mat.shape[1]):
        mat_norm[:, i] = normalize(mat[:, i])
    return mat_norm

def orthogonalize_columns (the_m):
        nrows = the_m.shape[0]
        ncols = the_m.shape[1]
        total_v = np.zeros(nrows)
        for i in range(ncols):
                total_v = total_v + the_m[:, i]
        total_v = normalize(total_v)
        new_m = np.zeros([nrows, ncols])
        for i in range(ncols):
                v = the_m[:, i]
                new_m[:, i] = normalize(v - np.dot(v, total_v) * total_v)
        return new_m
    
def scatter_plot(dvectors, dnames, ax):
    pyplot.axhline(xmin = -1, xmax = 1)
    pyplot.axvline(ymin = -1, ymax = 1)
    pyplot.grid(True)
    pyplot.axis('on')
   
    pyplot.scatter(dvectors[0], dvectors[1])
    dvectors_t = np.transpose(dvectors)
    for i in range(len(dnames)):
        pyplot.annotate(dnames[i], dvectors_t[i], size = "small")
    
    # display the plot
    pyplot.show()
    return ax
    
def threedscatter_plot(dvectors, dnames, ax):
    if ax == None:
        fig = pyplot.figure()
        ax = Axes3D(fig)
    ax.scatter(dvectors[0], dvectors[1], dvectors[2])
    dvectors_t = np.transpose(dvectors)
    for i in range(len(dnames)):
        ax.text(dvectors_t[i][0], dvectors_t[i][1], dvectors_t[i][2],dnames[i])
    pyplot.show()
    return ax
    # pyplot.show()

def mylog(num):
    return np.log2(num)

# weight functions

def tf(vocab, count, term, row_entropy_weight_dict):
    if count == 0:
        result = 0
    else:
        result = (1 + mylog(count))
        if row_entropy_weight_dict != None:
            result = result * row_entropy_weight_dict[term]
    return result

tf.description = "Weight function tf:\t(1 + log(count))"

def tfalt(vocab, count, term, row_entropy_weight_dict):
    if count == 0:
        result = 0
    else:
        result = mylog(count + 1)
        if row_entropy_weight_dict != None:
            result = result * row_entropy_weight_dict[term]
    return result

tfalt.description = "Weight function tfalt:\t(log(count+1))"

def constant_weight(vocab, count, term, row_entropy_weight_dict):
    result = count
    if row_entropy_weight_dict != None:
        result = result * row_entropy_weight_dict[term]
    return result

constant_weight.description = "Weight function constant_weight: (count)"

def tfidf(vocab, count, term, row_entropy_weight_dict):
    if count == 0:
        result = 0
    else:
        result = (1 + mylog(count)) * (vocab._log_N - vocab._log_df_dict[term])
    return result

tfidf.description = "Weight function tfidf:\t(1 + log(count)) * (_log_N - _log_df_dict[term])"

def tfnologidf(vocab, count, term, row_entropy_weight_dict):
    if count == 0:
        result = 0
    else:
        result = count * (vocab._log_N - vocab._log_df_dict[term])
    return result

tfnologidf.description = "Weight function tfnologidf:\t(count) * (_log_N - _log_df_dict[term])"

def infomap_weighting (vocab, count, term, row_entropy_weight_dict):
    # return count * vocab._cf_dict[term] * (mylog(1 + vocab._N) - mylog(vocab._df_dict[term]))
    return count * (mylog(1 + vocab._N) - mylog(vocab._df_dict[term]))
    
infomap_weighting.description = "Weight function infomap_weighting:\t(count * (log(1 + _N) - np.log(_df_dict[cword]))"

weight_factor_dict = {"tf" : tf, "tfalt" : tfalt, "constant_weight" : constant_weight, "tfidf" : tfidf,
                      "tfnologidf": tfnologidf, "infomap_weighting" : infomap_weighting}

def myprint(text, new_line = True):
    if PRINT_VERBOSE:
        if new_line:
            print(text)
        else:
            print text, " ",