@user_tile
class NaiveBayesSKL(TileBase):
    category = "classifiers"
    
    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self._vocab = None
        self._classifer = None
        self.tile_type = self.__class__.__name__
        self.tokenized_rows_dict = {}
        self.autocodes_dict = {}
        self.vocab_size = 50
        self.palette_name = "RdYlGn"

    @property
    def options(self):
        return  [
        {"name": "text_source", "type": "column_select"},
        {"name": "code_source", "type": "column_select"},
        {"name": "code_destination", "type": "column_select"},
        {"name": "stop_list", "type": "list_select"},
        {"name": "vocab_size", "type": "int"}
        ]

    def get_most_common(self, fdist, num):
        result = []
        for entry in fdist.most_common(num):
            result.append(entry[0])
        return result
    
    def render_content(self):
        if self.text_source is None:
            return "No text source selected."
        from sklearn.feature_extraction.text import CountVectorizer
        from sklearn.naive_bayes import BernoulliNB
        from sklearn import metrics
        self.dm("creating vectorizer")
        vectorizer = CountVectorizer(stop_words=self.get_user_list(self.stop_list), max_features=self.vocab_size)
        data = self.get_column_data(self.text_source)
        self.dm("using vectorizer")
        X_train = vectorizer.fit_transform(data)
        Y_train = self.get_column_data(self.code_source)
        self.dm("creating classifier")
        clf = BernoulliNB()
        clf.fit(X_train, Y_train)
        
        accuracy = clf.score(X_train, Y_train)
        self.dm("predicting")
        pred = clf.predict(X_train)
        cm = metrics.confusion_matrix(Y_train, pred)

        self.dm("displaying result")
        html_output = "accuracy is " + str(round(accuracy, 2))
        html_output += '<pre>'+ str(cm) + '</pre>'

        return html_output

