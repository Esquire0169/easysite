"use client";

import type { ReactNode } from "react";
import { CursorGlow } from "./CursorGlow";
import { DebugMarkers } from "./DebugMarkers";
import { LagLayers } from "./LagLayers";
import { PageLoader } from "./PageLoader";
import { RouteTransition } from "./RouteTransition";
import { SmoothScroll } from "./SmoothScroll";
import { SnapSections } from "./SnapSections";
import { TabTitle } from "./TabTitle";

type MotionRootProps = {
  children: ReactNode;
};

export function MotionRoot({ children }: MotionRootProps) {
  return (
    <>
      <PageLoader />
      <SmoothScroll />
      <DebugMarkers />
      <LagLayers />
      <SnapSections />
      <TabTitle />
      <CursorGlow />
      <RouteTransition>{children}</RouteTransition>
    </>
  );
}
