import type { Dictionary } from "@/i18n/dictionaries";

export function PrivateLabelQualitySection({
  dictionary,
}: {
  dictionary: Dictionary;
}) {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            {dictionary.pages.privateLabel.qualityEyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-white md:text-5xl">
            {dictionary.pages.privateLabel.qualityTitle}
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted">
            {dictionary.pages.privateLabel.qualityDescription}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {dictionary.pages.privateLabel.qualityPoints.map((point) => (
            <div key={point} className="incar-card-elevated rounded-lg p-5">
              <p className="font-semibold text-white">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
