# Natural Language Toolkit: Group Average Agglomerative Clusterer
#
# Copyright (C) 2001-2009 NLTK Project
# Author: Trevor Cohn <tacohn@cs.mu.oz.au>
# URL: <http://www.nltk.org/>
# For license information, see LICENSE.TXT

from myclusterutil import VectorSpaceClusterer, Dendogram, normalize, euclidean_distance
from nltk.probability import DictionaryProbDist
import numpy
import copy

class CentroidClusterer(VectorSpaceClusterer):
    def __init__(self, vector_names = None, num_clusters=1, normalise=True, svd_dimensions=None):
        VectorSpaceClusterer.__init__(self, normalise, svd_dimensions)
        self._num_clusters = num_clusters
        self._dendogram = None
        self._groups_values = None
        self._names = vector_names
        self._name_dendogram = None

    def cluster(self, vectors, assign_clusters=False, trace=False):
        # stores the merge order
        self._dendogram = Dendogram([numpy.array(vector, numpy.float64) for vector in vectors])
        if self._names:
            self._name_dendogram = Dendogram(self._names)
        self._vectors_to_cluster = vectors
        return VectorSpaceClusterer.cluster(self, vectors, assign_clusters, trace)

    def cluster_vectorspace(self, vectors, trace=False):
        # create a cluster for each vector
        clusters = [[vector] for vector in vectors]

        # This copy module and function is from the python standard library
        vector_sum = copy.copy(vectors)
        norm_sum = [normalize(vsum) for vsum in vector_sum]

        while len(clusters) > max(self._num_clusters, 1):
            # find the two best candidate clusters to merge
            best = None
            
            for i in range(len(clusters)):
                for j in range(i + 1, len(clusters)):
                    sim = numpy.dot(norm_sum[i], norm_sum[j])
                    if not best or sim > best[0]:
                        best = (sim, i, j)

            # merge them and replace in cluster list
            i, j = best[1:]
            csum = clusters[i] + clusters[j]
            if trace:
                print 'merging %d and %d' % (i, j)
                # print len(clusters)

            clusters[i] = csum
            del clusters[j]
            vector_sum[i] = vector_sum[i] + vector_sum[j]
            norm_sum[i] = normalize(vector_sum[i])
            del vector_sum[j]
            del norm_sum[j]
            self._dendogram.merge(i, j)
            if self._names:
                self._name_dendogram.merge(i, j)
            if len(clusters) % 50 == 0:
                print len(clusters)
        self.update_clusters(self._num_clusters)

    def update_clusters(self, num_clusters):
        clusters = self._dendogram.groups(num_clusters)
        # print clusters
        self._centroids = []
        for cluster in clusters:
            assert len(cluster) > 0
            if self._should_normalise:
                centroid = self._normalise(cluster[0])
            else:
                centroid = numpy.array(cluster[0])
            for vector in cluster[1:]:
                if self._should_normalise:
                    centroid += self._normalise(vector)
                else:
                    centroid += vector
            centroid /= float(len(cluster))  # was this supposed to be some sort of normalizing?
            if self._should_normalise:
                self._centroids.append(normalize(centroid))
            else:
                self._centroids.append(centroid)
        self._num_clusters = len(self._centroids)
        
    def compute_rss(self, num_clusters):
        clusters = self._dendogram.groups(num_clusters)
        rss = 0
        for cluster in clusters:
            if self._should_normalise:
                centroid = self._normalise(cluster[0])
            else:
                centroid = numpy.array(cluster[0])
            for vector in cluster[1:]:
                if self._should_normalise:
                    centroid += self._normalise(vector)
                else:
                    centroid += vector
            centroid /= float(len(cluster))
            for vector in cluster:
                diff = vector - centroid
                rss = rss + numpy.sqrt(numpy.vdot(diff, diff))
        return rss

    def classify_vectorspace(self, vector):
        best = None
        for i in range(self._num_clusters):
            centroid = self._centroids[i]
            sim = self._similarity(vector, centroid)
            if not best or sim > best[0]:
                best = (sim, i)
        return best[1]

    def dendogram(self):
        """
        @return: The dendogram representing the current clustering
        @rtype:  Dendogram
        """
        return self._dendogram
    
    def name_dendogram(self):
        return self._name_dendogram

    def num_clusters(self):
        return self._num_clusters

    def _similarity(self, v1, v2):
        return (numpy.dot(v1, v2))
    def __repr__(self):
        return '<Centroid Clusterer n=%d>' % self._num_clusters
        
