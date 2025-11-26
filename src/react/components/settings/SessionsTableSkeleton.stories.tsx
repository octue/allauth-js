import type { Meta, StoryObj } from '@storybook/react-vite'

import { SessionsTableSkeleton } from './SessionsTableSkeleton'

const meta: Meta<typeof SessionsTableSkeleton> = {
  title: 'Components/Settings/SessionsTableSkeleton',
  component: SessionsTableSkeleton,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SessionsTableSkeleton>

export const Default: Story = {}
