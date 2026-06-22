type TrustCardProps = {
  title: string;
  description: string;
};

export function TrustCard({ title, description }: TrustCardProps) {
  return (
    <div className="bg-surface p-5">
      <p className="text-xl font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}
