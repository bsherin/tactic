import os
from nltk.sentiment.vader import SentimentIntensityAnalyzer, SentiText, BOOSTER_DICT
from nltk.corpus import sentiwordnet # tile_env makes use of this

script_loc = os.path.dirname(os.path.realpath(__file__))


class TacticVader(SentimentIntensityAnalyzer):
    def polarity_scores(self, text):
        """
        Return a float for sentiment strength based on the input text.
        Positive values are positive valence, negative value are negative
        valence.
        """
        sentitext = SentiText(text)
        #text, words_and_emoticons, is_cap_diff = self.preprocess(text)

        sentiments = []
        words_and_emoticons = sentitext.words_and_emoticons
        for item in words_and_emoticons:
            valence = 0
            i = words_and_emoticons.index(item)
            if (i < len(words_and_emoticons) - 1 and item.lower() == "kind" and \
                words_and_emoticons[i+1].lower() == "of") or \
                item.lower() in BOOSTER_DICT:
                sentiments.append(valence)
                continue

            sentiments = self.sentiment_valence(valence, sentitext, item, i, sentiments)

        sentiments = self._but_check(words_and_emoticons, sentiments)

        sentiment_dict = {}
        for w in enumerate(words_and_emoticons):
            sentiment_dict[w[1]] = sentiments[w[0]]

        return self.score_valence(sentiments, text), words_and_emoticons, sentiment_dict

vader_sentiment_analyzer = TacticVader(lexicon_file=script_loc + "/lexicons/vader_sentiment_lexicon.txt")