import type { CategoryInfo } from '../types';

export const categories: CategoryInfo[] = [
  { name: 'HOME', label: 'Home', color: 'text-gray-700 dark:text-gray-300', bgColor: 'bg-gray-100 dark:bg-gray-700' },
  { name: 'STORY', label: 'Story', color: 'text-purple-700 dark:text-purple-300', bgColor: 'bg-purple-100 dark:bg-purple-900' },
  { name: 'TENDANCES', label: 'Tendances', color: 'text-pink-700 dark:text-pink-300', bgColor: 'bg-pink-100 dark:bg-pink-900' },
  { name: 'IA', label: 'IA', color: 'text-blue-700 dark:text-blue-300', bgColor: 'bg-blue-100 dark:bg-blue-900' },
  { name: 'CLOUD', label: 'Cloud', color: 'text-cyan-700 dark:text-cyan-300', bgColor: 'bg-cyan-100 dark:bg-cyan-900' },
  { name: 'DATA', label: 'Data', color: 'text-green-700 dark:text-green-300', bgColor: 'bg-green-100 dark:bg-green-900' },
  { name: 'BACK', label: 'Back', color: 'text-orange-700 dark:text-orange-300', bgColor: 'bg-orange-100 dark:bg-orange-900' },
  { name: 'FRONT', label: 'Front', color: 'text-yellow-700 dark:text-yellow-300', bgColor: 'bg-yellow-100 dark:bg-yellow-900' },
  { name: 'SECURITE', label: 'Sécurité', color: 'text-red-700 dark:text-red-300', bgColor: 'bg-red-100 dark:bg-red-900' },
  { name: 'MOBILE', label: 'Mobile', color: 'text-indigo-700 dark:text-indigo-300', bgColor: 'bg-indigo-100 dark:bg-indigo-900' },
  { name: 'PRODUCT', label: 'Product', color: 'text-teal-700 dark:text-teal-300', bgColor: 'bg-teal-100 dark:bg-teal-900' },
  { name: 'RH', label: 'RH', color: 'text-rose-700 dark:text-rose-300', bgColor: 'bg-rose-100 dark:bg-rose-900' },
  { name: 'PODCAST', label: 'Podcast', color: 'text-violet-700 dark:text-violet-300', bgColor: 'bg-violet-100 dark:bg-violet-900' },
  { name: 'AUTEURS', label: 'Auteurs', color: 'text-slate-700 dark:text-slate-300', bgColor: 'bg-slate-100 dark:bg-slate-900' },
];

export const getCategoryInfo = (categoryName: string): CategoryInfo | undefined => {
  return categories.find(cat => cat.name === categoryName);
};
