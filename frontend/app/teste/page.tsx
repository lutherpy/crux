'use client';

import {
  Bar,
  BarChart,
  Label,
  Rectangle,
  ReferenceLine,
  XAxis
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import PageContainer from '@/components/layout/page-container';
import CardLp from '@/components/custom/card-lp';

export default function Component() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        Bem vindo.
        <div className="mt-5">
          <CardLp />
        </div>
      </div>
    </PageContainer>
  );
}
