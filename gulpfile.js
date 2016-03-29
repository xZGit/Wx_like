'use strict';
let gulp = require('gulp');
let runSequence = require('run-sequence');

let clientCopyTask = require('./tasks/client_copy');
let clientBuildTask = require('./tasks/client_build');
let liveReloadTask = require('./tasks/livereload');
let serverStartTask = require('./tasks/server_start');
let cleanTask = require('./tasks/clean');
let generalCopyTask = require('./tasks/general_copy');
let serverBuildTask = require('./tasks/server_build');



gulp.task('server-start', serverStartTask());

gulp.task('livereload', liveReloadTask());

gulp.task('client-copy', clientCopyTask(false, liveReloadTask.notifyChanged));
gulp.task('client-build', clientBuildTask(false, liveReloadTask.notifyChanged));


gulp.task('client-copy-dist', clientCopyTask(true));
gulp.task('client-build-dist', clientBuildTask(true));
gulp.task('general-copy-dist', generalCopyTask());
gulp.task('server-build', serverBuildTask());



gulp.task('clean', cleanTask());



gulp.task('run', function(done) {
  runSequence(
    'clean',
    ['client-build', 'client-copy', 'livereload'],
    'server-start',
    done
  )
});

gulp.task('pro-dist', function(done) {
  runSequence(
      'clean',
      ['client-build-dist', 'client-copy-dist', 'general-copy-dist', 'server-build' ],
      done
  )
});

