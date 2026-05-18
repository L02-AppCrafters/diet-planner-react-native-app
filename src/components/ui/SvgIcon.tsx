import { SvgXml } from 'react-native-svg';

type SvgIconProps = {
  color?: string;
  height?: number;
  size?: number;
  source: string;
  width?: number;
};

export function SvgIcon({ color, height, size, source, width }: SvgIconProps) {
  const xml = color ? source.replace(/fill="[^"]*"/g, `fill="${color}"`) : source;

  return <SvgXml height={height ?? size} width={width ?? size} xml={xml} />;
}
