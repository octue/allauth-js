import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmailsTable } from './EmailsTable'

const mockEmails = [
  {
    email: 'user@example.com',
    primary: true,
    verified: true,
  },
  {
    email: 'user.alt@example.com',
    primary: false,
    verified: true,
  },
  {
    email: 'new.email@example.com',
    primary: false,
    verified: false,
  },
]

const meta: Meta<typeof EmailsTable> = {
  title: 'Components/Settings/EmailsTable',
  component: EmailsTable,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof EmailsTable>

export const Default: Story = {
  args: {
    emails: mockEmails,
    add: (email) => console.log('Adding email:', email),
    remove: (email) => console.log('Removing email:', email),
    makePrimary: (email) => console.log('Making primary:', email),
    verify: (email) => console.log('Verifying email:', email),
    disabled: false,
  },
}

export const Loading: Story = {
  args: {
    emails: mockEmails,
    add: (email) => console.log('Adding email:', email),
    remove: (email) => console.log('Removing email:', email),
    makePrimary: (email) => console.log('Making primary:', email),
    verify: (email) => console.log('Verifying email:', email),
    disabled: true,
  },
}

export const SingleEmail: Story = {
  args: {
    emails: [mockEmails[0]],
    add: (email) => console.log('Adding email:', email),
    remove: (email) => console.log('Removing email:', email),
    makePrimary: (email) => console.log('Making primary:', email),
    verify: (email) => console.log('Verifying email:', email),
    disabled: false,
  },
}

export const AllUnverified: Story = {
  args: {
    emails: [
      {
        email: 'unverified1@example.com',
        primary: true,
        verified: false,
      },
      {
        email: 'unverified2@example.com',
        primary: false,
        verified: false,
      },
    ],
    add: (email) => console.log('Adding email:', email),
    remove: (email) => console.log('Removing email:', email),
    makePrimary: (email) => console.log('Making primary:', email),
    verify: (email) => console.log('Verifying email:', email),
    disabled: false,
  },
}
