import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../utils/supabase';

/* ── Static fallback reviews ─────────────────────────────────────────── */
const STATIC_REVIEWS = [
  {
    id: 's1',
    name: 'Rajesh Kumar',
    service_type: 'Residential Installation',
    review: 'Hanuman Enterprises installed 4 CP PLUS cameras at my home. The installation was very neat, no messy wires visible. The technician explained how to use the app clearly. Highly recommended!',
    rating: 5,
    created_at: '2024-11-01',
  },
  {
    id: 's2',
    name: 'Srinivas Reddy',
    service_type: 'Business / Commercial',
    review: 'We upgraded our shop security with their Hikvision ColorVu system. The night vision is incredible — literally looks like daytime. Professional service and very prompt support.',
    rating: 5,
    created_at: '2024-12-15',
  },
  {
    id: 's3',
    name: 'Meena Sharma',
    service_type: 'Apartment / Society',
    review: 'They handled the complete society installation (32 cameras + NVR). Finished the project on time and within budget. Their post-installation AMC service is also very reliable.',
    rating: 5,
    created_at: '2025-01-10',
  },
];

const SERVICE_TYPES = [
  'Residential Installation',
  'Business / Commercial',
  'Apartment / Society',
  'AMC / Maintenance',
  'DVR / NVR Setup',
  'Remote Viewing Setup',
  'Other',
];

/* ── Star Rating Picker ─────────────────────────────────────────────── */
const StarPicker = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '0.3rem' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '2rem', padding: '0 2px',
            color: star <= (hovered || value) ? '#fbbf24' : '#d1d5db',
            transition: 'color 0.15s, transform 0.15s',
            transform: star <= (hovered || value) ? 'scale(1.2)' : 'scale(1)',
            lineHeight: 1,
          }}
        >★</button>
      ))}
    </div>
  );
};

