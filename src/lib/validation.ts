type FieldType = "text" | "email" | "phone" | "number" | "file";

export type ValidationField = {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  minLength?: number;
  minValue?: number;
  acceptedFileTypes?: string[];
};

export type ValidationSchema = {
  id: string;
  fields: ValidationField[];
};

export type ValidationErrors = Record<string, string>;

export const rfqFormSchema: ValidationSchema = {
  id: "rfq-form",
  fields: [
    { name: "fullName", label: "Full name", type: "text", required: true, minLength: 2 },
    { name: "company", label: "Company name", type: "text", required: true, minLength: 2 },
    { name: "country", label: "Country", type: "text", required: true, minLength: 2 },
    { name: "city", label: "City", type: "text", required: false },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "whatsapp", label: "WhatsApp number", type: "phone", required: true, minLength: 7 },
    { name: "products", label: "Interested products", type: "text", required: false },
    { name: "quantity", label: "Quantity", type: "text", required: false },
    {
      name: "file",
      label: "Upload Excel file",
      type: "file",
      required: false,
      acceptedFileTypes: [".xlsx", ".xls", ".csv"],
    },
    { name: "message", label: "Message", type: "text", required: false },
  ],
};

export const contactFormSchema: ValidationSchema = {
  id: "contact-form",
  fields: [
    { name: "fullName", label: "Full name", type: "text", required: true, minLength: 2 },
    { name: "company", label: "Company", type: "text", required: true, minLength: 2 },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "whatsapp", label: "WhatsApp", type: "phone", required: false, minLength: 7 },
    { name: "message", label: "Message", type: "text", required: false },
  ],
};

export const privateLabelFormSchema: ValidationSchema = {
  id: "private-label-form",
  fields: [
    { name: "brandName", label: "Brand name", type: "text", required: true, minLength: 2 },
    { name: "category", label: "Product category", type: "text", required: true, minLength: 2 },
    { name: "market", label: "Target market", type: "text", required: true, minLength: 2 },
    { name: "quantity", label: "Estimated quantity", type: "text", required: false },
    { name: "hasLogo", label: "Logo status", type: "text", required: true },
    { name: "contact", label: "Contact information", type: "text", required: true, minLength: 5 },
    { name: "packaging", label: "Packaging requirements", type: "text", required: false },
  ],
};

export const catalogRequestFormSchema: ValidationSchema = {
  id: "catalog-request-form",
  fields: [
    { name: "fullName", label: "Full name", type: "text", required: true, minLength: 2 },
    { name: "company", label: "Company", type: "text", required: true, minLength: 2 },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "whatsapp", label: "WhatsApp", type: "phone", required: false, minLength: 7 },
    { name: "catalogId", label: "Catalog", type: "text", required: true },
  ],
};

export function validateObject(
  schema: ValidationSchema,
  values: Record<string, FormDataEntryValue | undefined>,
): ValidationErrors {
  return schema.fields.reduce<ValidationErrors>((errors, field) => {
    const value = values[field.name];
    const textValue = typeof value === "string" ? value.trim() : "";

    if (field.required && !textValue && field.type !== "file") {
      errors[field.name] = `${field.label} is required.`;
      return errors;
    }

    if (field.minLength && textValue && textValue.length < field.minLength) {
      errors[field.name] = `${field.label} is too short.`;
      return errors;
    }

    if (field.type === "email" && textValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(textValue)) {
      errors[field.name] = "Enter a valid email address.";
      return errors;
    }

    if (field.type === "phone" && textValue && !/^\+?[0-9\s()-]{7,}$/.test(textValue)) {
      errors[field.name] = "Enter a valid phone or WhatsApp number.";
    }

    return errors;
  }, {});
}
