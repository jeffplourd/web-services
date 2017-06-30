let argv = require('yargs').argv;
let _ = require('lodash');

const config = {
  NODE_ENV: argv.env || 'development',
  NODE_CONFIG_DIR: './build/main/config'
};

const isProduction = process.env.CIRCLE_BRANCH === 'production';

const gcloud = {
  branch: process.env.CIRCLE_BRANCH,
  dbInstanceName: isProduction ? process.env.DB_INSTANCE_NAME_PRODUCTION : process.env.DB_INSTANCE_NAME_STAGING,
  domain: 'us.gcr.io',
  projectId: process.env.PROJECT_ID,
  clusterId: isProduction ? process.env.CLUSTER_ID_PRODUCTION : process.env.CLUSTER_ID_STAGING,
  zoneId: process.env.ZONE_ID,
  serviceKey: process.env.SERVICE_KEY,
  imageVersion: process.env.CIRCLE_SHA1,
  ports: extractMapping(process.env.PORT_MAPPING),
  user: process.env.USER,
};

gcloud.uri = `${gcloud.domain}/${gcloud.projectId}/`;
gcloud.imageName = `${gcloud.clusterId}-${gcloud.branch}`;
gcloud.image = `${gcloud.uri}${gcloud.imageName}:${gcloud.imageVersion}`;

const env = _.assign({}, process.env, config, gcloud);

module.exports = env;

function extractMapping(rawPortMapping) {
  if (!rawPortMapping) {
    return [[3000, 3000]];
  }

  return JSON.parse(rawPortMapping);
}