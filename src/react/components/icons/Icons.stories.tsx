import type { Meta, StoryObj } from '@storybook/react-vite'
import type { FC } from 'react'
import type { IconProps } from './_type'
import { BadgeCheck } from './BadgeCheck'
import { Dark } from './Dark'
import { ExclamationTriangle } from './ExclamationTriangle'
import { Light } from './Light'
import { Logout } from './Logout'
import { Return } from './Return'

const meta: Meta = {
  title: 'Components/Icons',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

const icons: { name: string; component: FC<IconProps> }[] = [
  { name: 'BadgeCheck', component: BadgeCheck },
  { name: 'Dark', component: Dark },
  { name: 'ExclamationTriangle', component: ExclamationTriangle },
  { name: 'Light', component: Light },
  { name: 'Logout', component: Logout },
  { name: 'Return', component: Return },
]

const colors = [
  { name: 'Default', className: 'text-gray-900' },
  { name: 'Green', className: 'text-green-600' },
  { name: 'Blue', className: 'text-blue-600' },
  { name: 'Yellow', className: 'text-yellow-600' },
  { name: 'Red', className: 'text-red-600' },
]

export const AllIcons: StoryObj = {
  render: () => (
    <table className="border-collapse">
      <thead>
        <tr>
          <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Icon</th>
          {colors.map((color) => (
            <th key={color.name} className="p-3 text-center text-sm font-semibold text-gray-700 border-b">
              {color.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {icons.map(({ name, component: Icon }) => (
          <tr key={name}>
            <td className="p-3 text-sm text-gray-600 border-b">{name}</td>
            {colors.map((color) => (
              <td key={color.name} className={`p-3 text-center border-b ${color.className}`}>
                <Icon className="inline-block" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}
