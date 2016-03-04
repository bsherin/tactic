@user_tile
class SimilarityMatrix_skl(TileBase, MplFigure):
    category = "plot"

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.palette_name = "Paired"
        self.reassign = False
        self.save_attrs += ["cluster_data", "array"]
        return

    @property
    def options(self):
        return  [
        {"name": "cluster_data", "type": "pipe_select"},
        {"name": "palette_name", "type": "palette_select"}
    ]

    def cosine_distance(self, u, v):
        return numpy.dot(u, v) / (numpy.sqrt(numpy.dot(u, u)) * numpy.sqrt(numpy.dot(v, v)))
    
    def compute_similarity_matrix(self, clustered_vectors, metric):
        all_vectors = []
        for cluster in clustered_vectors:
            all_vectors += cluster
            
        vec_matrix = numpy.array(all_vectors)
        sm = numpy.dot(vec_matrix, vec_matrix.transpose())
        return sm
    
    def build_clustered_vectors(self, cluster_lists, segment_vectors):
        centroids = []
        counter = 0
        result = []
        for clus in cluster_lists:
            l = []
            for v in clus:
                l.append(segment_vectors[v])
            result.append(l)
        return result
    
    def draw_plot(self):
        MplFigure.__init__(self)
        self.dialogs = []
        the_array = self.array
        (nrows, ncols) = the_array.shape
        ax = self.add_subplot(111)
        cax = ax.imshow(the_array, cmap=get_cmap(self.palette_name), aspect="auto", interpolation='nearest')

        ind = numpy.arange(ncols)
        ax.set_xticks(self.tick_spots)
        ax.get_xaxis().set_ticklabels(self.tick_labels)

        ind = numpy.arange(nrows)

        ax.set_yticks(self.tick_spots)
        ax.get_yaxis().set_ticklabels(self.tick_labels)

        cbar = self.colorbar(cax)
        self.set_facecolor("white")
        self.tight_layout()
        return
    
    def render_content(self):
        cdata = self.get_pipe_value(self.cluster_data)
        self.clusterer = cdata["clusterer"]
        seg_vectors = cdata["sample_array"]
        clusters = cdata["current_clustering"]
        self.clustered_vectors = self.build_clustered_vectors(clusters, seg_vectors)
        cluster_sizes = [len(clus) for clus in clusters]
        
        self.display_message("computing similarity matrix")
        sm = self.compute_similarity_matrix(self.clustered_vectors, metric=self.cosine_distance)
        
        self.tick_spots = [0]
        running_total = 0
        for size in cluster_sizes:
            running_total += size
            self.tick_spots.append(running_total)
        self.array = sm
        self.tick_labels = [str(spot) for spot in self.tick_spots]
        self.draw_plot()
        return self.create_figure_html()