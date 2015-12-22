import os
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.corpus import sentiwordnet

script_loc = os.path.dirname(os.path.realpath(__file__))

vader_sentiment_analyzer = SentimentIntensityAnalyzer(lexicon_file=script_loc + "/lexicons/vader_sentiment_lexicon.txt")
