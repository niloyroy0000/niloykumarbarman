          },
          // All other vendors (including icons - keep together for initial load)
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            priority: 10,
            enforce: true,
          },
          // Shared components (used 2+ times)
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      },
    };

    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
