var webpack             = require('webpack');
var path                = require('path');
// const validate          = require('webpack-validator').validateRoot;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals      = require('webpack-node-externals');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// var InlineEnviromentVariablesPlugin = require('inline-environment-variables-webpack-plugin');


var production  = process.env.NODE_ENV === 'production';
var devMode = true;
var lib_dir     = __dirname + '/public/libs',
    image_dir   = path.join(__dirname, '/public/images'),
    node_dir    = __dirname + '/node_modules';

const PATH      = {
    uploads: path.join(__dirname, '/uploads'),
    builds: path.join(__dirname, '/builds'),
    scripts: path.join(__dirname, '/app/scripts'),
    serverBuilds: path.join(__dirname, '../app/Resources/webpack/')
}

module.exports = [
    //server config
    {
        mode: 'development',
        target: 'node', //https://github.com/axios/axios/issues/456#issuecomment-285287911
        // externals: [nodeExternals()],
        // node: { 
        //     process: false,
        //     console: true, 
        // },
        //context: PATH.uploads,
        resolve: {
            alias:     {
                fix  : PATH.scripts + '/fixServerRendering.js',
                images: image_dir
            }
        },
        entry: {
            // 'babel-polyfill': ['babel-polyfill'],
            index: './app/entryPoint.js',
            // vendors: ['jquery']
        },
        output: {
            path: PATH.serverBuilds,
            filename: '[name].bundle.js',
            // publicPath: production ? '/' : 'http://opinion.com:8080/',
            crossOriginLoading: "anonymous"
        },    
        module: {
            // noParse: /node_modules\/localforage\/dist\/localforage.js/, //Webpack will emit a warning about using a prebuilt javascript file which is fine; see doc
            rules: [
                // {
                //     test: /\.(sa|sc|c)ss$/,
                //     use: [
                //         //devMode ? 'style-loader' : MiniCssExtractPlugin.loader, //don't use style-loader in ssr
                //         {
                //             loader: 'css-loader',
                //             options: {
                //                 importLoaders: 1,
                //                 modules: true,
                //                 localIdentName: '[name]__[local]--[hash:base64:5]',
                //                 sourceMap: true
                //             }
                //         },
                //         'postcss-loader',
                //         'resolve-url-loader', //resolve .eot's url in css file
                //         {
                //             loader: 'sass-loader',
                //             options: {
                //                 importLoaders: 1,
                //                 modules: true,
                //                 localIdentName: '[name]__[local]--[hash:base64:5]',
                //                 sourceMap: true
                //             }
                //         }
                //     ],
                // },
                { 
                    test: /\.(woff|woff2|svg|ttf)([\?]?.*)$/, 
                    use: [{
                        loader: "file-loader"
                    }]
                },
                {
                    test: /\.(s?)css$/,
                    use: 'ignore-loader'
                },
                {
                    test: /\.jsx?$/,
                    loaders: ['babel-loader'],
                    exclude: /node_modules/
                    // ,options: {
                    //     plugins: [
                    //         'dynamic-import-webpack',   //The first plugin transpiles import() to require.ensure
                    //         'remove-webpack'            //The second plugin removes require.ensure from the code
                    //     ]                               // https://gist.github.com/jcenturion/892c718abce234243a156255f8f52468
                    // }
                },
                {
                    test: /\.(jpe?g|png|gif|svg|eot)$/i,
                    use: [
                      {
                        loader: 'file-loader',
                        options: {}  
                      }
                    ]
                },
                {
                    test: /\.html$/,
                    use: "raw"
                },
                {
                    test:   /\.(png|gif|svg?(\?v=[0-9]\.[0-9]\.[0-9])?)$/i,
                    use: 'url?limit=10000',
                }
            ]
        },
        plugins: [            
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }),
            //CleanWebpackPlugin(pathsToClean, cleanOptions)
            new CleanWebpackPlugin([
                    PATH.serverBuilds + '/*.*'         // removes '../app/Resources/webpack' folder
                ], {
                    root:     __dirname,
                    //exclude:  ['shared.js'],
                    verbose:  true,
                    dry:      false,
                    allowExternal: true
            })
        ],
        // devServer: {
        //     hot: true,
        //     contentBase: './web/',
        //     headers: { "Access-Control-Allow-Origin": "*" }
        // },
        devtool: 'cheap-module-source-map'
    },

    //client side config
    {
        //context: PATH.uploads,*
        mode: 'development',
        resolve: {
            alias:     {
                jquery  : lib_dir + '/jquery.min.js',
                images: image_dir
            }
        },
        entry: {
            // 'babel-polyfill': ['babel-polyfill'],
            index: './app/entryPoint.js',
            vendors: ['jquery']
        },
        output: {
            path: PATH.builds,
            filename: '[name].bundle.js',
            chunkFilename: 'js/[name].bundle.js', 
            // publicPath: '/',
            publicPath: production ? '/builds/' : '/builds/',
            crossOriginLoading: "anonymous" //Only used when target is web, which uses JSONP for loading on-demand chunks, by adding script tags.
        },    
        module: {
            noParse: /node_modules\/localforage\/dist\/localforage.js/, //Webpack will emit a warning about using a prebuilt javascript file which is fine; see doc
            rules: [
                // {
                //     test: /\.(s?)css$/,
                //     use: ExtractTextPlugin.extract('style', 'css!sass'),
                //     include: [
                //         path.resolve(__dirname, 'public/styles')
                //     ]
                // },
                {
                    test: /\.s?css$/,
                    loader: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: [
                            {
                                loader: 'string-replace-loader',
                                options: {
                                    search:'"http://127.0.0.1:3000',
                                    replace:'"http://127.0.0.1:3000',
                                    flags:'g'
                                }
                            },
                            { loader: 'css-loader' },
                            { loader: 'postcss-loader'},
                            { loader: 'sass-loader' }
                        ]
                    }),
                },
                {
                    test: /\.jsx?$/,
                    loaders: ['babel-loader'],
                    exclude: /node_modules/,
                },
                {
                    test: /\.(jpe?g|png|gif|svg|eot)$/i,
                    use: [
                      {
                        loader: 'file-loader',
                        options: {}  
                      }
                    ]
                },
                // {
                //     test: /\.css$/,
                //     use: ExtractTextPlugin.extract("style-loader", "css-loader")
                // },
                // {
                //     test: /\.js$/,
                //     exclude: /node_modules/,
                //     use: "babel-loader"
                //     //use: this "query" instead of .babelrc file 
                //     // query: {
                //     //   presets: ['es2015']
                //     // }
                // },
                // {
                //     test: /\.scss$/,
                //     use: "style!css!sass",
                //     query : {
                //         modules : true
                //     }
                // },
                {
                    test: /\.html$/,
                    use: "raw"
                },
                {
                    test:   /\.(png|gif|svg?(\?v=[0-9]\.[0-9]\.[0-9])?)$/i,
                    use: 'url?limit=10000',
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin({ 
                filename: 'css/global.css', 
                disable: false, 
                allChunks: true 
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
            }),
            // new webpack.optimize.LimitChunkCountPlugin({
            //     maxChunks: 0
            // }),
            // //this mean the bundle.js file will automaticaly minimize by uglifyJs
            // new webpack.optimize.UglifyJsPlugin({
            //     compress: {
            //         warnings: false,
            //     },
            //     output: {
            //         comments: false,
            //     },
            // }),

            new webpack.ProvidePlugin({
                $       : "jquery",
                jQuery  : "jquery",
                'window.jQuery': "jquery"
            }),
            //CleanWebpackPlugin(pathsToClean, cleanOptions)
            new CleanWebpackPlugin([
                    'builds/*.js'    // removes all files in 'build' folder
                ], {
                    root:     __dirname,
                    //exclude:  ['shared.js'],
                    verbose:  true,
                    dry:      false,
                    allowExternal: false
            })
        ],
        devServer: {
            hot: true,
            contentBase: './web/',
            headers: { "Access-Control-Allow-Origin": "*" }
        },
        devtool: 'cheap-module-source-map',
        optimization: {
            splitChunks: {
                cacheGroups: {
                    //Write splitChunks configuration in optimization object in root of the webpack config object.
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendor",
                        chunks: "all"
                    },
                    // styles: {
                    //     name: 'styles',
                    //     test: /\.s?css$/,
                    //     chunks: 'all',
                    //     // minChunks: 1,
                    //     // reuseExistingChunk: true,
                    //     enforce: true,
                    // }
                }
            }
        }
    }
]

// loader: 'css-loader/locals?modules&localIdentName=[path][name]---[local]---[hash:base64:5]'
// 'css/locals?module&localIdentName=[name]__[local]___[hash:base64:5]'
// 'css-loader/locals?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'