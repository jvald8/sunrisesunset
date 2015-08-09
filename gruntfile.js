module.exports = function(grunt) {
  grunt.initConfig({
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },
    bower: {
    install: {

      },
    },

  });

  grunt.loadNpmTasks('grunt-bower-task');

};
