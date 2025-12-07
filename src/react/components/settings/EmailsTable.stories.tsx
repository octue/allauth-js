import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../common/Button'
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
    remove: (email) => console.log('Removing email:', email),
    makePrimary: (email) => console.log('Making primary:', email),
    verify: (email) => console.log('Verifying email:', email),
    disabled: false,
    // Add email is done as a composed component so you can use
    // your own form handler and modal
    actions: <Button onClick={() => {}}>Add email</Button>,
  },
}

export const SingleEmail: Story = {
  args: {
    emails: [mockEmails[0]],
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
    remove: (email) => console.log('Removing email:', email),
    makePrimary: (email) => console.log('Making primary:', email),
    verify: (email) => console.log('Verifying email:', email),
    disabled: false,
  },
}

export const ActionInProgress: Story = {
  args: {
    emails: [
      {
        email: 'user@example.com',
        primary: true,
        verified: true,
      },
      {
        email: 'verifying@example.com',
        primary: false,
        verified: false,
        verifying: true,
      },
      {
        email: 'making-primary@example.com',
        primary: false,
        verified: true,
        makingPrimary: true,
      },
      {
        email: 'removing@example.com',
        primary: false,
        verified: true,
        removing: true,
      },
    ],
    remove: (email) => console.log('Removing email:', email),
    makePrimary: (email) => console.log('Making primary:', email),
    verify: (email) => console.log('Verifying email:', email),
    disabled: false,
  },
}
