// Require the core node modules.
var chalk   = require( "chalk" ),
    cluster = require( "cluster" ),
    os      = require( "os" );

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

// The cluster module in Node.js works by executing the application entry-point
// multiple and sharing the master ports with the worker ports. As such, this code
// needs to distinguish between the Master process and the forked Worker process(es).
if ( cluster.isMaster ) {

    console.log( chalk.red("[Cluster]" ), "Master process is now running.", process.pid );

    // Since each Node.js process executes in a single thread, we want to create
    // Workers based on the number of Cores available on the operating system. This
    // way, we don't get Workers competing with each other for resources.
    for ( var i = 0, coreCount = os.cpus().length ; i < coreCount ; i++ ) {

        var worker = cluster.fork();

    }

    // When one of the Workers dies, the cluster will emit an "exit" event, which
    // we can use to then spawn new Worker processes.
    cluster.on(
        "exit",
        function handleExit( worker, code, signal ) {

            console.log( chalk.yellow( "[Cluster]" ), "Worker has died.", worker.process.pid );
            console.log( chalk.yellow( "[Cluster]" ), "Death was suicide:", worker.exitedAfterDisconnect );

            // If a Worker was terminated accidentally (such as by an uncaught
            // exception), then we can try to restart it.
            if ( ! worker.exitedAfterDisconnect ) {

                var worker = cluster.fork();
                // CAUTION: If the Worker dies immediately, perhaps due to a bug in the
                // code, you can run [from what I have READ] into rapid CPU consumption
                // as Master continually tries to create new Workers.

            }

        }
    );

} else {

    // Any time we deal with concurrency, we want to separate out the concurrency code
    // from the rest of the code. As such, we don't want to actually define out Worker
    // logic here. Instead, we want to require it from a different module. This has the
    // happy side-effect of allowing us to run the application in Cluster mode or in
    // stand-alone mode by using different entry points (cluster.js vs. server.js).
    require( "./server" );

    console.log( chalk.red( "[Worker]" ), "Worker has started.", process.pid );

}