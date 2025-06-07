import {
	defineConfig
} from 'unocss';
import preseUno from '@unocss/preset-uno';
import presetRemToPx from '@unocss/preset-rem-to-px';
import presetLegacyCompat from '@unocss/preset-legacy-compat'

export default defineConfig({
	shortcuts: {
		'flex-cc': 'flex justify-center items-center'
	},
	presets: [
		preseUno(),
		presetLegacyCompat({
      commaStyleColorFunction: true,
      legacyColorSpace: true
    }),
		presetRemToPx({
			baseFontSize: 4
		}),
	],
	preflights: [
		{
			getCSS: () => `
				* {
					padding: 0;
					margin: 0;
				}
				html,body {
					width: 100%;
				}
			`,
		}
	]
});