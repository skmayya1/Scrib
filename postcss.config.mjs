const config = {
  plugins: ["@tailwindcss/postcss"],
 tailwindcss: {
      content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./Components/**/*.{js,ts,jsx,tsx}",
   ],
   
    },
};

export default config;
