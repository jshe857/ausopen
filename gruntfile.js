//PHP middleware so the server can run .htc files 
var phpMiddleware = require('connect-php');

module.exports = function(grunt) {

    // configure the tasks
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // copy from the source directory to build
        copy: {
            ops: {
                cwd: 'web',
                src: [ '**','libs/*.js','!js/*.js'],
                dest: 'build/ops',
                expand: true
            }
        },

        // clean the build directory
        clean: {
            build: {
                src: [ 'build' ]
            },
        },

        // watch for changes
        watch: {
            copy: {
              files: ['web/**','web/test/**','web/partials/**','web/images/**','web/fonts/**','web/libs/**','web/data/**', '!web/data_2013/**','!web/data_2014/**', '!web/site_2014/**', '!web/css/*.less','!web/js/*.js'],
              tasks: [ 'copy:ops', 'rename:ops']
			},
            scripts: {
                files: [ 'web/js/*.js'],
                tasks: [ 'concat:ops', 'uglify:ops']
            },
            configFiles: {
                    files: [ 'gruntfile.js'],
                    options: {
                      reload: true
                    }
            }
        },        
        // minimise css
        cssmin: {
			ops: {
				src: 'build/ops/css/style.css',
				dest: 'build/ops/css/style.min.css'
			}, 
        },

        // join scripts
        concat: {		
			options: {
				separator: ';',
			},
			ops: {
					src: ['web/js/*.js'],
					dest: 'build/ops/js/kia_scripts.js',
			},
        },
        
        // minimise scripts
        uglify: {
			ops: {
				src: 'build/ops/js/kia_scripts.js',
				dest: 'build/ops/js/kia_scripts.min.js'
			},
        },
		
		// start a web server
        connect: {
            server: {
                options: {
                    port: 4003,
                    base: 'build',
                    hostname: '*',
                    middleware: function(connect, options) {
                        // Same as in grunt-contrib-connect
                      var middlewares = [];
                      var directory = options.directory ||
                        options.base[options.base.length - 1];
                      if (!Array.isArray(options.base)) {
                        options.base = [options.base];
                      }

                      // Here comes the PHP middleware
                      middlewares.push(phpMiddleware(directory));

                        // Same as in grunt-contrib-connect
                      options.base.forEach(function(base) {
                        middlewares.push(connect.static(base));
                      });

                      middlewares.push(connect.directory(directory));
                      return middlewares;
                    }
                }
            }
        },

        // rename the index files
        rename: {
          ops: {
            files: [
                  {src: ['build/ops/index_ops.html'], dest: 'build/ops/index.html'},
                ]
          }
        }

    });

    // load the tasks
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-rename');
    grunt.loadNpmTasks('grunt-newer');

    // define the tasks
    grunt.registerTask(
		'build',
        [ 'clean', 'newer:copy:ops', 'concat:ops', 'cssmin:ops', 'uglify:ops', 'rename:ops' ]
    );

    grunt.registerTask(
        'default',
        ['build', 'connect', 'watch']
    );
};
