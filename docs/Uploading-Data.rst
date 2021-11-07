Uploading Data
--------------

You can upload one of your own datasets. There are two modalities
available for datasets, “table” and “freeform.” Freeform datasets
consist of a set of unstructured text documents. Table datasets consist
of a set of tables of data.

To upload data, go to the collections tab of your user library. Then select
"Import Data" from the menubar.

.. note::

    You can select any number of files and these files will be loaded as documents within a single
    collection.

.. figure:: images/upload_col.png

To choose files, you can either click within the dashed space to select them
manually or drag and drop them in the same area.

.. figure:: images/select_files.PNG

After choosing the files, you can enter a name for the collection right below.
You also have the option to import the file as a freeform document by checking
the box labeled "Import as freeform." After you click upload, the name of
your new collection should appear in the list below.

For table collections, data must be in the form of xlsx, csv, tsv, or
plain text (txt) files. The first row of an xlsx, csv, or tsv file must
contain the headers for the columns. Data in a txt file is treated as a
series of rows of text with rows separated by newlines. If multiple
files are selected, each of the files is treated as a separate document
within the collection. If an xlsx file with multiple sheets is selected,
each sheet is treated with as a separate document. It’s okay to mix and
match file types.

Tactic will try to make its best guess as to the encoding of the file.
If it runs into any decoding problems, it will let you know.



