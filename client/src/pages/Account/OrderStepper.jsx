import React from 'react';

const STEPS = [
  { key: 'Pending', label: 'Order Placed' },
  { key: 'Processing', label: 'Order Confirmed' },
  { key: 'Shipped', label: 'Ready Parcel' },
  { key: 'Delivered', label: 'Delivered' },
];

export default function OrderStepper({ status }) {
  if (status === 'Cancelled') {
    return (
      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#d00', padding: '6px 0' }}>
        ✕ Order Cancelled
      </div>
    );
  }

  const currentIndex = STEPS.findIndex(s => s.key === status);

  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '10px 0' }}>
      {STEPS.map((step, idx) => {
        const isDone = idx <= currentIndex;
        return (
          <React.Fragment key={step.key}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 70 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: isDone ? '#1e8536' : '#e0e0e0',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 'bold'
              }}>
                {isDone ? '✓' : idx + 1}
              </div>
              <span style={{
                fontSize: 10, marginTop: 4, textAlign: 'center',
                color: isDone ? '#111' : '#999',
                fontWeight: idx === currentIndex ? 'bold' : 'normal'
              }}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 2, marginBottom: 16,
                background: idx < currentIndex ? '#1e8536' : '#e0e0e0'
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}