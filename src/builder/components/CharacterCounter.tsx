import React from 'react';
import { getCharacterStatus } from '../../renderer/utils/textScaling';
import { getVisibleCharacterCount, validateTextLineBreaks } from '../../renderer/utils/textRendering';

interface CharacterCounterProps {
  text: string;
  maxLength: number;
  className?: string;
  showCount?: boolean;
  showPercentage?: boolean;
}

export default function CharacterCounter({ 
  text, 
  maxLength, 
  className = '',
  showCount = true,
  showPercentage = false
}: CharacterCounterProps) {
  const status = getCharacterStatus(text, maxLength);
  const lineValidation = validateTextLineBreaks(text, 3); // Max 3 lines for most fields
  const hasLineBreaks = text.includes('\n');
  
  const getStatusColor = () => {
    switch (status.status) {
      case 'good': return '#22c55e'; // green
      case 'warning': return '#f59e0b'; // amber
      case 'danger': return '#ef4444'; // red
      case 'over': return '#dc2626'; // dark red
      default: return '#6b7280'; // gray
    }
  };
  
  const getStatusIcon = () => {
    switch (status.status) {
      case 'good': return '✓';
      case 'warning': return '⚠';
      case 'danger': return '⚠';
      case 'over': return '✗';
      default: return '';
    }
  };
  
  const getMessage = () => {
    if (status.status === 'over') {
      return `${Math.abs(status.remaining)} characters over limit`;
    }
    if (status.status === 'danger') {
      return `${status.remaining} characters remaining`;
    }
    if (status.status === 'warning') {
      return `${status.remaining} characters remaining`;
    }
    return '';
  };
  
  return (
    <div 
      className={`character-counter ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '12px',
        color: getStatusColor(),
        fontWeight: status.status === 'over' ? '600' : '400'
      }}
    >
      <span style={{ fontSize: '10px' }}>{getStatusIcon()}</span>
      
      {showCount && (
        <span>
          {status.count}/{maxLength}
          {hasLineBreaks && (
            <span style={{ fontSize: '10px', opacity: 0.7 }}>
              {' '}({lineValidation.lineCount} lines)
            </span>
          )}
        </span>
      )}
      
      {showPercentage && (
        <span>({status.percentage}%)</span>
      )}
      
      {getMessage() && (
        <span style={{ fontStyle: 'italic' }}>
          • {getMessage()}
        </span>
      )}
    </div>
  );
}

/**
 * Hook for character validation
 */
export function useCharacterValidation(text: string, maxLength: number) {
  const status = getCharacterStatus(text, maxLength);
  
  return {
    isValid: status.status !== 'over',
    isNearLimit: status.status === 'danger',
    isApproachingLimit: status.status === 'warning',
    count: status.count,
    remaining: status.remaining,
    percentage: status.percentage,
    status: status.status
  };
}

/**
 * Enhanced textarea with built-in character counter
 */
interface TextareaWithCounterProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength: number;
  label?: string;
  error?: string;
  helperText?: string;
}

export function TextareaWithCounter({ 
  maxLength, 
  label, 
  error, 
  helperText,
  value = '',
  ...props 
}: TextareaWithCounterProps) {
  const validation = useCharacterValidation(String(value), maxLength);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
          {label}
        </label>
      )}
      
      <textarea
        value={value}
        maxLength={maxLength * 1.1} // Allow slight overage for better UX
        style={{
          padding: '8px 12px',
          border: `1px solid ${validation.isValid ? '#d1d5db' : '#ef4444'}`,
          borderRadius: '6px',
          fontSize: '14px',
          fontFamily: 'inherit',
          resize: 'vertical',
          minHeight: '80px',
          outline: 'none',
          transition: 'border-color 0.2s'
        }}
        {...props}
      />
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        gap: '8px'
      }}>
        <div style={{ flex: 1 }}>
          {error && (
            <div style={{ fontSize: '12px', color: '#ef4444' }}>
              {error}
            </div>
          )}
          {helperText && !error && (
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {helperText}
            </div>
          )}
        </div>
        
        <CharacterCounter 
          text={String(value)} 
          maxLength={maxLength}
          showCount={true}
        />
      </div>
    </div>
  );
}
