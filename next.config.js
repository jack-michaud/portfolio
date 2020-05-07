module.exports = {
  webpack: (config) => {
    // Load markdown files
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader'
    })
    return config;
  }
}