class EuclideanCentroidClusterer(CentroidClusterer):
    # This subclass of CentroidClusterer uses Euclidean distance to determine distances between clusters.
        
    def cluster_vectorspace(self, vectors, trace=False):
        # create a cluster for each vector
        clusters = [[vector] for vector in vectors]
        cluster_sizes = [1 for vector in vectors]

        # This copy module and function is from the python standard library
        vector_sum = copy.copy(vectors)
        norm_sum = copy.copy(vectors)

        while len(clusters) > max(self._num_clusters, 1):
            # find the two best candidate clusters to merge
            best = None
            for i in range(len(clusters)):
                for j in range(i + 1, len(clusters)):
                    sim = euclidean_distance(norm_sum[i], norm_sum[j])
                    if not best or sim < best[0]:
                        best = (sim, i, j)

            # merge them and replace in cluster list
            i, j = best[1:]
            csum = clusters[i] + clusters[j]
            clusters[i] = csum
            del clusters[j]
            vector_sum[i] = vector_sum[i] + vector_sum[j]
            cluster_sizes[i] = cluster_sizes[i] + 1
            norm_sum[i] = vector_sum[i] / cluster_sizes[i]
            del vector_sum[j]
            del norm_sum[j]
            del cluster_sizes[j]
            self._dendogram.merge(i, j)
            if self._names:
                self._name_dendogram.merge(i, j)
            if len(clusters) % 50 == 0:
                print len(clusters)
            if trace:
                print 'merged %d and %d' % (i, j)
                print self._name_dendogram.groups(len(clusters))
        self.update_clusters(self._num_clusters)
        
    def update_clusters(self, num_clusters):
        clusters = self._dendogram.groups(num_clusters)
        self._centroids = []
        for cluster in clusters:
            assert len(cluster) > 0
            centroid = numpy.array(cluster[0])
            for vector in cluster[1:]:
                centroid += vector
            centroid /= float(len(cluster))
            self._centroids.append(centroid)
        self._num_clusters = len(self._centroids)
    
