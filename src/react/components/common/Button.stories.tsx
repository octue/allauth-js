import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    palette: {
      control: 'select',
      options: ['allauth', 'red', 'error', 'amber', 'gray', 'green'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    plain: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    children: 'Button',
    palette: 'allauth',
    size: 'md',
  },
}

export const AllPalettes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button palette="allauth">Allauth</Button>
        <Button palette="red">Red</Button>
        <Button palette="error">Error</Button>
        <Button palette="amber">Amber</Button>
        <Button palette="gray">Gray</Button>
        <Button palette="green">Green</Button>
      </div>
      <div className="flex gap-2">
        <Button palette="allauth" plain>
          Allauth Plain
        </Button>
        <Button palette="red" plain>
          Red Plain
        </Button>
        <Button palette="error" plain>
          Error Plain
        </Button>
        <Button palette="amber" plain>
          Amber Plain
        </Button>
        <Button palette="gray" plain>
          Gray Plain
        </Button>
        <Button palette="green" plain>
          Green Plain
        </Button>
      </div>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
}

export const Loading: Story = {
  args: {
    children: 'Loading Button',
    loading: true,
  },
}

export const PlainStyle: Story = {
  args: {
    children: 'Plain Button',
    plain: true,
  },
}
