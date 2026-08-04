import { SectionHeader } from "./SectionHeader";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

export function PageHero({
  eyebrow,
  title,
  description,
  align = "center",
}: PageHeroProps) {
  return (
    <section className="bg-background px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          inverse
          headingLevel="h1"
          align={align}
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
      </div>
    </section>
  );
}
