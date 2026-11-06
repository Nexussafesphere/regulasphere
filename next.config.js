import { withSentryConfig } from "@sentry/nextjs";

const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

const sentryWebpackPluginOptions = {
  silent: true,
  org: process.env.SENTRY_ORG || "nexus-safesphere",
  project: process.env.SENTRY_PROJECT || "regulasphere",
  authToken: process.env.SENTRY_AUTH_TOKEN,
};

export default withSentryConfig(
  nextConfig,
  sentryWebpackPluginOptions,
  {
    widenClientFileUpload: true,
    transpileClientSDK: true,
    tunnelRoute: "/monitoring",
    hideSourceMaps: true,
    disableLogger: true,
  }
);