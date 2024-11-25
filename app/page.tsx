'use client';

import { useState } from 'react';
import AgentComponent from './components/Agent';
import MatrixEntry from './components/MatrixEntry';

export default function App() {
  const [isEntryComplete, setIsEntryComplete] = useState(false);

  if (!isEntryComplete) {
    return <MatrixEntry onComplete={() => setIsEntryComplete(true)} />;
  }

  return <AgentComponent />;
}