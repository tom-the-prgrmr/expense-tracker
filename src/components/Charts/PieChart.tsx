import { type FC } from 'react';

interface PieDatum {
  label: string;
  value: number; // percent sum should be 100, but we normalize
  color: string;
}

interface PieChartProps {
  data: PieDatum[];
  size?: number; // px
  radius?: number; // svg radius in viewbox space
}

const PieChart: FC<PieChartProps> = ({ data, size = 192, radius = 14 }) => {
  // normalize values to sum 1
  const total = data.reduce((a, b) => a + b.value, 0) || 1;
  let cumulative = 0;

  return (
    <svg viewBox='0 0 32 32' style={{ width: size, height: size }}>
      {data.map((d, i) => {
        const fraction = d.value / total;

        // Skip rendering if value is 0 or very small
        if (fraction <= 0) {
          return null;
        }

        const start = cumulative * 2 * Math.PI;
        const end = (cumulative + fraction) * 2 * Math.PI;
        cumulative += fraction;

        // Handle full circle case (100%)
        if (fraction >= 1) {
          return <circle key={i} cx='16' cy='16' r={radius} fill={d.color} />;
        }

        const large = end - start > Math.PI ? 1 : 0;
        const x1 = 16 + radius * Math.cos(start);
        const y1 = 16 + radius * Math.sin(start);
        const x2 = 16 + radius * Math.cos(end);
        const y2 = 16 + radius * Math.sin(end);
        const dPath = `M16,16 L ${x1},${y1} A ${radius},${radius} 0 ${large},1 ${x2},${y2} Z`;

        return <path key={i} d={dPath} fill={d.color} />;
      })}
    </svg>
  );
};

export default PieChart;
