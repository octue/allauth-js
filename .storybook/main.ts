import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    return {
      ...config,
      define: {
        ...config.define,
        'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        ),
      },
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          'next/link': path.resolve(__dirname, './__mocks__/next-link.tsx'),
        },
      },
    }
  },
}
export default config