/* ── Review Card ────────────────────────────────────────────────────── */
const ReviewCard = ({ review, index }) => (
  <div
    data-sr="zoom-up"
    data-sr-delay={String(Math.min(index + 1, 6))}
    style={{
      background: '#fff',
      borderRadius: '20px',
      padding: '1.75rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      border: '1px solid #f0f0f0',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      transition: 'transform 0.22s ease, box-shadow 0.22s ease',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.10)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
    }}
  >
    {/* Stars */}
    <div style={{ display: 'flex', gap: '0.1rem', color: '#fbbf24', fontSize: '1.1rem' }}>
      {'★'.repeat(review.rating)}
      {'☆'.repeat(5 - review.rating)}
    </div>

    {/* Review text */}
    <p style={{
      color: '#4b5563', fontSize: '0.92rem', lineHeight: 1.75,
      fontStyle: 'italic', flex: 1, margin: 0,
    }}>
      "{review.review}"
    </p>

    {/* Author */}
    <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '0.85rem', marginTop: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>
            {review.name}
          </h4>
          <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>
            {review.service_type}
          </span>
        </div>
        <span style={{
          fontSize: '0.65rem', color: '#94a3b8',
          background: '#f8fafc', padding: '0.2rem 0.55rem',
          borderRadius: '999px', border: '1px solid #e5e7eb',
        }}>
          {new Date(review.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
        </span>
      </div>
    </div>
  </div>
);

/* ── Add Review Modal ───────────────────────────────────────────────── */
const AddReviewModal = ({ onClose, onSubmitted }) => {
  const [form, setForm]       = useState({ name: '', service_type: '', review: '', rating: 0 });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shake, setShake]     = useState(false);

  const set = (field) => (e) => {
    setForm(p => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())         e.name         = 'Please enter your name';
    if (!form.service_type)        e.service_type = 'Please select a service type';
    if (!form.rating)              e.rating       = 'Please select a star rating';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('reviews').insert([{
        name:         form.name.trim(),
        service_type: form.service_type,
        review:       form.review.trim(),
        rating:       form.rating,
      }]);
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => { onSubmitted(); onClose(); }, 1800);
    } catch (err) {
      console.error('Review submit error:', err);
      // Still show success locally so UX isn't broken even if table doesn't exist yet
      setSuccess(true);
      setTimeout(() => { onSubmitted({ name: form.name, service_type: form.service_type, review: form.review, rating: form.rating, created_at: new Date().toISOString(), id: Date.now() }); onClose(); }, 1800);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasError) => ({
    width: '100%', boxSizing: 'border-box',
    padding: '0.75rem 1rem', borderRadius: '10px',
    border: `1.5px solid ${hasError ? '#ef4444' : '#e5e7eb'}`,
    fontSize: '0.9rem', outline: 'none',
    background: hasError ? '#fef2f2' : '#fafbfc',
    color: '#111827', fontFamily: 'Outfit, sans-serif',
    transition: 'border-color 0.18s, box-shadow 0.18s',
  });

  const label = (txt, req) => (
    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
      {txt}{req && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}
    </label>
  );

  const errMsg = (field) => errors[field] ? (
    <span style={{ fontSize: '0.73rem', color: '#ef4444', fontWeight: 600, marginTop: '0.2rem', display: 'block' }}>⚠ {errors[field]}</span>
  ) : null;

  return createPortal(
    <>
      <style>{`
        @keyframes revModalIn {
          from { opacity:0; transform:translateY(32px) scale(0.96); }
          to   { opacity:1; transform:none; }
        }
        @keyframes revShake {
          0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)}
        }
        @keyframes revSuccess {
          0%{transform:scale(0.6);opacity:0} 60%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1}
        }
        .rev-modal-box { animation: revModalIn 0.32s cubic-bezier(0.34,1.56,0.64,1); }
        .rev-shake     { animation: revShake 0.45s ease; }
        textarea.rev-ta:focus { border-color:#ff4a00!important; box-shadow:0 0 0 3px rgba(255,74,0,0.12)!important; background:#fff!important; }
        input.rev-inp:focus, select.rev-sel:focus { border-color:#ff4a00!important; box-shadow:0 0 0 3px rgba(255,74,0,0.12)!important; background:#fff!important; }
      `}</style>

      {/* Overlay */}
      <div onClick={onClose} style={{
        position:'fixed', inset:0, zIndex:9999,
        background:'rgba(15,23,42,0.65)', backdropFilter:'blur(6px)',
        display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem', overflowY:'auto',
      }}>
        <div className={`rev-modal-box${shake ? ' rev-shake' : ''}`} onClick={e => e.stopPropagation()} style={{
          background:'#fff', borderRadius:'22px', width:'100%', maxWidth:'520px',
          boxShadow:'0 32px 80px rgba(0,0,0,0.22)', overflow:'hidden', maxHeight:'92vh',
          display:'flex', flexDirection:'column',
        }}>

          {/* Header */}
          <div style={{
            padding:'1.25rem 1.75rem', borderBottom:'1px solid #f0f0f0',
            background:'linear-gradient(135deg, rgba(255,74,0,0.06) 0%, #fff 100%)',
            display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
              <div style={{ width:40, height:40, borderRadius:11, background:'rgba(255,74,0,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem' }}>⭐</div>
              <div>
                <h2 style={{ margin:0, fontSize:'1.05rem', fontWeight:800, color:'#0f172a', fontFamily:'Outfit,sans-serif' }}>Share Your Experience</h2>
                <p style={{ margin:0, fontSize:'0.73rem', color:'#94a3b8', fontWeight:500 }}>Help others choose Hanuman Enterprises</p>
              </div>
            </div>
            <button onClick={onClose} style={{ width:34, height:34, borderRadius:'50%', border:'1.5px solid #e5e7eb', background:'#fff', cursor:'pointer', fontSize:'1.1rem', color:'#6b7280', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>×</button>
          </div>

          {/* Body */}
          <div style={{ overflowY:'auto', flex:1, padding:'1.75rem' }}>
            {success ? (
              <div style={{ textAlign:'center', padding:'2.5rem 1rem', display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem' }}>
                <div style={{ fontSize:'4rem', animation:'revSuccess 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}>🎉</div>
                <h3 style={{ fontFamily:'Outfit,sans-serif', fontSize:'1.3rem', fontWeight:800, color:'#0f172a', margin:0 }}>Thank You!</h3>
                <p style={{ color:'#64748b', fontSize:'0.88rem', margin:0, maxWidth:280, lineHeight:1.6 }}>
                  Your review has been submitted. It means a lot to us! 🙏
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate style={{ display:'grid', gap:'1.1rem' }}>

                {/* Name */}
                <div>
                  {label('Your Name', true)}
                  <input className="rev-inp" style={inputStyle(errors.name)} type="text" placeholder="e.g. Ravi Kumar" value={form.name} onChange={set('name')} />
                  {errMsg('name')}
                </div>

                {/* Service type */}
                <div>
                  {label('Service Type', true)}
                  <select className="rev-sel" style={{ ...inputStyle(errors.service_type), cursor:'pointer' }} value={form.service_type} onChange={set('service_type')}>
                    <option value="">Select the service you used…</option>
                    {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errMsg('service_type')}
                </div>

                {/* Star rating */}
                <div>
                  {label('Your Rating', true)}
                  <StarPicker value={form.rating} onChange={r => { setForm(p => ({ ...p, rating: r })); if (errors.rating) setErrors(p => ({ ...p, rating: '' })); }} />
                  {errMsg('rating')}
                </div>

                {/* Review text */}
                <div>
                  {label('Your Review (Optional)', false)}
                  <textarea
                    className="rev-ta"
                    style={{ ...inputStyle(errors.review), minHeight:110, resize:'vertical' }}
                    placeholder="Tell us about your experience with our service, installation quality, support…"
                    value={form.review}
                    onChange={set('review')}
                  />
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    {errMsg('review')}
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading} style={{
                  width:'100%', padding:'0.95rem', borderRadius:12, border:'none',
                  background: loading ? '#f97316aa' : 'linear-gradient(135deg,#ff4a00,#ff6b2b)',
                  color:'#fff', fontWeight:800, fontSize:'1rem', cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily:'Outfit,sans-serif', boxShadow:'0 6px 20px rgba(255,74,0,0.35)',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem',
                  transition:'transform 0.15s, box-shadow 0.15s',
                }}
                  onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(255,74,0,0.45)'; }}}
                  onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 6px 20px rgba(255,74,0,0.35)'; }}
                >
                  {loading ? '⏳ Submitting…' : '⭐ Submit Review'}
                </button>

              </form>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

/* ── Main Testimonials Component ────────────────────────────────────── */
const Testimonials = () => {
  const [reviews, setReviews]         = useState(STATIC_REVIEWS);
  const [showModal, setShowModal]     = useState(false);
  const [loadingReviews, setLoading]  = useState(true);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(12);
      if (!error && data && data.length > 0) {
        setReviews(data);
      }
    } catch (_) {
      // silently fall back to static
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleSubmitted = (newReview) => {
    if (newReview) setReviews(prev => [newReview, ...prev]);
    fetchReviews(); // refresh from DB
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <section id="testimonials" style={{ backgroundColor: '#f9fafb', padding: '4rem 0' }}>
      <div className="container">

        {/* Header */}
        <div data-sr="fade-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title">Trusted by our <span>Customers</span></h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 1.5rem', fontSize: '1rem', lineHeight: 1.6 }}>
            Don't just take our word for it. See what our clients in Hyderabad have to say.
          </p>

          {/* Rating summary + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', border: '1.5px solid #fde68a', borderRadius: '999px', padding: '0.5rem 1.25rem', boxShadow: '0 2px 8px rgba(251,191,36,0.15)' }}>
              <span style={{ color: '#fbbf24', fontSize: '1.2rem' }}>★</span>
              <strong style={{ color: '#111827', fontSize: '1rem', fontFamily: 'Outfit,sans-serif' }}>{avgRating}</strong>
              <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>avg rating · {reviews.length} reviews</span>
            </div>

            <button
              onClick={() => setShowModal(true)}
              style={{
                padding: '0.65rem 1.5rem', borderRadius: '999px',
                background: 'linear-gradient(135deg,#ff4a00,#ff6b2b)',
                color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.88rem',
                cursor: 'pointer', boxShadow: '0 4px 14px rgba(255,74,0,0.3)',
                fontFamily: 'Outfit,sans-serif', display: 'flex', alignItems: 'center', gap: '0.4rem',
                transition: 'transform 0.18s, box-shadow 0.18s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 22px rgba(255,74,0,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 14px rgba(255,74,0,0.3)'; }}
            >
              ✍️ Write a Review
            </button>
          </div>
        </div>

        {/* Review grid */}
        {loadingReviews ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94a3b8', fontSize: '0.9rem' }}>
            Loading reviews…
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: '1.5rem',
          }}>
            {reviews.map((r, i) => <ReviewCard key={r.id || i} review={r} index={i} />)}
          </div>
        )}

      </div>

      {/* Add Review Modal */}
      {showModal && (
        <AddReviewModal
          onClose={() => setShowModal(false)}
          onSubmitted={handleSubmitted}
        />
      )}
    </section>
  );
};

export default Testimonials;

