type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  inverse?: boolean;
  headingLevel?: "h1" | "h2";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  inverse = false,
  headingLevel = "h2",
}: SectionHeaderProps) {
  const Heading = headingLevel;
  return (
    <div
      className={`mx-auto max-w-3xl ${
        align === "center" ? "text-center" : ""
      }`}
    >
      {eyebrow ? (
        <p
          className={`mb-3 text-xs font-bold uppercase tracking-[0.18em] ${
            inverse ? "text-metallic-silver" : "text-primary"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <Heading
        className={`text-3xl font-semibold leading-tight md:text-5xl ${
          inverse ? "text-white" : "text-white"
        }`}
      >
        {title}
      </Heading>
      {description ? (
        <p
          className={`mt-4 text-base leading-7 md:text-lg ${
            inverse ? "text-metallic-silver/72" : "text-muted"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
