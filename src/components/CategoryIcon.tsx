import React from 'react';
import {
  GraduationCap,
  HeartPulse,
  HelpCircle,
  CheckCircle2,
  Users,
  ShieldAlert,
  Stethoscope,
  BookOpen,
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'HeartPulse':
      return <HeartPulse className={className} />;
    case 'HelpCircle':
      return <HelpCircle className={className} />;
    case 'CheckCircle2':
      return <CheckCircle2 className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'ShieldAlert':
      return <ShieldAlert className={className} />;
    case 'Stethoscope':
      return <Stethoscope className={className} />;
    default:
      return <BookOpen className={className} />;
  }
};
