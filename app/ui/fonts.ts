import { Inter, Lusitana, Roboto, Ubuntu_Condensed } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });

export const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const roboto = Roboto({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['500', '700'],
  display: 'swap',
});

export const ubuntu = Ubuntu_Condensed({
  subsets: ['cyrillic', 'latin'],
  weight: ['400'],
  display: 'swap',
});
