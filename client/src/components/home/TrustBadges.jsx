import React, { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const submit = e => {
    e.preventDefault();
    if (email) { setDone(true); setEmail(''); }
  };

  return (
    <section className="nl-section">
      <h2>Sign up &amp; save</h2>
      <p>
        Be the first to hear about exclusive offers, new arrivals and style inspiration.
        <br />Plus 10% off your first order when you subscribe.
      </p>
      {done ? (
        <p style={{ fontWeight: 700, color: '#2a7a2a', fontSize: 14 }}>
          ✓ Thanks! Check your inbox for your discount code.
        </p>
      ) : (
        <form className="nl-form" onSubmit={submit}>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      )}
    </section>
  );
}
