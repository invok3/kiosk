"use client";

import React from "react";

// Types for components that accept children
type ProviderComponent = React.ComponentType<{ children: React.ReactNode }>;

interface ComposerProps {
  // Array of providers ordered from OUTSIDE to INSIDE
  providers: ProviderComponent[];
  children: React.ReactNode;
}

export function Composer({ providers, children }: ComposerProps) {
  return (
    <>
      {providers.reduceRight(
        (acc, Provider) => <Provider>{acc}</Provider>,
        children
      )}
    </>
  );
}