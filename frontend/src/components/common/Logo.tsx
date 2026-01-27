import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = '' }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <img
        src="/logo.svg"
        alt="Dev Stories"
        className="h-14 w-auto"
      />
      <div className="flex flex-col">
        <span className="text-lg font-bold tracking-wide leading-tight bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
          DEV STORIES
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Tech Blog
        </span>
      </div>
    </Link>
  );
};
