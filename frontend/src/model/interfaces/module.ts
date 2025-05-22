import React, { type ReactNode } from 'react';

interface IModuleEntry {
  readonly name: string;
  readonly displayName: string;
  readonly route?: string;
}

interface IModule {
  readonly name: string;
  readonly displayName: string;
  readonly remoteUrl: string;
  readonly exposes: readonly IModuleEntry[];
}

export interface IModuleRegistry {
  readonly modules: readonly IModule[];
}

export interface ILazyRouteProps {
  key: string;
  label?: string;
  element: React.JSX.Element;
  fallbackComponent: React.JSX.Element;
  errorComponent: React.JSX.Element;
  path: string;
  onError: () => void;
  icon?: ReactNode;
}
