import unittest

import nltk
import os
from tactic_app.sentiment_tools import vader_sentiment_analyzer, SentiText, sentiwordnet

class TestSentimentTools(unittest.TestCase):

    def setUp(self):
        nltk.data.path = [os.path.dirname(os.path.abspath(__file__)) + '/../../nltk_data/']

    def test_sentiment_analyzer(self):
        sent = "this is very nice"
        (scores, words, senti_dict) = vader_sentiment_analyzer.polarity_scores(sent)
        self.assertEqual(scores, {'neg': 0.0, 'neu': 0.492, 'pos': 0.508, 'compound': 0.4754})
        self.assertEqual(words, ['this', 'is', 'very', 'nice'])
        self.assertEqual(senti_dict, {'this': 0, 'very': 0, 'is': 0, 'nice': 2.093})

    def test_sentiwordnet(self):
        breakdown = sentiwordnet.senti_synsets("breakdown")
        self.assertEqual(list(breakdown)[1].obj_score(), 0.375)