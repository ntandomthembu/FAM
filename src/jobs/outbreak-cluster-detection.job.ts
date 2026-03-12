import { Job } from 'bull';
import { OutbreakClusterService } from '../services/outbreak-cluster.service';
import { AlertService } from '../services/alert.service';
import { logInfo, logError } from '../utils/logger';

const outbreakClusterDetectionJob = async (job: Job) => {
    const clusterService = new OutbreakClusterService();
    const alertService = new AlertService();

    try {
        const clusters = await clusterService.detectOutbreakClusters(14, 2);
        logInfo(`Cluster detection job: found ${clusters.length} clusters`);

        for (const cluster of clusters) {
            if (cluster.centroid.latitude !== 0 && cluster.centroid.longitude !== 0) {
                await alertService.sendProximityAlert(
                    cluster.centroid.longitude,
                    cluster.centroid.latitude,
                    10,
                    cluster.incidents[0]?._id?.toString() || 'cluster'
                );
            }
        }
    } catch (error: any) {
        logError(`Outbreak cluster detection job failed: ${error.message}`);
    }
};

export default outbreakClusterDetectionJob;