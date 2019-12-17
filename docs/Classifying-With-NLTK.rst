Classifying with NLTK
======================

In this tutorial we are going to do some real text mining. Sort of. Start by getting the collection called
spam_collection from the repository if you don't already have it. Then open it. This is what you should see.

.. figure:: images/ntlk_classifying/just_table.png

The text column has the text of an sms text message. The category column says "spam" if that message has been
deemed to be spam, otherwise it says "ham." Our goal is to train a classifier that could, in principle,
code unseen messages. We are not really going to do that properly. Instead, I'm going to give you a bit of
a sense of how to do that in Tactic and, in this case, using NLTK.

Next step: Using the :guilabel:`classify` menu, add a NaiveBayes tile to the environment. Then set the options
like so:

.. figure:: images/ntlk_classifying/option_settings.png

Mostly these setting should be self-explanatory. The one exception might be the ``write_result_to_column`` option.
If this option is true, then the tile will use the classifier it creates to code each row, and then it will write that
code into the column specified in ``code_destination``. We are just going to leave this as false. Once you've got the
options set, you can go ahead and click :guilabel:`Submit`.

.. image:: images/ntlk_classifying/tile_with_cm.png

The tile reports the accuracy that it achieved, and it also displays a confusion matrix. The results probably
look pretty good. But you probably know that what we are doing here is cheating, since this tile uses all of
the data both for training and testing. The :guilabel:`Color Text` button is an extra feature that I'll explain below,
unless I get too lazy.