import { useContext } from 'react';
import { WindowContext } from './WindowContextBase';

export function useWindows() {
  return useContext(WindowContext);
}
