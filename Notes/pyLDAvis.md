## pyLDAvis

I've gotten this working locally
The key is to use the kwarg n_jobs = 1
when preparing

```python
import pyLDAvis
import pyLDAvis.gensim
vis_data = pyLDAvis.gensim.prepare(lda_m1, cw_bows, gensim_dict, n_jobs=1)
```

Then use this to display

```python
pyLDAvis.prepared_data_to_html(vis_data)
```

