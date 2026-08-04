export const sampleDataEnabled =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_ENABLE_SAMPLE_DATA === "true";
