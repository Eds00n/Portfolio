import { memo } from 'react';

/**
 * @param {{
 *   src: string;
 *   alt: string;
 *   className?: string;
 *   priority?: boolean;
 *   sizes?: string;
 * }} props
 */
export const DeliveryImage = memo(function DeliveryImage({
  src,
  alt,
  className = '',
  priority = false,
  sizes,
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      sizes={sizes}
      draggable={false}
    />
  );
});