class OptCentroidClusterer(VectorSpaceClusterer):
    def __init__(self, vector_names = None, num_clusters=1, normalise=True, svd_dimensions=None):
        VectorSpaceClusterer.__init__(self, normalise, svd_dimensions)
        self._num_clusters = num_clusters
        self._dendogram = None
        self._groups_values = None
        self._names = vector_names
        self._name_dendogram = None
        self._reassigned_clusters = {}

    def array_max(self, ar):
        for i in range(ar.shape[0]):
            ar[i, i] = -9e9
        location = ar.argmax()
        r = int(round (location / ar.shape[1]))
        c = int(numpy.mod(location, ar.shape[1]))
        return [r, c]
        
    def cluster(self, vectors, assign_clusters=False, trace=False):
        # stores the merge order
        self._dendogram = Dendogram(
            [numpy.array(vector, numpy.float64) for vector in vectors])
        if self._names:
            self._name_dendogram = Dendogram(self._names)
        self._vectors_to_cluster = vectors
        return VectorSpaceClusterer.cluster(self, vectors, assign_clusters, trace)

    def cluster_vectorspace(self, vectors, trace=False):
        # create a cluster for each vector
        clusters = [[vector] for vector in vectors]

        # This copy module and function is from the python standard library
        vector_sum = copy.copy(vectors)
        norm_sum = [normalize(vsum) for vsum in vector_sum]

        cluster_matrix = numpy.zeros([len(vectors[0]), len(vectors)])
        i = 0
        for v in norm_sum:
            cluster_matrix[:, i] = v
            i = i + 1

        dot_store_matrix = numpy.dot(cluster_matrix.transpose(), cluster_matrix)

        while len(clusters) > max(self._num_clusters, 1):
            # find the two best candidate clusters to merge
            max_sim = self.array_max(dot_store_matrix)
            i = max_sim[0]
            j = max_sim[1]
            if i == j:
                print "got stuck when at " + str(len(clusters)) + " clusters"
                break;
            vsum = clusters[i] + clusters[j]
            if trace:
                print 'merging %d and %d' % (i, j)

            clusters[i] = vsum
            del clusters[j]
            vector_sum[i] = vector_sum[i] + vector_sum[j]
            norm_sum[i] = normalize(vector_sum[i])
            cluster_matrix[:, i] = norm_sum[i]
            del vector_sum[j]
            del norm_sum[j]
            cluster_matrix = numpy.delete(cluster_matrix, j, 1)

            dot_store_matrix = numpy.dot(cluster_matrix.transpose(), cluster_matrix)

            self._dendogram.merge(i, j)
            if self._names:
                self._name_dendogram.merge(i, j)
            if len(clusters) % 50 == 0:
                print len(clusters)
        self.update_clusters(len(clusters))

    def update_clusters(self, num_clusters):
        print "entering update clusters with num_clusters = " + str(num_clusters)
        clusters = self._dendogram.groups(num_clusters)
        self._centroids = []
        for cluster in clusters:
            assert len(cluster) > 0
            if self._should_normalise:
                centroid = self._normalise(cluster[0])
            else:
                centroid = numpy.array(cluster[0])
            for vector in cluster[1:]:
                if self._should_normalise:
                    centroid += self._normalise(vector)
                else:
                    centroid += vector
            # centroid /= float(len(cluster))  # was this supposed to be some sort of normalizing?
            norm_centroid = normalize(centroid)
            self._centroids.append(norm_centroid)
        self._num_clusters = len(self._centroids)
        
    def compute_rss(self, num_clusters):
        clusters = self._dendogram.groups(num_clusters)
        rss = 0
        for cluster in clusters:
            if self._should_normalise:
                centroid = self._normalise(cluster[0])
            else:
                centroid = numpy.array(cluster[0])
            for vector in cluster[1:]:
                if self._should_normalise:
                    centroid += self._normalise(vector)
                else:
                    centroid += vector
            if self._should_normalise:
                centroid = self._normalise(centroid)
            for vector in cluster:
                diff = vector - centroid
                rss = rss + numpy.sqrt(numpy.vdot(diff, diff))
        return rss

    def get_iteratively_reassigned_clusters(self, num_clusters, max_iterations=100, saveit=True):
        if num_clusters in self._reassigned_clusters:
            return self._reassigned_clusters[num_clusters]
        self.update_clusters(num_clusters)
        new_centroids = self._centroids
        clusters = self._dendogram.groups(num_clusters)

        for iter in range(max_iterations):
            number_reassigned = 0
            new_clusters = [[] for i in range(len(self._centroids))]
            for cluster_number, cluster in enumerate(clusters):
                for vec in cluster:
                    dps = [numpy.dot(numpy.transpose(centroid), vec) for centroid in new_centroids]
                    new_cluster_index = dps.index(max(dps))
                    new_clusters[new_cluster_index].append(vec)
                    if new_cluster_index != cluster_number:
                        number_reassigned += 1
            new_centroids = []
            for cluster in new_clusters:
                assert len(cluster) > 0
                if self._should_normalise:
                    centroid = self._normalise(cluster[0])
                else:
                    centroid = numpy.array(cluster[0])
                for vector in cluster[1:]:
                    if self._should_normalise:
                        centroid += self._normalise(vector)
                    else:
                        centroid += vector
                # centroid /= float(len(cluster))  # was this supposed to be some sort of normalizing?
                norm_centroid = normalize(centroid)
                new_centroids.append(norm_centroid)
            print [len(cluster) for cluster in new_clusters]
            print "Number reassigned = %i" % number_reassigned
            if number_reassigned == 0:
                print "Stable after %i iterations" % iter
                break;
            clusters = new_clusters

            if saveit:
                self._reassigned_clusters[num_clusters] = (new_centroids,[len(cluster) for cluster in new_clusters], clusters)

        return (new_centroids,[len(cluster) for cluster in new_clusters], clusters)

    def classify_vectorspace(self, vector):
        best = None
        for i in range(self._num_clusters):
            centroid = self._centroids[i]
            sim = self._similarity(vector, centroid)
            if not best or sim > best[0]:
                best = (sim, i)
        return best[1]

    def dendogram(self):
        """
        @return: The dendogram representing the current clustering
        @rtype:  Dendogram
        """
        return self._dendogram
    
    def name_dendogram(self):
        return self._name_dendogram

    def num_clusters(self):
        return self._num_clusters

    def _similarity(self, v1, v2):
        return (numpy.dot(v1, v2))
    def __repr__(self):
        return '<Opt Centroid Clusterer n=%d>' % self._num_clusters

