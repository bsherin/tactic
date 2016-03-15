__author__ = 'bls910'

import numpy
import copy

sklearn_available = True

try:
    from sklearn import metrics
except ImportError:
    sklearn_available = False

distance_metric_dict = {}
cluster_metric_dict = {}
single_cluster_metric_dict = {}

gamma = .5

def normalize(vec):
    mag = numpy.vdot(vec, vec)
    if mag == 0:
        return vec
    else:
        return(vec / (numpy.sqrt(mag)))


def distance_metric(dm):
    """Decorator function used to register each distance metric in distance_metric_dict."""

    distance_metric_dict[dm.__name__] = dm
    return dm

def cluster_metric(cm):
    """Decorator function used to register each distance metric in distance_metric_dict."""

    cluster_metric_dict[cm.__name__] = cm
    return cm

def single_cluster_metric(cm):
    """Decorator function used to register each distance metric in distance_metric_dict."""

    single_cluster_metric_dict[cm.__name__] = cm
    return cm

@distance_metric
def euclidean_distance(u, v):
    """
    Returns the euclidean distance between vectors u and v. This is equivalent
    to the length of the vector (u - v).
    """
    diff = 1.0 * u - 1.0 * v

    return numpy.sqrt(numpy.dot(diff, diff))

@distance_metric
def cosine_distance(u, v):
    """
    Returns the cosine of the angle between vectors v and u. This is equal to
    u.v / |u||v|.
    """
    return numpy.dot(u, v) / (numpy.sqrt(numpy.dot(u, u)) * numpy.sqrt(numpy.dot(v, v)))

@distance_metric
def normalize_first_euclidean_distance(u, v):
    return euclidean_distance(normalize(u), normalize(v))

def get_cluster_centroids(clustered_vectors):
    # Compute the cluster centroids
    centroids = []
    for cluster in clustered_vectors:
        centroid = numpy.array(copy.deepcopy(cluster[0]))
        for vector in cluster[1:]:
            centroid += vector
        centroid = 1.0 * centroid / len(cluster)
        centroids.append(centroid)
    return centroids

def get_overall_average(clustered_vectors, metric=euclidean_distance):
    all_vectors = []
    for cluster in clustered_vectors:
        all_vectors += cluster

    v_tot = numpy.array(copy.deepcopy(all_vectors[0]))
    for vector in all_vectors[1:]:
        v_tot = v_tot + numpy.array(vector)

    v_avg = 1.0 * v_tot / len(all_vectors)
    return v_avg

@cluster_metric
def tss(clustered_vectors, metric=euclidean_distance, param=None):

    v_avg = get_overall_average(clustered_vectors, metric)
    all_vectors = []
    for cluster in clustered_vectors:
        all_vectors += cluster
    tss = 0
    for vector in all_vectors:
        dist = metric(vector, v_avg)
        tss = tss + dist * dist
    return tss, []

def compute_bss_indirectly(clustered_vectors, metric=euclidean_distance, param=None):
    the_rss, _ = rss(clustered_vectors, metric)
    the_tss, _ = tss(clustered_vectors, metric)
    the_bss = the_tss - the_rss
    return bss, []

@cluster_metric
def bss(clustered_vectors, metric=euclidean_distance, param=None):

    # Find the size of each cluster
    cluster_sizes = [len(cluster) for cluster in clustered_vectors]

    # Compute the cluster centroids
    centroids = get_cluster_centroids(clustered_vectors)

    # Find the average centroid. (which is just the overall average of all vectors)
    avg_centroid = get_overall_average(clustered_vectors, metric)

    # compute the result
    bss = 0
    for i, centroid in enumerate(centroids):
        dist = metric(centroid, avg_centroid)
        bss = bss + cluster_sizes[i] * dist * dist
    return bss, []

@cluster_metric
@single_cluster_metric
def rss(clustered_vectors, metric=euclidean_distance, param=None):
    the_rss = 0
    centroids = get_cluster_centroids(clustered_vectors)
    cluster_rss_list = []
    for i, cluster in enumerate(clustered_vectors):
        cluster_rss = 0
        for vector in cluster:
            dist = metric(vector, centroids[i])
            cluster_rss += dist * dist
        the_rss = the_rss + cluster_rss
        cluster_rss_list.append(cluster_rss / len(cluster))
    return the_rss, cluster_rss_list

