const webpack = require('webpack')
const path = require('path')
const withPlugins = require('next-compose-plugins')
const withOptimizedImages = require('next-optimized-images')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const Dotenv = require('dotenv-webpack')
const WebpackBar = require('webpackbar')

module.exports = withPlugins(
  [
    [withBundleAnalyzer],
    [
      withOptimizedImages,
      {
        // these are the default values so you don't have to provide them if they are good enough for your use-case.
        // but you can overwrite them here with any valid value you want.
        inlineImageLimit: 8192,
        imagesFolder: 'images',
        imagesName: '[name]-[hash].[ext]',
        handleImages: ['jpeg', 'png', 'webp', 'svg', 'gif', 'ico'],
        optimizeImages: true,
        optimizeImagesInDev: false,
        mozjpeg: {
          quality: 80,
        },
        optipng: {
          optimizationLevel: 3,
        },
        pngquant: false,
        gifsicle: {
          interlaced: true,
          optimizationLevel: 3,
        },
        svgo: {
          // enable/disable svgo plugins here
        },
        webp: {
          preset: 'default',
          quality: 75,
        },
      },
    ],
  ],
  {
    // typescript: {
    //   ignoreBuildErrors: true,
    // },
    basePath: '/xunitdash',
    webpack: (config) => {
      config.resolve.alias['~'] = path.resolve('./src')
      config.resolve.mainFields = ['module', 'main']
      config.resolve.extensions = ['.ts', '.tsx', '.js']

      config.plugins = config.plugins || []

      config.plugins = [
        ...config.plugins,
        // Read the .env file
        new Dotenv({
          path: path.join(__dirname, '.env'),
          systemvars: true,
        }),
      ]

      config.plugins.push(
        new WebpackBar({
          fancy: true,
          profile: true,
          basic: false,
        })
      )

      config.module.rules.push({
        test: /.*.stories.tsx$/,
        loader: 'ignore-loader',
      })

      config.plugins.push(new webpack.IgnorePlugin(/stories/))

      return config
    },
  },
)
