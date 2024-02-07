/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		ignoreDuringBuilds: true
	},
	webpack(config, options) {
		config.module.rules.push({
		  test: /\.mp3$/,
		  use: {
			loader: "url-loader",
		  },
		});
		return config;
	  },
}

module.exports = nextConfig

