import React from "react";
import LoadingSpinner from "@/components/shared/Loading/LoadingSpinner";

interface LoadingSpinnerGlobalProps {
  message?: string;
}

export default function LoadingSpinnerGlobal(props: LoadingSpinnerGlobalProps) {
  return (
    <div className="loading-spinner-global">
      <LoadingSpinner message={props.message} />
    </div>
  );
}