class GAAClusterer(VectorSpaceClusterer):
    """
    The Group Average Agglomerative starts with each of the N vectors as singleton
    clusters. It then iteratively merges pairs of clusters which have the
    closest centroids.  This continues until there is only one cluster. The
    order of merges gives rise to a dendogram: a tree with the earlier merges
    lower than later merges. The membership of a given number of clusters c, 1
    <= c <= N, can be found by cutting the dendogram at depth c.

    This clusterer uses the cosine similarity metric only, which allows for
    efficient speed-up in the clustering process. 
    """

    def __init__(self, num_clusters=1, normalise=True, svd_dimensions=None):
        VectorSpaceClusterer.__init__(self, normalise, svd_dimensions)
        self._num_clusters = num_clusters
        self._dendogram = None
        self._groups_values = None

    def cluster(self, vectors, assign_clusters=False, trace=False):
        # stores the merge order
        self._dendogram = Dendogram(
            [numpy.array(vector, numpy.float64) for vector in vectors])
        return VectorSpaceClusterer.cluster(self, vectors, assign_clusters, trace)

    def cluster_vectorspace(self, vectors, trace=False):
        # create a cluster for each vector
        clusters = [[vector] for vector in vectors]

        # the sum vectors
        vector_sum = copy.copy(vectors)

        while len(clusters) > max(self._num_clusters, 1):
            # find the two best candidate clusters to merge, based on their
            # S(union c_i, c_j)
            best = None
            for i in range(len(clusters)):
                for j in range(i + 1, len(clusters)):
                    sim = self._average_similarity(
                                vector_sum[i], len(clusters[i]),
                                vector_sum[j], len(clusters[j]))
                    if not best or sim > best[0]:
                        best = (sim, i, j)

            # merge them and replace in cluster list
            i, j = best[1:]
            vsum = clusters[i] + clusters[j]
            if trace: print 'merging %d and %d' % (i, j)

            clusters[i] = vsum
            del clusters[j]
            vector_sum[i] = vector_sum[i] + vector_sum[j]
            del vector_sum[j]

            self._dendogram.merge(i, j)

        self.update_clusters(self._num_clusters)

    def update_clusters(self, num_clusters):
        clusters = self._dendogram.groups(num_clusters)
        self._centroids = []
        for cluster in clusters:
            assert len(cluster) > 0
            if self._should_normalise:
                centroid = self._normalise(cluster[0])
            else:
                centroid = numpy.array(cluster[0])
            for vector in cluster[1:]:
                if self._should_normalise:
                    centroid += self._normalise(vector)
                else:
                    centroid += vector
            centroid /= float(len(cluster))
            self._centroids.append(centroid)
        self._num_clusters = len(self._centroids)
        
    def compute_rss(self, num_clusters):
        clusters = self._dendogram.groups(num_clusters)
        rss = 0
        for cluster in clusters:
            if self._should_normalise:
                centroid = self._normalise(cluster[0])
            else:
                centroid = numpy.array(cluster[0])
            for vector in cluster[1:]:
                if self._should_normalise:
                    centroid += self._normalise(vector)
                else:
                    centroid += vector
            centroid = centroid / float(len(cluster))
            for vector in cluster:
                diff = vector - centroid
                rss = rss + numpy.sqrt(numpy.vdot(diff, diff))
        return rss

    def classify_vectorspace(self, vector):
        best = None
        for i in range(self._num_clusters):
            centroid = self._centroids[i]
            sim = self._average_similarity(vector, 1, centroid, 1)
            if not best or sim > best[0]:
                best = (sim, i)
        return best[1]

    def dendogram(self):
        """
        @return: The dendogram representing the current clustering
        @rtype:  Dendogram
        """
        return self._dendogram

    def num_clusters(self):
        return self._num_clusters

    def _average_similarity(self, v1, l1, v2, l2):
        asum = v1 + v2
        length = l1 + l2
        return (numpy.dot(asum, asum) - length) / (length * (length - 1))

    def __repr__(self):
        return '<GroupAverageAgglomerative Clusterer n=%d>' % self._num_clusters

