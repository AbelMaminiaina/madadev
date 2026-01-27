import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = '' }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <img
        src="/logo.png"
        alt="Dev Stories"
        className="h-12 w-auto"
      />
    </Link>
  );
};
