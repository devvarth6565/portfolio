import React, { useState, useRef, useEffect } from 'react';

interface CommandHistory {
  command: string;
  output: string | React.ReactNode;
}

const STARTUP_TEXT = `Microsoft Windows XP [Version 5.1.2600]
(C) Copyright 1985-2001 Microsoft Corp.

Welcome to Devvarth's Terminal! 
If you are new to terminals, type 'help' and press Enter to see available commands.
Type 'game' to play a quick interactive mini-game.
`;

interface TerminalProps {
  onCommand?: (cmd: string) => boolean;
}

export const TerminalContent = ({ onCommand }: TerminalProps) => {
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [input, setInput] = useState('');
  const [currentPath, setCurrentPath] = useState('C:\\Documents and Settings\\Dev');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Game state
  const [gameState, setGameState] = useState<'none' | 'guessing'>('none');
  const [secretNumber, setSecretNumber] = useState(0);
  const [attempts, setAttempts] = useState(0);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      setInput('');
      
      if (!cmd) {
        setHistory(prev => [...prev, { command: `${currentPath}>`, output: '' }]);
        return;
      }

      let output: string | React.ReactNode = '';

      // Handle active game state
      if (gameState === 'guessing') {
        const guess = parseInt(cmd);
        if (cmd.toLowerCase() === 'quit' || cmd.toLowerCase() === 'exit') {
            setGameState('none');
            output = "Game exited. Returning to terminal.";
        } else if (isNaN(guess)) {
            output = "Please enter a valid number, or type 'quit' to exit the game.";
        } else {
            const currentAttempt = attempts + 1;
            setAttempts(currentAttempt);
            if (guess === secretNumber) {
                output = `🎉 Congratulations! You guessed the number in ${currentAttempt} attempts!\nGame over. Type 'game' to play again.`;
                setGameState('none');
            } else if (guess < secretNumber) {
                output = "Too low! Try a higher number:";
            } else {
                output = "Too high! Try a lower number:";
            }
        }
        setHistory(prev => [...prev, { command: `${currentPath}>${cmd}`, output }]);
        return;
      }

      const args = cmd.split(' ').filter(Boolean);
      const mainCmd = args[0].toLowerCase();

      switch (mainCmd) {
        case 'help':
          output = (
            <div className="flex flex-col gap-1 mt-1 mb-1">
              <span className="text-[#00ff00]">--- Navigation Commands ---</span>
              <span><span className="font-bold text-white w-24 inline-block">ABOUT</span>      Opens the About Me section</span>
              <span><span className="font-bold text-white w-24 inline-block">RESUME</span>     Opens my interactive Resume</span>
              <span><span className="font-bold text-white w-24 inline-block">CODESURFER</span> Opens the CodeSurfer Live project</span>
              <span><span className="font-bold text-white w-24 inline-block">TECHCONNECT</span>Opens the techConnect project</span>
              <span><span className="font-bold text-white w-24 inline-block">GITHUB</span>     Opens my GitHub profile</span>
              <br/>
              <span className="text-[#00ff00]">--- System Commands ---</span>
              <span><span className="font-bold text-white w-24 inline-block">HELP</span>       Shows this list of commands</span>
              <span><span className="font-bold text-white w-24 inline-block">GAME</span>       Play a quick interactive mini-game</span>
              <span><span className="font-bold text-white w-24 inline-block">CLEAR/CLS</span>  Clears the terminal screen</span>
              <span><span className="font-bold text-white w-24 inline-block">DATE</span>       Displays the current date</span>
              <span><span className="font-bold text-white w-24 inline-block">DIR/LS</span>     Displays a list of files and directories</span>
              <span><span className="font-bold text-white w-24 inline-block">ECHO</span>       Displays your message back to you</span>
              <span><span className="font-bold text-white w-24 inline-block">SYSTEMINFO</span> Displays system hardware specs</span>
              <span><span className="font-bold text-white w-24 inline-block">VER</span>        Displays the Windows version</span>
              <span><span className="font-bold text-white w-24 inline-block">WHOAMI</span>     Displays the current user</span>
              <span className="text-[#00ff00] mt-1">Hint: Try typing 'resume' or 'codesurfer' to navigate the desktop!</span>
            </div>
          );
          break;
        case 'game':
        case 'play':
          setGameState('guessing');
          setSecretNumber(Math.floor(Math.random() * 10) + 1);
          setAttempts(0);
          output = "🎮 Let's play a game!\nI'm thinking of a number between 1 and 10.\nType your guess (or type 'quit' to exit):";
          break;

        case 'cls':
        case 'clear':
          setHistory([]);
          return;
        case 'date':
          output = `The current date is: ${new Date().toLocaleDateString()}`;
          break;
        case 'dir':
        case 'ls':
          output = (
            <div className="flex flex-col">
              <span> Volume in drive C has no label.</span>
              <span> Volume Serial Number is 1337-CODE</span>
              <br/>
              <span> Directory of {currentPath}</span>
              <br/>
              <span>10/24/2023  10:00 AM    &lt;DIR&gt;          .</span>
              <span>10/24/2023  10:00 AM    &lt;DIR&gt;          ..</span>
              <span>10/24/2023  10:05 AM    &lt;DIR&gt;          Desktop</span>
              <span>10/24/2023  10:10 AM    &lt;DIR&gt;          Documents</span>
              <span>10/24/2023  11:20 AM             4,096 resume.pdf</span>
              <span>               1 File(s)          4,096 bytes</span>
              <span>               4 Dir(s)  100,000,000,000 bytes free</span>
            </div>
          );
          break;
        case 'echo':
          output = args.slice(1).join(' ');
          break;
        case 'systeminfo':
          output = (
            <div className="flex flex-col">
              <span>OS Name:                   Microsoft Windows XP Professional</span>
              <span>OS Version:                5.1.2600 Service Pack 3 Build 2600</span>
              <span>System Manufacturer:       Devvarth Systems</span>
              <span>System Model:              Agentic-86</span>
              <span>System Type:               X86-based PC</span>
              <span>Processor(s):              1 Processor(s) Installed.</span>
              <span>                           [01]: x86 Family 15 Model 4 Stepping 1 GenuineIntel ~3000 Mhz</span>
              <span>Total Physical Memory:     4,096 MB</span>
            </div>
          );
          break;
        case 'ver':
          output = 'Microsoft Windows XP [Version 5.1.2600]';
          break;
        case 'whoami':
          output = 'desktop-user\\dev';
          break;
        case 'cd':
          if (args[1]) {
            output = `The system cannot find the path specified.`;
          } else {
            output = currentPath;
          }
          break;
        default:
          let handled = false;
          if (onCommand) {
            handled = onCommand(mainCmd);
          }
          if (handled) {
            output = `Opening ${mainCmd}...`;
          } else {
            output = `'${mainCmd}' is not recognized as an internal or external command, operable program or batch file.\nType 'help' to see a list of available commands.`;
          }
      }

      setHistory(prev => [...prev, { command: `${currentPath}>${cmd}`, output }]);
    }
  };

  return (
    <div 
      className="w-full h-full bg-black text-[#c0c0c0] font-['Lucida_Console',_Consolas,_monospace] p-2 overflow-y-auto text-sm sm:text-base select-text"
      ref={containerRef}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="whitespace-pre-wrap mb-4">{STARTUP_TEXT}</div>
      
      {history.map((entry, i) => (
        <div key={i} className="mb-1">
          <div>{entry.command}</div>
          {entry.output && <div className="whitespace-pre-wrap">{entry.output}</div>}
        </div>
      ))}

      <div className="flex">
        <span className="mr-2 whitespace-pre">
          {gameState === 'guessing' ? 'Guess>' : `${currentPath}>`}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          className="flex-1 bg-transparent outline-none border-none text-[#c0c0c0]"
          spellCheck={false}
          autoFocus
        />
      </div>
    </div>
  );
};
