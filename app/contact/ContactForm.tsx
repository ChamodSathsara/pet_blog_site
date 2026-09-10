'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

interface FormState {
  name: string;
  email: string;
  topic: string;
  message: string;
}

const topics = ['General question', 'Correction or accuracy concern', 'Article suggestion', 'Press or partnership', 'Advertising'];

export function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', topic: topics[0], message: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) nextErrors.name = 'Please tell us your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Please enter a valid email address.';
    if (form.message.trim().length < 20) nextErrors.message = 'Please give us at least a sentence or two.';

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setStatus('loading');
    try {
      const response = await fetch('/api/messages', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(form) });
      setStatus(response.ok ? 'done' : 'error');
    } catch { setStatus('error'); }
  };

  if (status === 'done') {
    return (
      <div role="status" className="rounded-2xl border border-border bg-card p-8 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sage text-primary-foreground">
          <Check className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-serif text-2xl font-semibold text-foreground">Message sent</h2>
        <p className="mx-auto mt-2 max-w-md text-[18px] leading-relaxed text-muted-foreground">
          Thanks, {form.name.split(' ')[0]}. We reply to everything within three business days — check your spam folder if you don't
          hear back.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-border bg-card p-6 md:p-8">
      <h2 className="font-serif text-2xl font-semibold text-foreground">Send us a message</h2>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="block text-[15px] font-medium text-foreground">
            Your name
          </label>
          <Input
            id="contact-name"
            value={form.name}
            onChange={(event) => update('name', event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            autoComplete="name"
            className="mt-2 h-11 w-full text-base"
          />
          {errors.name && (
            <p id="contact-name-error" className="mt-1.5 text-sm text-destructive">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-[15px] font-medium text-foreground">
            Email address
          </label>
          <Input
            id="contact-email"
            type="email"
            value={form.email}
            onChange={(event) => update('email', event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            autoComplete="email"
            className="mt-2 h-11 w-full text-base"
          />
          {errors.email && (
            <p id="contact-email-error" className="mt-1.5 text-sm text-destructive">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="contact-topic" className="block text-[15px] font-medium text-foreground">
          What is this about?
        </label>
        <select
          id="contact-topic"
          value={form.topic}
          onChange={(event) => update('topic', event.target.value)}
          className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <label htmlFor="contact-message" className="block text-[15px] font-medium text-foreground">
          Message
        </label>
        <Textarea
          id="contact-message"
          rows={6}
          value={form.message}
          onChange={(event) => update('message', event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          className="mt-2 w-full text-base"
        />
        {errors.message && (
          <p id="contact-message-error" className="mt-1.5 text-sm text-destructive">
            {errors.message}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={status === 'loading'} className="mt-6 h-11 px-6 text-base">
        {status === 'loading' ? 'Sending…' : 'Send message'}
      </Button>
      {status === 'error' && <p role="alert" className="mt-3 text-sm text-destructive">We could not send your message. Please try again.</p>}
    </form>
  );
}
