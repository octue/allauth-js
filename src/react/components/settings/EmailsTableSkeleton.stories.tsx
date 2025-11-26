import type { Meta, StoryObj } from '@storybook/react-vite'

import { EmailsTableSkeleton } from './EmailsTableSkeleton'

const meta: Meta<typeof EmailsTableSkeleton> = {
  title: 'Components/Settings/EmailsTableSkeleton',
  component: EmailsTableSkeleton,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof EmailsTableSkeleton>

export const Default: Story = {}
