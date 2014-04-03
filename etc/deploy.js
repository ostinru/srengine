// Listen on port 9001
var gith = require('gith').create( 9001 );
// Import execFile, to run our bash script
var execFile = require('child_process').execFile;

gith({ repo: 'ostinru/srengine' })
.on( 'all', function( payload ) {
    console.log(arguments);
    if( payload.branch === 'master' ) {
            // Exec a shell script
            execFile('~/srengine/etc/hook.sh', function(error, stdout, stderr) {
                    console.log( arguments );
            });
    }
});
