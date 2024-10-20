"use client";
import React from "react";
import {
  ProgressSpinner,
  ProgressSpinnerProps,
} from "primereact/progressspinner";

interface LoadingSpinnerProps extends ProgressSpinnerProps {
  message?: string;
}

export default function LoadingSpinner(props: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <ProgressSpinner
        strokeWidth="4"
        color="var(--vc-primary)"
        aria-label="Carregando"
        {...props}
      />
      {props.message && <small>{props.message}</small>}
    </div>
  );
}
