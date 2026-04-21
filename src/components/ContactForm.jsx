import { useMemo, useState } from 'react';

const initialForm = {
  name: '',
  email: '',
  company: '',
  message: '',
};

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDisabled = useMemo(() => {
    return (
      isSubmitting ||
      !form.name.trim() ||
      !form.email.trim() ||
      !form.message.trim()
    );
  }, [form.email, form.message, form.name, isSubmitting]);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const payload = await response.json();
      setStatus({ type: payload.success ? 'success' : 'error', message: payload.message });

      if (payload.success) {
        setForm(initialForm);
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'The contact form is unavailable right now. Please try again shortly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form__grid">
        <label>
          <span>Name</span>
          <input value={form.name} onChange={updateField('name')} placeholder="Your name" />
        </label>

        <label>
          <span>Email</span>
          <input
            value={form.email}
            onChange={updateField('email')}
            type="email"
            placeholder="you@company.com"
          />
        </label>
      </div>

      <label>
        <span>Company</span>
        <input
          value={form.company}
          onChange={updateField('company')}
          placeholder="Company or project (optional)"
        />
      </label>

      <label>
        <span>Message</span>
        <textarea
          value={form.message}
          onChange={updateField('message')}
          rows={8}
          placeholder="Tell me about your project, timeline, or the role you have in mind."
        />
      </label>

      <div className="contact-form__footer">
        <button className="button button--dark" type="submit" disabled={isDisabled}>
          {isSubmitting ? 'Sending…' : 'Send message'}
        </button>

        {status && (
          <p className={`contact-form__status contact-form__status--${status.type}`}>{status.message}</p>
        )}
      </div>
    </form>
  );
}
