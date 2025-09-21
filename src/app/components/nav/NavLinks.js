"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';
import Tooltip from '../ui/Tooltip';
import { MenuRoutes, SecondaryRoutes } from '@/lib/constants';

export default function NavLinks() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowMore(false);
  }, [pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const isActive = (href) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const renderNavLink = (route, isMobile = false) => {
    const active = isActive(route.href);
    
    return (
      <Link
        key={route.href}
        href={route.href}
        className={`
          group relative flex items-center gap-3 p-3
          transition-all duration-300 ease-in-out
          border-2 overflow-hidden rounded-sm
          ${isMobile ? 'w-full justify-start' : 'justify-center'}
          ${active 
            ? "bg-gradient-to-r from-purple-60/20 to-purple-70/20 border-purple-60/50 shadow-lg shadow-purple-60/20" 
            : "border-transparent hover:border-gray-20 hover:bg-gray-15/50"}
        `}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        {/* Background glow effect for active state */}
        {active && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-60/10 to-purple-70/10 blur-sm -z-10"></div>
        )}
        
        {/* Icon */}
        <route.icon 
          size={isMobile ? 20 : 22} 
          className={`transition-all duration-300 ${
            active 
              ? 'text-purple-75 scale-110' 
              : 'text-gray-50 group-hover:text-white group-hover:scale-105'
          }`} 
        />
        
        {/* Mobile label */}
        {isMobile && (
          <div className="flex-1">
            <div className={`font-medium transition-colors ${
              active ? 'text-purple-75' : 'text-gray-50 group-hover:text-white'
            }`}>
              {route.name}
            </div>
            {route.description && (
              <div className="text-xs text-gray-60 mt-0.5">
                {route.description}
              </div>
            )}
          </div>
        )}

        {/* Badge */}
        {route.badge && (
          <div className={`absolute -top-1 -right-1 px-1.5 py-0.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-lg ${
            isMobile ? 'relative top-0 right-0 ml-auto' : ''
          }`}>
            {route.badge}
          </div>
        )}

        {/* Active indicator */}
        {active && !isMobile && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-60 rounded-full"></div>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-2">
        {/* Main routes */}
        <div className="flex gap-2">
          {MenuRoutes.slice(0, 4).map((route) => (
            <Tooltip key={route.href} text={route.name} description={route.description}>
              {renderNavLink(route)}
            </Tooltip>
          ))}
        </div>

        {/* More dropdown for remaining routes */}
        {(MenuRoutes.length > 4 || SecondaryRoutes.length > 0) && (
          <div className="relative">
            <button
              onClick={() => setShowMore(!showMore)}
              className={`
                flex items-center gap-2 p-3 rounded-sm
                transition-all duration-300
                border-2
                ${showMore 
                  ? "bg-gray-15 border-gray-20" 
                  : "border-transparent hover:border-gray-20 hover:bg-gray-15/50"}
              `}
            >
              <Menu size={22} className="text-gray-50" />
              <ChevronDown 
                size={16} 
                className={`text-gray-50 transition-transform ${showMore ? 'rotate-180' : ''}`} 
              />
            </button>

            {showMore && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowMore(false)}
                ></div>
                <div className="absolute right-0 top-full mt-2 w-64 bg-gray-10 border border-gray-20 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="py-2">
                    {/* Remaining main routes */}
                    {MenuRoutes.slice(4).map((route) => renderNavLink(route, true))}
                    
                    {/* Secondary routes */}
                    {SecondaryRoutes.length > 0 && MenuRoutes.length > 4 && (
                      <div className="border-t border-gray-20 my-2"></div>
                    )}
                    {SecondaryRoutes.map((route) => renderNavLink(route, true))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl border-2 border-transparent hover:border-gray-20 hover:bg-gray-15/50 transition-all"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X size={24} className="text-gray-50" />
          ) : (
            <Menu size={24} className="text-gray-50" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-gray-08 border-l border-gray-20 z-50 overflow-y-auto lg:hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Navigation</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-15 transition-colors"
                >
                  <X size={20} className="text-gray-50" />
                </button>
              </div>

              <div className="space-y-2">
                {MenuRoutes.map((route) => renderNavLink(route, true))}
                
                {SecondaryRoutes.length > 0 && (
                  <>
                    <div className="border-t border-gray-20 my-4"></div>
                    <div className="space-y-2">
                      {SecondaryRoutes.map((route) => renderNavLink(route, true))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}