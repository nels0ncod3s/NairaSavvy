import { getCurrentInflationRate } from "@/lib/data/inflation";
import ErosionCalculator from "./ErosionCalculator";
export default async function InflationCalculator() {
  const inflation = await getCurrentInflationRate();
  return (
    <ErosionCalculator
      initialInflationRate={inflation?.rate_percent}
      inflationPeriod={inflation?.period}
      inflationSource={inflation?.source}
    />
  );
}
