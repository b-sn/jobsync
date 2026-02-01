import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
  output: "standalone",
  devIndicators: false,
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
