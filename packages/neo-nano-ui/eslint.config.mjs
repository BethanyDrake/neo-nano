import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, 
  {
		rules: {
			'@typescript-eslint/ban-ts-comment': 'off'
		},
	},
  {
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts", "coverage/" ]
}];

export default eslintConfig;
