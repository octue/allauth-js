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
    plain: {
      control: 'boolean',
    },
    outlined: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

const AllVariantsContent = () => (
  <div className="flex flex-col gap-6 p-6">
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Palettes
      </h3>
      <div className="flex flex-wrap gap-2">
        <Button palette="allauth">Allauth</Button>
        <Button palette="red">Red</Button>
        <Button palette="error">Error</Button>
        <Button palette="amber">Amber</Button>
        <Button palette="gray">Gray</Button>
        <Button palette="green">Green</Button>
      </div>
    </div>

    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Plain Variants
      </h3>
      <div className="flex flex-wrap gap-2">
        <Button palette="allauth" plain>
          Allauth
        </Button>
        <Button palette="red" plain>
          Red
        </Button>
        <Button palette="error" plain>
          Error
        </Button>
        <Button palette="amber" plain>
          Amber
        </Button>
        <Button palette="gray" plain>
          Gray
        </Button>
        <Button palette="green" plain>
          Green
        </Button>
      </div>
    </div>

    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Outlined Variants
      </h3>
      <div className="flex flex-wrap gap-2">
        <Button palette="allauth" outlined>
          Allauth
        </Button>
        <Button palette="red" outlined>
          Red
        </Button>
        <Button palette="error" outlined>
          Error
        </Button>
        <Button palette="amber" outlined>
          Amber
        </Button>
        <Button palette="gray" outlined>
          Gray
        </Button>
        <Button palette="green" outlined>
          Green
        </Button>
      </div>
    </div>

    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Sizes
      </h3>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="xs">Extra Small</Button>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
    </div>

    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        States
      </h3>
      <div className="flex flex-wrap gap-2">
        <Button>Normal</Button>
        <Button disabled>Disabled</Button>
      </div>
    </div>
  </div>
)

export const AllVariants: Story = {
  render: () => <AllVariantsContent />,
}

export const AllVariantsDark: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="dark bg-gray-900 min-h-screen w-full flex items-center justify-center">
      <AllVariantsContent />
    </div>
  ),
}
