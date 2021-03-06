var eventStream = require('event-stream'),
    gulp = require('gulp'),
    chmod = require('gulp-chmod'),
    zip = require('gulp-zip'),
    tar = require('gulp-tar'),
    gzip = require('gulp-gzip'),
    rename = require('gulp-rename');

gulp.task('prepare-release', function() {
    var version = require('./package.json').version;

    return eventStream.merge(
        getSources()
            .pipe(zip('open-street-map-history-plugin-' + version + '.zip')),
        getSources()
            .pipe(tar('open-street-map-history-plugin-' + version + '.tar'))
            .pipe(gzip())
    )
    .pipe(chmod(0644))
    .pipe(gulp.dest('release'));
});

// Builds and packs plugins sources
gulp.task('default', gulp.series('prepare-release'));

/**
 * Returns files stream with the plugin sources.
 *
 * @returns {Object} Stream with VinylFS files.
 */
var getSources = function() {
    return gulp.src([
            'Plugin.php',
            'README.md',
            'LICENSE',
            'routing.yml',
            'Controller/*',
            'js/*',
            'css/*'
        ],
        {base: './'}
    )
    .pipe(rename(function(path) {
        path.dirname = 'Mibew/Mibew/Plugin/OpenStreetMapHistory/' + path.dirname;
    }));
}
