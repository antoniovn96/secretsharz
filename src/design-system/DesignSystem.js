import React, { useEffect, useId, useRef } from 'react';

export function Button({ variant = 'primary', className = '', type = 'button', children, ...props }) {
  return (
    <button type={type} className={`ss-button ss-button--${variant} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

export function Field({ label, error, helpText, required = false, children, id, ...props }) {
  const generatedId = useId();
  const fieldId = id || `ss-field-${generatedId}`;
  const helpId = helpText ? `${fieldId}-help` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;

  const child = React.cloneElement(children, {
    id: fieldId,
    'aria-describedby': [helpId, errorId].filter(Boolean).join(' ') || undefined,
    'aria-invalid': error ? 'true' : undefined,
    ...props,
  });

  return (
    <div>
      <label className="ss-label" htmlFor={fieldId}>
        {label}{required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {child}
      {helpText ? <p id={helpId} className="ss-help-text">{helpText}</p> : null}
      {error ? <p id={errorId} className="ss-error-text" role="alert">{error}</p> : null}
    </div>
  );
}

export function Alert({ tone = 'info', title, children, role = 'status' }) {
  return (
    <div className={`ss-alert ss-alert--${tone}`} role={role}>
      {title ? <strong>{title}</strong> : null}
      {title ? <div>{children}</div> : children}
    </div>
  );
}

export function Progress({ value, label = 'Progress' }) {
  const safeValue = Math.min(100, Math.max(0, Number(value) || 0));
  return (
    <div aria-label={`${label}: ${safeValue}%`} role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={safeValue}>
      <div className="ss-progress" aria-hidden="true">
        <div className="ss-progress__bar" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}

export function Dialog({ open, onClose, title, children, labelledById }) {
  const dialogRef = useRef(null);
  const titleId = labelledById || `ss-dialog-${useId()}`;

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    const focusableSelector = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
    const focusable = () => Array.from(dialogRef.current?.querySelectorAll(focusableSelector) || []);

    requestAnimationFrame(() => {
      focusable()[0]?.focus();
      if (!focusable().length) dialogRef.current?.focus();
    });

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
        return;
      }
      if (event.key !== 'Tab') return;
      const nodes = focusable();
      if (!nodes.length) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="ss-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose?.(); }}>
      <section
        ref={dialogRef}
        className="ss-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex="-1"
      >
        <div className="ss-dialog__header">
          <h2 id={titleId} className="ss-dialog__title">{title}</h2>
          <button className="ss-close-button" type="button" onClick={onClose} aria-label="Close dialog">×</button>
        </div>
        {children}
      </section>
    </div>
  );
}