@cluster_metric
def aic(clustered_vectors, metric=euclidean_distance, param=None):
    M = len(clustered_vectors[0][0])
    n = len(clustered_vectors)
    the_rss, _ = rss(clustered_vectors, metric)
    the_aic = the_rss + 2 * M * n
    return the_aic, []

@cluster_metric
def bic(clustered_vectors, metric=euclidean_distance, param=None):
    M = len(clustered_vectors[0][0])
    n = len(clustered_vectors)
    all_vectors = []
    for cluster in clustered_vectors:
        all_vectors += cluster
    data_points = len(all_vectors)
    the_rss, _ = rss(clustered_vectors, metric)
    the_bic = the_rss + M * n * numpy.log(data_points)
    return the_bic, []

@cluster_metric
def tuneable_aic(clustered_vectors, metric=euclidean_distance, param=2.0):
    M = len(clustered_vectors[0][0])
    n = len(clustered_vectors)
    the_rss, _ = rss(clustered_vectors, metric=euclidean_distance)
    the_aic = the_rss + param * M * n
    return the_aic, []

# Compute list of pseudo-fs
# pseudo-f = (BSS / (num_clusters - 1)) / (RSS / (num_observations - num_clusters)))
@cluster_metric
def pseudo_f(clustered_vectors, metric=euclidean_distance, param=None):
    num_clusters = len(clustered_vectors)
    num_obs = 0
    for cluster in clustered_vectors:
        num_obs += len(cluster)
    if (num_clusters == 1) or (num_clusters == num_obs):
        return 0
    the_bss, _ = bss(clustered_vectors, metric)
    the_rss, _ = rss(clustered_vectors, metric)
    pseudo_f = (the_bss / (num_clusters - 1)) / (the_rss / (num_obs - num_clusters))
    return pseudo_f, []

def compute_pseudo_f_indirecly(clustered_vectors, metric=euclidean_distance, param=None):
    num_clusters = len(clustered_vectors)
    num_obs = 0
    for cluster in clustered_vectors:
        num_obs += len(cluster)
    if (num_clusters == 1) or (num_clusters == num_obs):
        return 0
    the_bss, _ = compute_bss_indirectly(clustered_vectors, metric)
    the_rss, _ = rss(clustered_vectors, metric)
    the_pseudo_f = (the_bss / (num_clusters - 1)) / (the_rss / (num_obs - num_clusters))
    return the_pseudo_f, []

def average_distance_of_vector_to_set(the_v, the_set, metric=euclidean_distance, param=None):
    total_dist = 0
    if len(the_set) == 0:
        return 0
    for v in the_set:
        total_dist += metric(the_v, v)
    return total_dist / len(the_set)


def find_nearest_neighbor_distance(the_v, clusters, metric=euclidean_distance):
    current_low_distance = None
    current_neighbor = None
    for clus in clusters:
        dist = average_distance_of_vector_to_set(the_v, clus, metric)
        if (current_low_distance == None) or (dist < current_low_distance):
            current_low_distance = dist
    return current_low_distance

def compute_sk_silhouette(clustered_vectors, metric=euclidean_distance, param=None):
    # This uses the silhouette score function from sklearn. In this version
    # I compute the distance matrix and pass that as an input.
    if len(clustered_vectors) <= 1:
        return 0, []
    labels = []
    num_obs = 0
    for label, cluster in enumerate(clustered_vectors):
        num_obs += len(cluster)
        for v in cluster:
            labels.append(label)
    label_array = numpy.array(labels)

    dm = compute_similarity_matrix(clustered_vectors, metric)

    s_score = metrics.silhouette_score(dm, label_array, metric="precomputed")
    return s_score, []

