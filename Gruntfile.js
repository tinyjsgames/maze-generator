module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        options: {
          style: 'expanded',
          sourcemap: 'auto'
        },
        files: {
          'css/style.css':'sass/style.scss',
        }
      }
    },
    watch: {
        sass: {
            files: ["**/*.scss", "index.html"],
            tasks: ['sass']
        },
        js: {
          files: ["js/**/app.js"],
          tasks: ['uglify']
        }
    },
    processhtml: {
        build: {
            files: {
              'build/web/make/index.html': ['make/index.html'],
              'build/web/play/index.html': ['play/index.html'],
            }
        }
    },
    uglify: {
        target: {
          files: {
            'js/make.min.js': ['js/components.js','js/table.js','js/make.js'],
            'js/play.min.js': ['js/components.js','js/table.js','js/play.js'],
          }
        }
    },
    copy: {
      web: {
        files: [
          {expand: true, src: ['js/make.min.js'], dest: 'build/web/'},
          {expand: true, src: ['js/play.min.js'], dest: 'build/web/'},
          {expand: true, src: ['css/style.min.css'], dest: 'build/web/'},
          {expand: true, src: ['bower_components/jquery/dist/jquery.min.js'], dest: 'build/web/'},
          {expand: true, src: ['bower_components/phaser/build/phaser.min.js'], dest: 'build/web/'},
          {expand: true, src: ['bower_components/font-awesome/css/font-awesome.min.css'], dest: 'build/web/'},
          {expand: true, src: ['bower_components/font-awesome/fonts/*'], dest: 'build/web/'}
        ],
      },
    },
    cssmin: {
      main: {
        files: [{
          expand: true,
          cwd: 'css',
          src: ['*.css', '!*.min.css'],
          dest: 'css',
          ext: '.min.css'
        }]
      }
    },

    browserSync: {
      dev: {
        bsFiles: {
          src : [
            'css/style.css',
          ]
        },
        options: {
          watchTask: true,
          server: {
            baseDir: "./",
            directory: true
          }

        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-processhtml');
  // Default task(s).
  grunt.registerTask('build', ['sass','cssmin','uglify','copy','processhtml']);
  grunt.registerTask('default', ['build','browserSync','watch']);


};
