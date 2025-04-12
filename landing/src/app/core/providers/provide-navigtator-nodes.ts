// api-url.token.ts
import { InjectionToken } from '@angular/core';
import { NavigationNode } from '../types';

export const NAVIGATION_NODES = new InjectionToken<NavigationNode[]>('NAVIGATION_NODES');


export const provideNavigationNodes = (value: NavigationNode[]) => ({
    provide: NAVIGATION_NODES,
    useValue: value
}) 