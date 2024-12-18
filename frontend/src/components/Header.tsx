import { Logo } from "../icons/Logo";
import { Button } from "./Button";

interface HeaderProps {
  isLoggedIn: boolean;
  onCreateContent: () => void;
  onShareBrain: () => void;
  onLogin: () => void;
}

export function Header({
  isLoggedIn,
  onCreateContent,
  onShareBrain,
  onLogin,
}: HeaderProps) {
  return (
    <header className="bg-gray-800 text-white flex items-center justify-between p-4">
      {/* Logo Section */}
      <div className="flex items-center">
        <Logo />
        <span className="ml-2 text-xl font-bold">Second Brain</span>
      </div>

      {/* Navigation/Buttons */}
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <Button text="Create Content" variant="primary" onClick={onCreateContent} />
            <Button text="Share Brain" variant="primary" onClick={onShareBrain} />
          </>
        ) : (
          <Button text="Login" variant="secondary" onClick={onLogin} />
        )}
      </div>
    </header>
  );
}
