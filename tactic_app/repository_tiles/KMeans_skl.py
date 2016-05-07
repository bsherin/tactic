@user_tile
class Kmeans_skl(TileBase):
    # save_attrs has the variables that will be saved when a project is saved
    category = "clustering"
    exports = ["new_cluster_data"]

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.clusterer = None
        self.number_of_clusters = 5
        self.number_to_show = 10
        self.minimum_occurrences = 10
        self.save_attrs += ["new_cluster_data"]
        return

    @property
    def options(self):
        return  [
            {"name": "cluster_data", "type": "pipe_select"},
            {"name": "number_of_clusters", "type": "int"},
            {"name": "minimum_occurrences", "type": "int"},
            {"name": "number_to_show", "type": "int"}
    ]

    def top_words_from_centroid(self, vocab_list, cfdist, dfdist, n, to_print=10, min_oc=10):
        result = [["word", "weight", "cf", "df"]]
        sc = list(numpy.argsort(self.centroids[n]))
        sc.reverse()
        cnt = 0
        i = 0
        while cnt < to_print:
            w = vocab_list[sc[i]]
            if cfdist[w] > min_oc:
                result.append([w, round(self.centroids[n][sc[i]], 4), cfdist[w], dfdist[w]])
                cnt += 1
            i += 1
        return result
    
    def build_centroids(self, cluster_lists, segment_vectors):
        centroids = []
        counter = 0
        for clus in cluster_lists:
            total_v = numpy.zeros(len(segment_vectors[0]))
            for v in clus:
                total_v += segment_vectors[v]
            total_v = self.norm_vec(total_v)
            centroids.append(total_v)
            counter += 1
        return centroids
    
    def norm_vec(self, vec):
        mag = numpy.linalg.norm(vec)
        if mag == 0:
            return vec
        else:
            return(vec / mag)

    def handle_tile_element_click(self, dataset, doc_name, active_row_index):
        text_to_find = dataset["val"]
        self.clear_table_highlighting()
        self.highlight_matching_text(text_to_find)       
        
    def render_content(self):
        cdata = self.get_pipe_value(self.cluster_data)
        self.clusterer = cdata["clusterer"]
        cfdist = cdata["cf_dist"]
        dfdist = cdata["df_dist"]
        reduced_vocab = cdata["reduced_vocab"]
        seg_vectors = cdata["sample_array"]
        dendro = cdata["dendrogram"]
        clusters = dendro[-1 * (self.number_of_clusters)]
        self.starting_centroids = numpy.array(self.build_centroids(clusters, seg_vectors))
        self.dm("centroids built")
        
        self.clusterer = sklearn.cluster.KMeans(init=self.starting_centroids, n_clusters=self.number_of_clusters)
        self.clusterer.fit(seg_vectors)
        k_means_labels = self.clusterer.labels_
        self.centroids = self.clusterer.cluster_centers_
        the_html = ""
        cluster_sizes = [list(k_means_labels).count(n) for n in range(len(k_means_labels))]
        new_clusters = [[] for i in range(len(self.centroids))]
        for i, l in enumerate(k_means_labels):
            new_clusters[l - 1].append(i)

        for i in range(self.number_of_clusters):
            ctitle = "Cluster " + str(i + 1) + " " + str(cluster_sizes[i])
            the_html += self.build_html_table_from_data_list(
                self.top_words_from_centroid(reduced_vocab, cfdist, dfdist, i, to_print=self.number_to_show, min_oc=self.minimum_occurrences), 
                click_type="element-clickable", title=ctitle)
        self.new_cluster_data = {"clusterer": self.clusterer, "reduced_vocab": reduced_vocab, 
                                 "current_clustering": new_clusters, "sample_array": seg_vectors,
                                 "cf_dist": cfdist, "df_dist": dfdist}
        return the_html

