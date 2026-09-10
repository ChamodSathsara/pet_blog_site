'use client';

import React, { useState } from 'react';
import { Check, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils/cn';

interface NewsletterProps {
  variant?: 'panel' | 'inline';
  className?: string;
}

export function Newsletter({ variant = 'panel', className }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    window.setTimeout(() => setStatus('done'), 700);
  };

  const isInline = variant === 'inline';

  return (
    <section
      aria-labelledby="newsletter-heading"
      className={cn(
        isInline ? 'rounded-2xl border border-border bg-card p-6' : 'rounded-3xl bg-sage px-6 py-10 text-primary-foreground md:px-12 md:py-14',
        className
      )}
    >
      <div className={cn(!isInline && 'mx-auto max-w-2xl text-center')}>
        <div
          className={cn(
            'inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]',
            isInline ? 'text-primary' : 'text-primary-foreground/80'
          )}
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          The Grey Muzzle Letter
        </div>
        <h2
          id="newsletter-heading"
          className={cn('mt-3 font-serif font-semibold leading-tight', isInline ? 'text-xl text-foreground' : 'text-3xl md:text-[38px]')}
        >
          One careful email a month about aging pets
        </h2>
        <p className={cn('mt-3 text-[17px] leading-relaxed', isInline ? 'text-muted-foreground' : 'text-primary-foreground/85')}>
          New guides, condition explainers, and the questions worth asking at your next senior wellness exam. No
          affiliate spam, unsubscribe in one click.
        </p>

        {status === 'done' ? (
          <p
            role="status"
            className={cn(
              'mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[17px] font-medium',
              isInline ? 'bg-secondary text-secondary-foreground' : 'bg-primary-foreground/15 text-primary-foreground'
            )}
          >
            <Check className="h-4 w-4" aria-hidden="true" />
            You're on the list — check your inbox to confirm.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className={cn('mt-6 flex flex-col gap-3 sm:flex-row', !isInline && 'mx-auto max-w-md')}
            noValidate
          >
            <div className="flex-1 text-left">
              <label htmlFor={`newsletter-email-${variant}`} className="sr-only">
                Email address
              </label>
              <Input
                id={`newsletter-email-${variant}`}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                aria-invalid={status === 'error'}
                aria-describedby={status === 'error' ? `newsletter-error-${variant}` : undefined}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                className={cn(
                  'h-11 w-full text-base',
                  !isInline && 'border-transparent bg-primary-foreground text-foreground placeholder:text-muted-foreground'
                )}
              />
              {status === 'error' && (
                <p id={`newsletter-error-${variant}`} className={cn('mt-2 text-sm', isInline ? 'text-destructive' : 'text-primary-foreground')}>
                  Please enter a valid email address.
                </p>
              )}
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={status === 'loading'}
              className={cn('h-11 px-6 text-base', !isInline && 'bg-terracotta text-primary-foreground hover:bg-terracotta/90')}
            >
              {status === 'loading' ? 'Signing you up…' : 'Subscribe'}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
