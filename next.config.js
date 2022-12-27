module.exports = {
  reactStrictMode: true,
  target: "serverless",
  publicRuntimeConfig: {
    siteMetadata: {
      title: "kylejs",
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};
