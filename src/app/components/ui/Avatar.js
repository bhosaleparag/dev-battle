"use client"
import React, { useState, useEffect } from 'react';
import { User, Loader2 } from 'lucide-react';
import Image from 'next/image';

const Avatar = ({
  // Image props
  src = null,
  alt = '',
  fallbackText = '',
  
  // Size variants
  size = 'md',
  
  // Status indicator
  status = null, // 'online', 'offline', 'away', 'busy', 'invisible'
  
  // Styling
  className = '',
  rounded = true,
  border = false,
  
  // Behavior
  onClick = null,
  disabled = false,
  loading = false,
  
  // Accessibility
  ariaLabel = '',
  
  // Custom colors for fallback
  fallbackBg = 'from-purple-500 to-purple-600',
  
  // Animation
  animated = true
}) => {
  const [imageLoading, setImageLoading] = useState(!!src);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset states when src changes
  useEffect(() => {
    if (src) {
      setImageLoading(true);
      setImageError(false);
      setImageLoaded(false);
    } else {
      setImageLoading(false);
      setImageError(false);
      setImageLoaded(false);
    }
  }, [src]);

  // Size configurations - now includes container padding to accommodate status
  const sizeClasses = {
    xs: {
      width: 25, height: 25,
      avatar: 'w-6 h-6',
      container: 'w-8 h-8', // Extra space for status
      text: 'text-xs',
      icon: 'w-3 h-3',
      status: 'w-2 h-2 bottom-1 right-1',
      loader: 'w-3 h-3'
    },
    sm: {
      width: 30, height: 30,
      avatar: 'w-8 h-8',
      container: 'w-10 h-10',
      text: 'text-xs',
      icon: 'w-4 h-4',
      status: 'w-2.5 h-2.5 bottom-1 right-2',
      loader: 'w-4 h-4'
    },
    md: {
      width: 40, height: 40,
      avatar: 'w-10 h-10',
      container: 'w-12 h-12',
      text: 'text-sm',
      icon: 'w-5 h-5',
      status: 'w-3 h-3 bottom-1 right-2',
      loader: 'w-5 h-5'
    },
    lg: {
      width: 50, height: 50,
      avatar: 'w-12 h-12',
      container: 'w-14 h-14',
      text: 'text-base',
      icon: 'w-6 h-6',
      status: 'w-3.5 h-3.5 bottom-1 right-2',
      loader: 'w-6 h-6'
    },
    xl: {
      width: 55, height: 55,
      avatar: 'w-16 h-16',
      container: 'w-18 h-18',
      text: 'text-lg',
      icon: 'w-8 h-8',
      status: 'w-4 h-4 bottom-1 right-2',
      loader: 'w-8 h-8'
    },
    '2xl': {
      width: 60, height: 60,
      avatar: 'w-20 h-20',
      container: 'w-22 h-22',
      text: 'text-xl',
      icon: 'w-10 h-10',
      status: 'w-5 h-5 bottom-1 right-2',
      loader: 'w-10 h-10'
    }
  };

  // Status indicator colors and styles
  const statusStyles = {
    online: {
      bg: 'bg-green-500',
      ring: 'ring-green-500/30',
      pulse: true
    },
    offline: {
      bg: 'bg-gray-400',
      ring: 'ring-gray-400/30',
      pulse: false
    },
    away: {
      bg: 'bg-yellow-500',
      ring: 'ring-yellow-500/30',
      pulse: true
    },
    busy: {
      bg: 'bg-red-500',
      ring: 'ring-red-500/30',
      pulse: false
    },
    invisible: {
      bg: 'bg-none',
      pulse: false
    }
  };

  const sizeConfig = sizeClasses[size] || sizeClasses.md;
  const statusConfig = status ? statusStyles[status] : null;

  // Handle image loading
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
    setImageLoaded(false);
  };

  // Generate fallback text from name or use provided fallback
  const getFallbackText = () => {
    if (fallbackText) return fallbackText;
    if (alt) {
      return alt.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    }
    return '?';
  };

  // Container classes (outer wrapper that includes space for status)
  const containerClasses = [
    sizeConfig.container,
    'relative flex items-center justify-center',
    className
  ].filter(Boolean).join(' ');

  // Avatar classes (the actual avatar circle)
  const avatarClasses = [
    sizeConfig.avatar,
    rounded ? 'rounded-full' : 'rounded-lg',
    border ? 'ring-2 ring-gray-300' : '',
    onClick && !disabled ? 'cursor-pointer' : '',
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    animated ? 'transition-all duration-200' : '',
    onClick && !disabled && animated ? 'hover:scale-105 hover:shadow-lg' : '',
    'relative flex items-center justify-center overflow-hidden'
  ].filter(Boolean).join(' ');

  const showImage = src && !imageError && imageLoaded;
  const showLoader = (imageLoading || loading) && !imageError;
  const showFallback = !src || imageError || (!imageLoaded && !imageLoading);

  return (
    <div className={containerClasses}>
      {/* Main Avatar */}
      <div
        className={avatarClasses}
        onClick={onClick && !disabled ? onClick : undefined}
        role={onClick ? 'button' : 'img'}
        aria-label={ariaLabel || alt || 'Avatar'}
        tabIndex={onClick && !disabled ? 0 : undefined}
        onKeyDown={onClick && !disabled ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        } : undefined}
      >
        {/* Image */}
        {src && (
          <Image
            src={src}
            alt={alt}
            width={sizeConfig.width}
            height={sizeConfig.height}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              showImage ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        )}

        {/* Loading Spinner */}
        {showLoader && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Loader2 className={`${sizeConfig.loader} animate-spin text-gray-600`} />
          </div>
        )}

        {/* Fallback Content */}
        {showFallback && !showLoader && (
          <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${fallbackBg}`}>
            {fallbackText || alt ? (
              <span className={`${sizeConfig.text} font-semibold text-white select-none`}>
                {getFallbackText()}
              </span>
            ) : (
              <User className={`${sizeConfig.icon} text-white`} />
            )}
          </div>
        )}

        {/* Click ripple effect */}
        {onClick && !disabled && animated && (
          <div className="absolute inset-0 rounded-full bg-white opacity-0 hover:opacity-10 active:opacity-20 transition-opacity duration-150" />
        )}
      </div>

      {/* Status Indicator - positioned outside avatar */}
      {status !== 'invisible' && statusConfig && (
        <div 
          className={`absolute ${sizeConfig.status} z-20`}
          style={{
            transform: 'translate(25%, 25%)' // Push it outside the avatar boundary
          }}
        >
          <div
            className={`
              w-full h-full rounded-full border-2 border-white
              ${statusConfig.bg} ${statusConfig.ring}
              ${statusConfig.pulse && animated ? 'animate-pulse' : ''}
              ${animated ? 'transition-all duration-200' : ''}
              shadow-sm
            `}
          />
          {statusConfig.pulse && (
            <div
              className={`
                absolute inset-0 rounded-full ${statusConfig.bg} opacity-30
                ${animated ? 'animate-ping' : ''}
              `}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Avatar;