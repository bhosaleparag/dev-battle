"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import NavLinks from './NavLinks';
import UserMenu from './UserMenu';
import Typography from '../ui/Typography';
import { useSound } from '@/context/SoundContext';

export default function NavBar() {
  const { play } = useSound();
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`
      sticky top-0 z-40 w-full transition-all duration-300
      ${isScrolled 
        ? 'bg-gray-10/95 backdrop-blur-lg border-b border-gray-20/50 shadow-lg' 
        : 'bg-gray-10 border-b border-gray-20'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href='/' 
            onClick={() => play('click')}
            className="flex items-center gap-3 group transition-all duration-300 hover:scale-105"
          >
            <div className="relative">
              <Image 
                src='/devLogo.png'
                alt='Dev Battle logo' 
                width={45} 
                height={45}
                className="transition-transform duration-300 group-hover:rotate-12"
              />
              {/* Glow effect */}
              <div className="absolute inset-0 bg-purple-60/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
            <div className="hidden sm:block">
              <Typography variant="h3" as="h1" className="bg-gradient-to-r from-white to-gray-50 bg-clip-text text-transparent font-bold">
                Dev Battle
              </Typography>
              <div className="text-xs text-gray-60 -mt-1">
                Quiz • Compete • Excel
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className='flex-1 flex justify-end lg:justify-center'>
            <NavLinks />
          </div>

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}