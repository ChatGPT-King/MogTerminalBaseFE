// app/components/MatrixEntry.tsx
import { useState, useEffect } from 'react';

type MatrixEntryProps = {
  onComplete: () => void;
};

export default function MatrixEntry({ onComplete }: MatrixEntryProps) {
  const [text, setText] = useState('');
  const [showRiddle, setShowRiddle] = useState(false);
  const [answer, setAnswer] = useState('');
  const platformText = "IMPORTANT PLATFORM GUIDELINES:⚠️ THIS IS AN EXPERIMENT 🚨 where YOU control the Agent's wallet! ENTRY REQUIREMENTS: Minimum deposit 0.01 ETH (Base Mainnet). EARLY SUPPORTER STATUS: Deposit 1.0 ETH for priority withdrawal access when enabled. COMMUNITY BENEFITS: Direct influence over Agent's actions, early supporter privileges, community-driven decisions. IMPORTANT SAFEGUARDS: Deposits non-reversible until withdrawal launch, all transactions on Base Mainnet are final, smart contract interactions permanent. SAFETY: Always verify wallet addresses, never share private keys/seeds. SUPPORT: Engage with MogTerminal on 𝕏 or tag ChatGPTKing. See Docs for details. By participating, you agree to these guidelines and join our decentralized community.q"; // Your full text

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < platformText.length) {
        setText((prev) => prev + platformText.charAt(index));
        index++;
      } else {
        clearInterval(interval);
        setShowRiddle(true);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleRiddleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple riddle: "I am not alive, but I grow; I don&apos;t have lungs, but I need air; I don&apos;t have a mouth, but water kills me. What am I?"
    if (answer.toLowerCase().includes('fire')) {
      onComplete();
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-black p-4 font-mono text-[#00ff00]">
      <pre className="whitespace-pre-wrap">{text}</pre>

      {showRiddle && (
        <form onSubmit={handleRiddleSubmit} className="mt-8">
          <div className="mb-4">
            <p>TO ENTER, SOLVE THIS RIDDLE:</p>
            <p className="mt-2 text-[#5788FA]">
              I am not alive, but I grow;
              I don&apos;t have lungs, but I need air;
              I don&apos;t have a mouth, but water kills me.
              What am I?
            </p>
          </div>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full bg-black p-2 text-[#00ff00] border border-[#00ff00]"
            placeholder="Enter your answer..."
          />
        </form>
      )}
    </div>
  );
}