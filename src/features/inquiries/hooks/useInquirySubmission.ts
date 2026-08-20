"use client";

import { useRef, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { getDictionary } from "@/i18n/dictionaries";
import { submitInquiry } from "../api/client";
import { InquiryApiError, retryDelayMilliseconds, type InquiryErrorKind } from "../api/errors";
import type { InquiryPayload, InquirySubmissionResponse } from "../api/contracts";

export type InquirySubmissionState = "idle" | "submitting" | "success" | "recoverable-error";

/**
 * Shared submission state machine for the three simple public forms
 * (Contact / Private Label / Catalog Request). Mirrors the RFQ module's
 * RFQForm submission pattern (submitting/success/recoverable-error states,
 * a submission guard against double-submit, and a Retry-After countdown)
 * but factored into one hook since these three forms are one-shot
 * submissions with no multi-step attempt-resume machinery to share.
 */
export function useInquirySubmission() {
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);
  const [state, setState] = useState<InquirySubmissionState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryBlocked, setRetryBlocked] = useState(false);
  const [response, setResponse] = useState<InquirySubmissionResponse | null>(null);
  const submissionGuardRef = useRef(false);
  const retryTimerRef = useRef<number | null>(null);

  function errorMessageForKind(kind: InquiryErrorKind): string {
    const errors = dictionary.forms.common.submissionErrors;
    const messages: Record<InquiryErrorKind, string> = {
      validation: errors.validation,
      "idempotency-conflict": errors.idempotencyConflict,
      "payload-too-large": errors.payloadTooLarge,
      "unsupported-media-type": errors.unsupportedMediaType,
      "rate-limit": errors.rateLimit,
      capacity: errors.capacity,
      "reference-generation": errors.referenceGeneration,
      network: errors.network,
      timeout: errors.timeout,
      server: errors.server,
      unknown: errors.unknown,
    };
    return messages[kind];
  }

  async function submit(payload: InquiryPayload): Promise<boolean> {
    if (submissionGuardRef.current) return false;
    submissionGuardRef.current = true;
    setState("submitting");
    setErrorMessage(null);

    try {
      const idempotencyKey = crypto.randomUUID();
      const result = await submitInquiry(payload, idempotencyKey);
      setResponse(result);
      setState("success");
      return true;
    } catch (error) {
      const apiError =
        error instanceof InquiryApiError ? error : new InquiryApiError("unknown", null, null);
      setErrorMessage(errorMessageForKind(apiError.kind));
      setState("recoverable-error");

      const retryDelay = retryDelayMilliseconds(apiError);
      if (retryDelay > 0) {
        setRetryBlocked(true);
        if (retryTimerRef.current !== null) window.clearTimeout(retryTimerRef.current);
        retryTimerRef.current = window.setTimeout(() => {
          retryTimerRef.current = null;
          setRetryBlocked(false);
        }, retryDelay);
      }
      return false;
    } finally {
      submissionGuardRef.current = false;
    }
  }

  return { state, errorMessage, retryBlocked, response, submit };
}
