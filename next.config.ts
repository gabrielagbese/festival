const nextConfig = {
    images: {
        domains: ["i.ibb.co", "picsum.photos"],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

module.exports = nextConfig;
