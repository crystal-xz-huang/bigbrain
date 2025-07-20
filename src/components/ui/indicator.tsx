import clsx from 'clsx'

/***************************************************************
                     Status Indicator
***************************************************************/
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type Color = 'green' | 'red' | 'blue' | 'yellow' | 'purple';

export function StatusIndicator({ color = 'green', size = 'md' } : {
  color?: Color;
  size?: Size;
}) {
  const colorsMap: Record<Color, string[]> = {
    green: ['bg-emerald-400', 'bg-emerald-500'],
    red: ['bg-red-400', 'bg-red-500'],
    blue: ['bg-blue-400', 'bg-blue-500'],
    yellow: ['bg-yellow-400', 'bg-yellow-500'],
    purple: ['bg-purple-400', 'bg-purple-500'],
  };

  const sizesMap: Record<Size, string> = {
    xs: 'size-3',
    sm: 'size-4',
    md: 'size-5',
    lg: 'size-6',
    xl: 'size-7',
    '2xl': 'size-8',
  }

  return (
    <span className={clsx('relative flex', sizesMap[size])}>
      <span className={clsx('absolute inline-flex h-full w-full animate-ping rounded-full opacity-75', colorsMap[color][0])} />
      <span className={clsx('relative inline-flex rounded-full', colorsMap[color][1], sizesMap[size])} />
    </span>
  );
}
