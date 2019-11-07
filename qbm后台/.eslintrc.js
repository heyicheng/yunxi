// http://eslint.org/docs/user-guide/configuring

module.exports = {
	root: true,
	parser: 'babel-eslint',
	parserOptions: {
		sourceType: 'module'
	},
	env: {
		browser: true,
	},
	// required to lint *.vue files
	plugins: [
		'html'
	],
	// add your custom rules here
	'rules': {
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
		"quotes": 0,
		"no-console": 0,
		"no-debugger": 1,
		"no-var": 1,
		"import/named": 0,
		"semi": [1, "always"],
		"no-trailing-spaces": 0,
		"eol-last": 0,
		"no-underscore-dangle": 0,
		"no-alert": 0,
		"no-lone-blocks": 0
	},
};