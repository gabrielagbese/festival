const nextConfig = {
    async headers() {
        return ["/orders/:path*", "/dashboard/:path*", "/login", "/api/:path*"].map(source => ({ source, headers: [
            { key: "Referrer-Policy", value: "no-referrer" },
            { key: "Cache-Control", value: "private, no-store" }
        ] }));
    },
    images: {
        domains: ["i.ibb.co", "picsum.photos"],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

module.exports = nextConfig;
