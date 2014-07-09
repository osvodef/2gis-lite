module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            options: {
                separator: ';',
            },

            allJs: {
                src: [
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/baron/baron.js',
                    'bower_components/angular/angular.js',
                    'bower_components/angular-animate/angular-animate.js',
                    'bower_components/angular-sanitize/angular-sanitize.js',

                    'src/js/app.js',
                    'src/js/controllers/AppCtrl.js',
                    'src/js/directives/baronScroller.js',
                    'src/js/directives/infiniteScroller.js',
                    'src/js/directives/map.js',
                    'src/js/directives/minicard.js',
                    'src/js/directives/sidebar.js',
                    'src/js/directives/filialList.js',
                    'src/js/services/apiRequest.js',
                ],

                dest: 'tmp/app.js',
            }
        },

        uglify: {
            options: {
                mangle: true
            },

            allJs: {
                files: {
                    'build/js/dglite.min.js' : 'tmp/app.js',
                    'build/js/leaflet-plugins/bouncemarker.js' : 'bower_components/leaflet.bouncemarker/bouncemarker.js',
                }
            }
        },

        cssmin: {
            allCss: {
                files: {
                    'build/css/dglite.min.css' : [
                        'src/css/reset.css',
                        'bower_components/fontawesome/css/font-awesome.css',
                        'src/css/style.css',
                    ],
                }
            }
        },

        processhtml: {
            index: {
                files: {
                    'tmp/index.html' : ['src/index.html'],
                }
            }
        },

        htmlmin: {     
            allHtml: {      
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                },

                files: {
                    'build/index.html' : 'tmp/index.html',
                    'build/templates/filial-list.html' : 'src/templates/filial-list.html',
                    'build/templates/minicard.html' : 'src/templates/minicard.html',
                    'build/templates/sidebar.html' : 'src/templates/sidebar.html',
                }
            },
        },

        clean: {
            build: ['build'],
            temp: ['tmp'],
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');


    grunt.registerTask('default', [
        'clean:build',
        'concat',
        'uglify',
        'cssmin',
        'processhtml',
        'htmlmin',
        'clean:temp'
        ]
    );
};