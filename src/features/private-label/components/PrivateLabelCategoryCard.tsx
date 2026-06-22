import type { PrivateLabelCategoryDetail } from "@/types/private-label";

type PrivateLabelCategoryCardProps = {
  category: PrivateLabelCategoryDetail;
};

export function PrivateLabelCategoryCard({
  category,
}: PrivateLabelCategoryCardProps) {
  return (
    <article className="incar-card rounded-lg p-5">
      <h3 className="text-lg font-semibold text-white">{category.category}</h3>
      <p className="mt-3 text-sm leading-6 text-muted">{category.description}</p>
    </article>
  );
}
