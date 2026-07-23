import type { DashboardConfig } from './types'

/**
 * Sample dashboard configuration.
 * In production this will come from the backend API.
 * Each client has a unique config based on their business.
 */
export const SAMPLE_DASHBOARD: DashboardConfig = {
  title: 'Dashboard',
  widgets: [
    {
      id: 'kpi-revenue',
      type: 'kpi',
      size: 'half',
      title: 'Revenue',
      order: 1,
      data: {
        value: '$48,250',
        change: 12.5,
        changeLabel: 'vs last month',
      },
    },
    {
      id: 'kpi-orders',
      type: 'kpi',
      size: 'half',
      title: 'Orders',
      order: 2,
      data: {
        value: '342',
        change: -3.2,
        changeLabel: 'vs last month',
      },
    },
    {
      id: 'chart-revenue',
      type: 'chart',
      size: 'full',
      title: 'Revenue Trend',
      subtitle: 'Last 7 days',
      order: 3,
      variant: 'graphite',
      data: {
        chartType: 'area',
        xKey: 'name',
        yKey: 'value',
        data: [
          { name: 'Mon', value: 4200 },
          { name: 'Tue', value: 3800 },
          { name: 'Wed', value: 5100 },
          { name: 'Thu', value: 4600 },
          { name: 'Fri', value: 6200 },
          { name: 'Sat', value: 5400 },
          { name: 'Sun', value: 4900 },
        ],
      },
    },
    {
      id: 'progress-targets',
      type: 'progress',
      size: 'half',
      title: 'Targets',
      order: 4,
      data: {
        items: [
          { id: '1', label: 'Revenue target', value: 48250, max: 60000, color: 'var(--primary)' },
          { id: '2', label: 'New customers', value: 85, max: 120, color: '#10b981' },
          { id: '3', label: 'Retention rate', value: 92, max: 100, color: '#8b5cf6' },
        ],
      },
    },
    {
      id: 'list-recent',
      type: 'list',
      size: 'half',
      title: 'Recent Activity',
      order: 5,
      data: {
        items: [
          { id: '1', primary: 'New order #1089', secondary: 'Acme Corp', trailing: '$2,400', status: 'success' },
          { id: '2', primary: 'Invoice overdue', secondary: 'Widget Co', trailing: '5 days', status: 'warning' },
          { id: '3', primary: 'Payment failed', secondary: 'Order #1076', trailing: '$890', status: 'error' },
          { id: '4', primary: 'New lead', secondary: 'Startup Inc', trailing: 'Today', status: 'default' },
        ],
      },
    },
    {
      id: 'chart-orders',
      type: 'chart',
      size: 'half',
      title: 'Orders by Day',
      subtitle: 'Bar chart',
      order: 6,
      data: {
        chartType: 'bar',
        xKey: 'name',
        yKey: 'value',
        data: [
          { name: 'Mon', value: 42 },
          { name: 'Tue', value: 38 },
          { name: 'Wed', value: 55 },
          { name: 'Thu', value: 46 },
          { name: 'Fri', value: 62 },
          { name: 'Sat', value: 34 },
          { name: 'Sun', value: 28 },
        ],
      },
    },
    {
      id: 'timeline-activity',
      type: 'timeline',
      size: 'half',
      title: 'Timeline',
      order: 7,
      data: {
        events: [
          { id: '1', title: 'Invoice sent', description: 'Invoice #1089 to Acme Corp', time: '2 hours ago', dotColor: 'var(--primary)' },
          { id: '2', title: 'Payment received', description: '$2,400 from Acme Corp', time: 'Yesterday', dotColor: '#10b981' },
          { id: '3', title: 'New task created', description: 'Follow up on proposal', time: '2 days ago', dotColor: '#f59e0b' },
          { id: '4', title: 'Report generated', description: 'Weekly revenue report', time: '3 days ago', dotColor: 'var(--primary)' },
        ],
      },
    },
    {
      id: 'metric-conversion',
      type: 'metric',
      size: 'small',
      title: 'Conversion',
      order: 8,
      data: {
        value: '3.8%',
        label: 'Visitor to customer',
        subMetrics: [
          { label: 'Visitors', value: '8,940' },
          { label: 'Signups', value: '340' },
        ],
      },
    },
  ],
}
