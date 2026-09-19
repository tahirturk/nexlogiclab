import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './nexlogiclab_coming_soon.tsx'
  ],
  theme: {
    extend: {}
  },
  plugins: []
};

export default config;