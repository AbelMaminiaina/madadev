import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = '' }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-xl">D</span>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-primary dark:text-white leading-tight">
          Dev Stories
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
          Tech Blog
        </span>
      </div>
    </Link>
  );
};