@cluster_metric
def skl_silhouette(clustered_vectors, metric=euclidean_distance, param=None):
    # This uses the silhouette score function from sklearn. In this version, I allow it to
    # compute the differences
    if len(clustered_vectors) <= 1:
        return 0, []
    labels = []
    num_obs = 0
    all_vectors = []
    for label, cluster in enumerate(clustered_vectors):
        num_obs += len(cluster)
        for v in cluster:
            labels.append(label)
            all_vectors.append(v)
    label_array = numpy.array(labels)

    fm = numpy.zeros([num_obs, len(all_vectors[0])])

    for i in range(num_obs):
        fm[i,:] = all_vectors[i]

    s_score = metrics.silhouette_score(fm, label_array, metric=metric)
    return s_score, []

def get_cluster_silhouette(cluster, other_clusters, metric):
    # my version, built from scratch
    cluster_s = 0
    for j in range(len(cluster)):
        v = cluster[j]
        the_set = cluster[:j] + cluster[j+1:]
        a = average_distance_of_vector_to_set(v, the_set, metric)
        b = find_nearest_neighbor_distance(v, other_clusters, metric)
        s_score = (b - a) / max([a, b])
        cluster_s += s_score
    return cluster_s / len(cluster)

@cluster_metric
@single_cluster_metric
def silhouette(clustered_vectors, metric=euclidean_distance, param=None):
    # This is my own version, built from scratch

    num_obs = 0
    if len(clustered_vectors) <= 1:
        return 0, []
    centroids = get_cluster_centroids(clustered_vectors)
    for cluster in clustered_vectors:
        num_obs += len(cluster)

    total_s = 0
    print "working with ", len(clustered_vectors), " clusters"
    cluster_s_list = []
    if len(clustered_vectors) <= 1:
        return 0, []
    for i in range(len(clustered_vectors)):
        print "Doing Cluster ", i
        cluster = clustered_vectors[i]
        other_clusters = clustered_vectors[:i] + clustered_vectors[i+1:]
        cluster_s = get_cluster_silhouette(cluster, other_clusters, metric)
        total_s += cluster_s * len(cluster)
        cluster_s_list.append(cluster_s)
    avg_s = total_s / num_obs
    return avg_s, cluster_s_list

def compute_similarity_matrix(clustered_vectors, metric=cosine_distance):
    all_vectors = []
    for cluster in clustered_vectors:
        all_vectors += cluster
    n = len(all_vectors)
    sm = numpy.zeros([n, n])

    for r in range(n):
        for c in range(r, n):
            cd = metric(all_vectors[r], all_vectors[c])
            sm[r, c] = cd
            sm[c, r] = cd
    return sm

def main():
    clustered_vectors = [[numpy.array([ 0.92428227,  0.7738934 ]), numpy.array([ 0.87636597,  0.93316011])],
                         [numpy.array([ 0.19926005,  0.62370866]), numpy.array([ 0.25443179,  0.98528374]), numpy.array([ 0.28443179,  0.75528374])],
                         [numpy.array([ 0.97519546,  0.30069026]), numpy.array([ 0.69871358,  0.02362695])],
                         [numpy.array([ 0.45, 0.337]), numpy.array([0.72,  0.05])]]

    # clustered_vectors = [[numpy.array([1.0]), numpy.array([2.0]), numpy.array([3.0])], [numpy.array([4.0]), numpy.array([5.0]), numpy.array([6.0]), numpy.array([7.0])], [numpy.array([8.0]), numpy.array([9.0])]]

    # clustered_vectors = [[[1], [2]], [[4], [5]]]

    print "RSS is ", rss(clustered_vectors)
    print "TSS is", tss(clustered_vectors)
    print "BSS is ", bss(clustered_vectors)
    print "BSS indirect is ", compute_bss_indirectly(clustered_vectors)
    print "pseudo-f is", pseudo_f(clustered_vectors)
    print "pseudo-f indirect is ", compute_pseudo_f_indirecly(clustered_vectors)
    print "average silhouette is ", silhouette(clustered_vectors)
    print "average sk silhouette is ", compute_sk_silhouette(clustered_vectors)
    print "average sk2 silhouette is ", silhouette(clustered_vectors)
    print "AIC is ", aic(clustered_vectors)
    print "Tuneable AIC is ", tuneable_aic(clustered_vectors, param=4)
    print "similarity matrix is ", compute_similarity_matrix(clustered_vectors)


if __name__ == '__main__':
    main()
