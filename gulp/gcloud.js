let gulp = require('gulp');
let env = require('./env');
let { $exec, gcloud, kubeServiceName } = require('./utils');
let replace = require('gulp-replace-task');
let rename = require('gulp-rename');
let runSequence = require('run-sequence');

gulp.task('gcloudUpdate', (cb) => {
  $exec(gcloud('--quiet components update'))
    .then(() => $exec(gcloud('--quiet components update kubectl')))
    .then(() => cb());
});

gulp.task('gcloudAuth', (cb) => {
  $exec(`echo ${env.serviceKey} | base64 --decode -i > ./gcloud-service-key.json`)
    .then(() => $exec(gcloud('auth activate-service-account --key-file ./gcloud-service-key.json')))
    .then(() => cb());
});

gulp.task('gcloudConfig', (cb) => {
  $exec(gcloud(`config set project ${env.projectId}`))
    .then(() => $exec(gcloud(`--quiet config set container/cluster ${env.clusterId}`)))
    .then(() => $exec(gcloud(`config set compute/zone ${env.zoneId}`)))
    .then(() => $exec(gcloud(`--quiet container clusters get-credentials ${env.clusterId}`)))
    .then(() => $exec(`sudo chown -R ${env.user} /home/ubuntu/.config`))
    .then(() => $exec('sudo chown -R ubuntu:ubuntu /home/ubuntu/.kube'))
    .then(() => cb());
});

gulp.task('dockerBuild', (cb) => {
  $exec(`docker build -t ${env.image} -build-arg ENVIRONMENT=${env.branch} -f templates/Dockerfile .`)
    .then(() => cb());
});

gulp.task('dockerPush', (cb) => {
  $exec(gcloud(`docker -- push ${env.image}`))
    .then(() => cb());
});

gulp.task('kubeCreateDeploymentConfig', () => {
  const name = `${env.clusterId}-depl`;
  const selector = `app: ${env.imageName}`;
  const imageName = env.imageName;
  const image = env.image;
  const ports = env.ports.map((port) => `- containerPort: ${port[0]}\n            protocol: "TCP"`).join('\n          ');

  const patterns = createPattern({
    name,
    selector,
    imageName,
    image,
    ports
  });

  gulp.src('./templates/kubernetes-deployment-template.yml')
    .pipe(replace({ patterns }))
    .pipe(rename('kubernetes-deployment.yml'))
    .pipe(gulp.dest('./templates'));
});

gulp.task('kubeDeployDeployment', (cb) => {
  $exec('kubectl apply -f ./templates/kubernetes-deployment.yml').then(() => cb());
});

gulp.task('kubeCreateServiceConfig', () => {
  const name = `${env.clusterId}-lb`;
  const selector = `app: ${env.imageName}`;
  const ports = config.ports.map((port) => `- port: ${port[0]}\n    targetPort: ${port[1]}`).join('\n  ');

  const patterns = createPattern({
    name,
    selector,
    ports
  });

  gulp.src('./templates/kubernetes-service-template.yml')
    .pipe(replace({ patterns }))
    .pipe(rename('kubernetes-service.yml'))
    .pipe(gulp.dest('./templates'));
});

gulp.task('kubeDeployService', (cb) => {
  kubeServiceName(config.imageName)
    .then((serviceName) => {
      if (serviceName === null) {
        return $exec('kubectl create -f ./templates/kubernetes-service.yml');
      }
      return Promise.resolve();
    })
    .then(() => cb());
});

gulp.task('servicesDeploy', (cb) => {
  runSequence(
    'gcloudUpdate',
    'gcloudAuth',
    'gcloudConfig',
    'dockerBuild',
    'dockerPush',
    'kubeCreateDeploymentConfig',
    'kubeDeployDeployment',
    'kubeCreateServiceConfig',
    'kubeDeployService',
    cb
  )
});