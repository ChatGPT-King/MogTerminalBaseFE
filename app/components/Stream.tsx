import { cn } from '@coinbase/onchainkit/theme';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTransactionCount } from 'wagmi';
import { AGENT_WALLET_ADDRESS, DEFAULT_PROMPT } from '../constants';
import useChat from '../hooks/useChat';
import type { AgentMessage, StreamEntry } from '../types';
import { markdownToPlainText } from '../utils';
import StreamItem from './StreamItem';

type StreamProps = {
  className?: string;
};

export default function Stream({ className }: StreamProps) {
  const [streamEntries, setStreamEntries] = useState<StreamEntry[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isThinking, setIsThinking] = useState(true);
  const [loadingDots, setLoadingDots] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSuccess = useCallback((messages: AgentMessage[]) => {
    let message = messages.find((res) => res.event === 'agent');
    if (!message) {
      message = messages.find((res) => res.event === 'tools');
    }
    if (!message) {
      message = messages.find((res) => res.event === 'error');
    }
    const streamEntry: StreamEntry = {
      timestamp: new Date(),
      content: markdownToPlainText(message?.data || ''),
      type: 'agent',
    };
    setIsThinking(false);
    setStreamEntries((prev) => [...prev, streamEntry]);
    setTimeout(() => {
      setIsThinking(true);
    }, 800);
  }, []);

  const { postChat, isLoading } = useChat({
    onSuccess: handleSuccess,
  });

  // Initial platform instructions
  useEffect(() => {
    if (!isLoading && !isInitialized) {
      // Show platform instructions immediately
      const platformEntry: StreamEntry = {
        timestamp: new Date(),
        content: "IMPORTANT PLATFORM GUIDELINES:⚠️ THIS IS AN EXPERIMENT 🚨 where YOU control the Agent's wallet! ENTRY REQUIREMENTS: Minimum deposit 0.01 ETH (Base Mainnet). EARLY SUPPORTER STATUS: Deposit 1.0 ETH for priority withdrawal access when enabled. COMMUNITY BENEFITS: Direct influence over Agent's actions, early supporter privileges, community-driven decisions. IMPORTANT SAFEGUARDS: Deposits non-reversible until withdrawal launch, all transactions on Base Mainnet are final, smart contract interactions permanent. SAFETY: Always verify wallet addresses, never share private keys/seeds. SUPPORT: Connect with MogTerminal on 𝕏 or tag ChatGPTKing. See Docs for details. By participating, you agree to these guidelines and join our decentralized community.",
        type: 'platform_instructions',
      };
      setStreamEntries([platformEntry]);

      // Trigger initial agent stream
      postChat(DEFAULT_PROMPT);

      setIsInitialized(true);
    }
  }, [isLoading, postChat]);

  // Subsequent streams at longer intervals
  useEffect(() => {
    if (!isInitialized) return;

    const streamInterval = setInterval(() => {
      if (!isLoading) {
        postChat(DEFAULT_PROMPT);
      }
    }, 300000); // Every 5 minutes after initial stream

    return () => clearInterval(streamInterval);
  }, [isLoading, postChat, isInitialized]);

  // Platform instructions interval (longer interval)
  useEffect(() => {
    if (!isInitialized) return;

    const platformInstructionsInterval = setInterval(() => {
      if (!isLoading) {
        const streamEntry: StreamEntry = {
          timestamp: new Date(),
          content: "IMPORTANT PLATFORM GUIDELINES:⚠️ THIS IS AN EXPERIMENT 🚨 where YOU control the Agent's wallet! ENTRY REQUIREMENTS: Minimum deposit 0.01 ETH (Base Mainnet). EARLY SUPPORTER STATUS: Deposit 1.0 ETH for priority withdrawal access when enabled. COMMUNITY BENEFITS: Direct influence over Agent's actions, early supporter privileges, community-driven decisions. IMPORTANT SAFEGUARDS: Deposits non-reversible until withdrawal launch, all transactions on Base Mainnet are final, smart contract interactions permanent. SAFETY: Always verify wallet addresses, never share private keys/seeds. SUPPORT: Connect with MogTerminal on 𝕏 or tag ChatGPTKing. See Docs for details. By participating, you agree to these guidelines and join our decentralized community.",
          type: 'platform_instructions'
        };
        setStreamEntries((prev) => [...prev, streamEntry]);
      }
    }, 300000); // Every 5 minutes after initial instruction

    return () => clearInterval(platformInstructionsInterval);
  }, [isLoading, isInitialized]);

  // Scroll to bottom effect
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [streamEntries]);

  // Loading dots animation
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setLoadingDots((prev) => (prev.length >= 3 ? '' : `${prev}.`));
    }, 500);

    return () => clearInterval(dotsInterval);
  }, []);

  const { data: transactionCount } = useTransactionCount({
    address: AGENT_WALLET_ADDRESS,
    query: { refetchInterval: 5000 },
  });

  return (
    <div className={cn('flex w-full flex-col md:flex md:w-1/2', className)}>
      <div className="flex items-center border-[#5788FA]/50 border-b p-2">
        Total transactions: {transactionCount}
      </div>
      <div className="max-w-full flex-grow overflow-y-auto p-4 pb-20">
        <p className="text-zinc-500">Streaming real-time...</p>
        <div className="mt-4 space-y-2" role="log" aria-live="polite">
          {streamEntries.map((entry, index) => (
            <StreamItem
              key={`${entry.timestamp.toDateString()}-${index}`}
              entry={entry}
            />
          ))}
        </div>
        {isThinking && (
          <div className="mt-4 flex items-center text-[#5788FA] opacity-70">
            <span className="max-w-full font-mono">
              Agent is observing{loadingDots}
            </span>
          </div>
        )}
        <div className="mt-3" ref={bottomRef} />
      </div>
    </div>
  );
}