clusterer_dict = {"CentroidClusterer" : CentroidClusterer, "OptCentroidClusterer" : OptCentroidClusterer ,"GAAClusterer" : GAAClusterer}

class EMClusterer(VectorSpaceClusterer):
    """
    The Gaussian EM clusterer models the vectors as being produced by
    a mixture of k Gaussian sources. The parameters of these sources
    (prior probability, mean and covariance matrix) are then found to
    maximise the likelihood of the given data. This is done with the
    expectation maximisation algorithm. It starts with k arbitrarily
    chosen means, priors and covariance matrices. It then calculates
    the membership probabilities for each vector in each of the
    clusters; this is the 'E' step. The cluster parameters are then
    updated in the 'M' step using the maximum likelihood estimate from
    the cluster membership probabilities. This process continues until
    the likelihood of the data does not significantly increase.
    """

    def __init__(self, initial_means, priors=None, covariance_matrices=None,
                       conv_threshold=1e-6, bias=0.1, normalise=False,
                       svd_dimensions=None):
        """
        Creates an EM clusterer with the given starting parameters,
        convergence threshold and vector mangling parameters.

        @param  initial_means: the means of the gaussian cluster centers
        @type   initial_means: [seq of] numpy array or seq of SparseArray
        @param  priors: the prior probability for each cluster
        @type   priors: numpy array or seq of float
        @param  covariance_matrices: the covariance matrix for each cluster
        @type   covariance_matrices: [seq of] numpy array 
        @param  conv_threshold: maximum change in likelihood before deemed
                    convergent
        @type   conv_threshold: int or float
        @param  bias: variance bias used to ensure non-singular covariance
                      matrices
        @type   bias: float
        @param  normalise:  should vectors be normalised to length 1
        @type   normalise:  boolean
        @param  svd_dimensions: number of dimensions to use in reducing vector
                               dimensionsionality with SVD
        @type   svd_dimensions: int 
        """
        VectorSpaceClusterer.__init__(self, normalise, svd_dimensions)
        self._means = numpy.array(initial_means, numpy.float64)
        self._num_clusters = len(initial_means)
        self._conv_threshold = conv_threshold
        self._covariance_matrices = covariance_matrices
        self._priors = priors
        self._bias = bias

    def num_clusters(self):
        return self._num_clusters
        
    def cluster_vectorspace(self, vectors, trace=False):
        assert len(vectors) > 0

        # set the parameters to initial values
        dimensions = len(vectors[0])
        means = self._means
        priors = self._priors
        if not priors:
            priors = self._priors = numpy.ones(self._num_clusters, numpy.float64) / self._num_clusters
        covariances = self._covariance_matrices 
        if not covariances:
            covariances = self._covariance_matrices = \
                [ numpy.identity(dimensions, numpy.float64) 
                  for i in range(self._num_clusters) ]
            
        # do the E and M steps until the likelihood plateaus
        det_covariances = []
        inv_covariances = []
        for j in range(self._num_clusters):
            det_covariances += [numpy.linalg.det(covariances[j])]
            inv_covariances += [numpy.linalg.inv(covariances[j])]
        lastl = self._loglikelihood(vectors, priors, means, covariances, det_covariances, inv_covariances)
        converged = False
        counter = 0

        while not converged:
            if numpy.mod(counter, 5) == 0:
                print 'iteration; loglikelihood', lastl
            # E-step, calculate hidden variables, h[i,j]
            h = numpy.zeros((len(vectors), self._num_clusters),
                numpy.float64)


            for i in range(len(vectors)):
                for j in range(self._num_clusters):
                    h[i,j] = priors[j] * self._gaussian(means[j],
                                               covariances[j], vectors[i], det_covariances[j], inv_covariances[j])
                h[i,:] /= sum(h[i,:])

            # M-step, update parameters - cvm, p, mean
            for j in range(self._num_clusters):
                covariance_before = covariances[j]
                new_covariance = numpy.zeros((dimensions, dimensions),
                            numpy.float64)
                new_mean = numpy.zeros(dimensions, numpy.float64)
                sum_hj = 0.0
                for i in range(len(vectors)):
                    delta = vectors[i] - means[j]
                    new_covariance += h[i,j] * \
                        numpy.multiply.outer(delta, delta)
                    sum_hj += h[i,j]
                    new_mean += h[i,j] * vectors[i]
                covariances[j] = new_covariance / sum_hj
                means[j] = new_mean / sum_hj
                priors[j] = sum_hj / len(vectors)

                # bias term to stop covariance matrix being singular
                covariances[j] += self._bias * \
                    numpy.identity(dimensions, numpy.float64)

            # calculate likelihood - FIXME: may be broken
            det_covariances = []
            inv_covariances = []
            for j in range(self._num_clusters):
                det_covariances += [numpy.linalg.det(covariances[j])]
                inv_covariances += [numpy.linalg.inv(covariances[j])]
            l = self._loglikelihood(vectors, priors, means, covariances, det_covariances, inv_covariances)

            # check for convergence
            if abs(lastl - l) < self._conv_threshold:
                converged = True
            lastl = l
            counter += 1

    def classify_vectorspace(self, vector):
        best = None
        for j in range(self._num_clusters):
            p = self._priors[j] * self._gaussian(self._means[j],
                                    self._covariance_matrices[j], vector)
            if not best or p > best[0]:
                best = (p, j)
        return best[1]

    def likelihood_vectorspace(self, vector, cluster):
        cid = self.cluster_names().index(cluster)
        return self._priors[cluster] * self._gaussian(self._means[cluster], self._covariance_matrices[cluster], vector)

    def classification_probdist(self, vector):
        """
        Classifies the token into a cluster, returning
        a probability distribution over the cluster identifiers.
        """
        likelihoods = {}
        asum = 0.0
        for cluster in self.cluster_names():
            likelihoods[cluster] = self.likelihood(vector, cluster)
            asum += likelihoods[cluster]
        if asum == 0:
            print "sum of likelihoods are zero in classification_probdist"
        for cluster in self.cluster_names():
            if asum == 0:
                likelihoods[cluster] = 0
            else:
                likelihoods[cluster] /= asum
        return DictionaryProbDist(likelihoods)

    def _gaussian(self, mean, cvm, x, det_covariance = None, inv_covariance = None):
        m = len(mean)
        assert cvm.shape == (m, m), \
            'bad sized covariance matrix, %s' % str(cvm.shape)
        try:
            if det_covariance != None:
                det = det_covariance
            else:
                det = numpy.linalg.det(cvm)
            if inv_covariance != None:
                inv = inv_covariance
            else:
                inv = numpy.linalg.inv(cvm)
            a = det ** -0.5 * (2 * numpy.pi) ** (-m / 2.0) 
            dx = x - mean
            # print dx, inv
            b = -0.5 * numpy.dot( numpy.dot(dx, inv), dx)
            return a * numpy.exp(b) 
        except OverflowError:
            # happens when the exponent is negative infinity - i.e. b = 0
            # i.e. the inverse of cvm is huge (cvm is almost zero)
            return 0

    def _loglikelihood(self, vectors, priors, means, covariances, det_covariances = None, inv_covariances = None):
        llh = 0.0
        for vector in vectors:
            p = 0
            for j in range(len(priors)):
                p += priors[j] * self._gaussian(means[j], covariances[j], vector, det_covariances[j], inv_covariances[j])
            llh += numpy.log(p)
        return llh

    def __repr__(self):
        return '<EMClusterer number means = %d; threshold = %d' % (self._num_clusters, self._conv_threshold)

def demo():
    """
    Non-interactive demonstration of the clusterers with simple 2-D data.
    """

    # from nltk import cluster

    # use a set of tokens with 2D indices
    vectors = [numpy.array(f) for f in [[3, 3], [1, 2], [4, 2], [4, 0], [2, 3], [3, 1]]]
    
    # test the CentroidC clusterer with 4 clusters
    clusterer = CentroidClusterer(4)
    clusters = clusterer.cluster(vectors, True)

    print 'Clusterer:', clusterer
    print 'Clustered:', vectors
    print 'As:', clusters
    print
    
    # show the dendogram
    clusterer.dendogram().show()

    # classify a new vector
    vector = numpy.array([3, 3])
    print 'classify(%s):' % vector,
    print clusterer.classify(vector)
    print


if __name__ == '__main__':
    demo()
