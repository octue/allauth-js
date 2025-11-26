import type { Meta, StoryObj } from '@storybook/react-vite'

import { SessionsTable } from './SessionsTable'
import type { Session } from '../../../core/types'

const mockCurrentSession: Session = {
  id: 1,
  is_current: true,
  created_at: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
  ip: '192.168.1.100',
  user_agent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  last_seen_at: Math.floor(Date.now() / 1000) - 300, // 5 minutes ago
}

const mockOtherSessions: Session[] = [
  {
    id: 2,
    is_current: false,
    created_at: Math.floor(Date.now() / 1000) - 172800, // 2 days ago
    ip: '10.0.0.50',
    user_agent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
    last_seen_at: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
  },
  {
    id: 3,
    is_current: false,
    created_at: Math.floor(Date.now() / 1000) - 604800, // 7 days ago
    ip: '172.16.0.10',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    last_seen_at: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
  },
]

const meta: Meta<typeof SessionsTable> = {
  title: 'Components/Settings/SessionsTable',
  component: SessionsTable,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SessionsTable>

export const Default: Story = {
  args: {
    currentSession: mockCurrentSession,
    otherSessions: mockOtherSessions,
    endSessions: (sessions) => console.log('Ending sessions:', sessions),
    trackActivity: true,
    disabled: false,
  },
}

export const WithoutActivityTracking: Story = {
  args: {
    currentSession: mockCurrentSession,
    otherSessions: mockOtherSessions,
    endSessions: (sessions) => console.log('Ending sessions:', sessions),
    trackActivity: false,
    disabled: false,
  },
}

export const Loading: Story = {
  args: {
    currentSession: mockCurrentSession,
    otherSessions: mockOtherSessions,
    endSessions: (sessions) => console.log('Ending sessions:', sessions),
    trackActivity: true,
    disabled: true,
  },
}

export const SingleSession: Story = {
  args: {
    currentSession: mockCurrentSession,
    otherSessions: [],
    endSessions: (sessions) => console.log('Ending sessions:', sessions),
    trackActivity: true,
    disabled: false,
  },
}
