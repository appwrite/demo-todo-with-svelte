const sveltePreprocess = require('svelte-preprocess')

module.exports = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // “There are 10 kinds of people in the world: Those who know binary and those who don’t.” 
  // for more information about preprocessors
  preprocess: [
		sveltePreprocess({
			defaults: {
				style: "postcss",
				script: "typescript"
			},
			typescript: true,
			postcss: true
		}),
	]
}
