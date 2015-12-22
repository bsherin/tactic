import unittest

import nltk

nltk.data.path = ['../nltk_data/']
from sentiment_tools import vader_sentiment_analyzer, sentiwordnet

class TestSentimentTools(unittest.TestCase):
    def test_sentiment_analyzer(self):
        sent = "this is very nice"
        result = vader_sentiment_analyzer.polarity_scores(sent)
        presumed_result = {'neg': 0.0, 'neu': 0.492, 'pos': 0.508, 'compound': 0.4754}
        self.assertEqual(result, presumed_result)

    def test_sentiwordnet(self):
        breakdown = sentiwordnet.senti_synsets("breakdown")
        self.assertEqual(list(breakdown)[1].obj_score(), 0.375)