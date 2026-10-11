import React from 'react';

interface SectionCardProps {
  title: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
  badge?: React.ReactNode;
  // A section the server could not load shows this instead of its content.
  error?: string;
  className?: string;
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  icon,
  actionLabel,
  onAction,
  badge,
  error,
  className = '',
  children,
}) => (
  <section aria-label={title} className={`bg-white border border-gray-200 rounded-2xl p-5 flex flex-col ${className}`}>
    <div className="flex items-center justify-between gap-2 mb-3">
      <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
        {icon && <span aria-hidden="true">{icon}</span>}
        {title}
        {badge}
      </h2>
      {actionLabel && onAction && !error && (
        <button onClick={onAction} className="text-xs text-indigo-600 hover:underline shrink-0">
          {actionLabel}
        </button>
      )}
    </div>

    {error ? (
      <p role="alert" className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-3">
        {error}
      </p>
    ) : (
      children
    )}
  </section>
);

export default SectionCard;
