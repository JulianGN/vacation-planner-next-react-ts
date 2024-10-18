import React from "react";
import {
  ProgressSpinner,
  ProgressSpinnerProps,
} from "primereact/progressspinner";

export default function LoadingSpinner(props: ProgressSpinnerProps) {
  return (
    <ProgressSpinner strokeWidth="4" color="var(--vc-primary)" {...props} />
  );
}
