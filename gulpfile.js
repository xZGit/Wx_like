'use strict';
let gulp = require('gulp');
let runSequence = require('run-sequence');

let clientCopyTask = require('./tasks/client_copy');
let clientBuildTask = require('./tasks/client_build');
let liveReloadTask = require('./tasks/livereload');
let serverStartTask = require('./tasks/server_start');
let cleanTask = require('./tasks/clean');


gulp.task('server-start', serverStartTask());

gulp.task('livereload', liveReloadTask());

gulp.task('client-copy', clientCopyTask(false, liveReloadTask.notifyChanged));
gulp.task('client-build', clientBuildTask(false, liveReloadTask.notifyChanged));


gulp.task('clean', cleanTask());



gulp.task('run', function(done) {
  runSequence(
    'clean',
    ['client-build', 'client-copy', 'livereload'],
    'server-start',
    done
  )
});


