import React from 'react';
import {
  BookOpen,
  Compass,
  Calculator,
  Laptop,
  FlaskConical,
  Trophy,
  Bike,
  Home,
  Armchair,
  Music,
  Shirt,
  Backpack,
  PenTool,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name.toLowerCase()) {
    case 'bookopen':
    case 'books':
      return <BookOpen className={className} />;
    case 'compass':
    case 'engineering/drafting tools':
    case 'drafting tools':
      return <Compass className={className} />;
    case 'calculator':
    case 'calculators':
      return <Calculator className={className} />;
    case 'laptop':
    case 'electronics':
      return <Laptop className={className} />;
    case 'flaskconical':
    case 'lab equipment':
      return <FlaskConical className={className} />;
    case 'trophy':
    case 'sports equipment':
    case 'sports':
      return <Trophy className={className} />;
    case 'bike':
    case 'bicycles':
      return <Bike className={className} />;
    case 'home':
    case 'hostel items':
      return <Home className={className} />;
    case 'armchair':
    case 'furniture':
      return <Armchair className={className} />;
    case 'music':
    case 'musical instruments':
      return <Music className={className} />;
    case 'shirt':
    case 'clothing':
      return <Shirt className={className} />;
    case 'backpack':
    case 'bags':
      return <Backpack className={className} />;
    case 'pentool':
    case 'stationery':
      return <PenTool className={className} />;
    case 'sparkles':
    case 'other':
      return <Sparkles className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};
