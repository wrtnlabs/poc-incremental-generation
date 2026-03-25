import type { AstPatch } from "../domain/patch";

const formatCandidateKeys = (candidate: AstPatch): string => {
  const keys = Object.keys(candidate);
  return keys.length === 0 ? "none" : keys.join(", ");
};

export const formatAttemptStartLog = (props: {
  attempt: number;
  maxAttempts: number;
  candidate: AstPatch;
  latestFeedback: unknown;
}): string => [
  `[Workflow] Attempt ${props.attempt}/${props.maxAttempts} started`,
  `[Workflow] Current candidate keys: ${formatCandidateKeys(props.candidate)}`,
  `[Workflow] Latest feedback: ${JSON.stringify(props.latestFeedback)}`,
].join("\n");

export const formatPatchReceivedLog = (props: {
  attempt: number;
  patch: AstPatch;
}): string =>
  `[Workflow] Attempt ${props.attempt} produced patch keys: ${formatCandidateKeys(props.patch)}`;

export const formatAttemptResultLog = (props: {
  attempt: number;
  terminal: boolean;
  missing: number;
  incomplete: number;
  invalid: number;
}): string =>
  props.terminal
    ? `[Workflow] Attempt ${props.attempt} satisfied strict AST`
    : `[Workflow] Attempt ${props.attempt} pending strict AST (missing=${props.missing}, incomplete=${props.incomplete}, invalid=${props.invalid})`;

export const formatMicroAgenticaRequestLog = (props: {
  attempt: number;
  maxAttempts: number;
  model: string;
  hasCustomBaseUrl: boolean;
}): string => [
  `[MicroAgentica] Requesting patch for attempt ${props.attempt}/${props.maxAttempts}`,
  `[MicroAgentica] Model: ${props.model}`,
  `[MicroAgentica] Custom base URL: ${props.hasCustomBaseUrl ? "enabled" : "disabled"}`,
].join("\n");

export const formatMicroAgenticaResponseLog = (props: {
  attempt: number;
  patch: AstPatch;
}): string =>
  `[MicroAgentica] Received patch for attempt ${props.attempt} with keys: ${formatCandidateKeys(props.patch)}`;
