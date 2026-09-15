export type PlanValue = {
  data_gb: number;
  price_naira: number;
  night_bonus_gb: number;
  bonus_restrictions?: string | null;
};
export function gbPerThousand(plan: PlanValue, includeBonus = false) {
  if (!Number.isFinite(plan.price_naira) || plan.price_naira <= 0) return 0;
  return (
    ((plan.data_gb +
      (includeBonus && plan.bonus_restrictions ? plan.night_bonus_gb : 0)) /
      plan.price_naira) *
    1000
  );
}
