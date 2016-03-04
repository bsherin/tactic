@user_tile
class ClusterViewer(TileBase):
    category = "clustering"

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.clusterer = None
        self.number_of_clusters = 5
        self.palette_name = "Paired"
        return

    @property
    def options(self):
        return  [
        {"name": "cluster_data", "type": "pipe_select"},
        {"name": "number_of_clusters", "type": "int"},
        {"name": "code_into_column", "type": "boolean"},
        {"name": "code_destination", "type": "column_select"},
        {"name": "palette_name", "type": "palette_select"}
    ]

    def top_words_from_centroid(self, vocab_list, n, to_print=10):
        result = [["word", "weight"]]
        sc = list(numpy.argsort(self.centroids[n]))
        sc.reverse()
        for i in range(to_print):
            result.append([vocab_list[sc[i]], round(self.centroids[n][sc[i]], 4)])
        return result

    def render_content(self):
        cdata = self.get_pipe_value(self.cluster_data)
        self.clusterer = cdata["clusterer"]
        reduced_vocab = cdata["reduced_vocab"]
        row_vectors_dict = cdata["row_vectors_dict"]
        self.clusterer.update_clusters(self.number_of_clusters)
        self.centroids = self.clusterer._centroids

        the_html = ""

        for i in range(self.number_of_clusters):
            ctitle = "Cluster " + str(i + 1)
            the_html += self.build_html_table_from_data_list(self.top_words_from_centroid(reduced_vocab, i, 10), title=ctitle)

        self.autocodes_dict = {}
        if self.code_into_column:
            cmapper = ColorMapper(1, self.number_of_clusters, self.palette_name)

            for (dname, vec_list) in row_vectors_dict.items():
                r = 0
                self.autocodes_dict[dname] = []
                for vec in vec_list:
                    autocode = self.clusterer.classify(vec)
                    self.autocodes_dict[dname].append(autocode)
                    self.set_cell(dname, r, self.code_destination, str(autocode + 1), cellchange=False)
                    self.set_cell_background(dname, r, self.code_destination, cmapper.color_from_val(autocode + 1))
                    r += 1

        return the_html