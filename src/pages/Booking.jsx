import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaComment, FaCheckCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import Footer from '../components/Footer.jsx';
import '../styles/Booking.css';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function Booking() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preselectedPackage = searchParams.get('package') || '';

    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [bookedDates, setBookedDates] = useState(new Set());
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [fetchingDates, setFetchingDates] = useState(true);

    const [form, setForm] = useState({
        name: '', email: '', phone: '', package_name: preselectedPackage, venue: '', message: ''
    });

    useEffect(() => {
        fetchBookedDates();
    }, []);

    const fetchBookedDates = async () => {
        setFetchingDates(true);
        try {
            const { data } = await supabase
                .from('bookings')
                .select('wedding_date, status')
                .in('status', ['pending', 'confirmed']);

            if (data) {
                const dates = new Set(data.map(b => b.wedding_date));
                setBookedDates(dates);
            }
        } catch (err) {
            console.error('Failed to fetch booked dates:', err);
        } finally {
            setFetchingDates(false);
        }
    };

    const calendarData = useMemo(() => {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        return { firstDay, daysInMonth };
    }, [currentMonth, currentYear]);

    const isDatePast = (day) => {
        const d = new Date(currentYear, currentMonth, day);
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        return d < todayStart;
    };

    const isDateBooked = (day) => {
        const key = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return bookedDates.has(key);
    };

    const isDateSelected = (day) => {
        if (!selectedDate) return false;
        return selectedDate.year === currentYear && selectedDate.month === currentMonth && selectedDate.day === day;
    };

    const handleDateClick = (day) => {
        if (isDatePast(day) || isDateBooked(day)) return;
        setSelectedDate({ year: currentYear, month: currentMonth, day });
    };

    const prevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
        else setCurrentMonth(m => m - 1);
    };

    const nextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
        else setCurrentMonth(m => m + 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDate) { alert('Please select a date'); return; }
        setLoading(true);
        try {
            const dateStr = `${selectedDate.year}-${String(selectedDate.month + 1).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`;
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_name: form.name,
                    client_email: form.email,
                    client_phone: form.phone,
                    package_name: form.package_name,
                    wedding_date: dateStr,
                    venue: form.venue,
                    message: form.message
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to submit booking');
            setSubmitted(true);
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    if (submitted) {
        return (
            <div className="page-enter">
                <div className="booking-page">
                    <div className="booking-success">
                        <div className="success-icon"><FaCheckCircle /></div>
                        <h2>Booking Request Received!</h2>
                        <p>We've received your booking request for <strong>{selectedDate && `${MONTHS[selectedDate.month]} ${selectedDate.day}, ${selectedDate.year}`}</strong> ({form.package_name} package).</p>
                        <p style={{ color: 'var(--ink-3)', marginTop: 12 }}>Our team will review your request and confirm availability via email within 24 hours.</p>
                        <div className="success-actions">
                            <button onClick={() => navigate('/')} className="btn-primary">Back to Home</button>
                            <button onClick={() => { setSubmitted(false); setSelectedDate(null); setForm({ name: '', email: '', phone: '', package_name: '', venue: '', message: '' }); }} className="btn-gold-outline">Book Another</button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="page-enter">
            <div className="booking-page">
                <div className="booking-header">
                    <h1>Book Your <em>Date</em></h1>
                    <p>Select your wedding date and fill in the details to request a booking</p>
                </div>

                <div className="booking-layout">
                    {/* Calendar */}
                    <div className="booking-calendar glass-card">
                        <div className="cal-header">
                            <button onClick={prevMonth} className="cal-nav"><FaChevronLeft /></button>
                            <h3>{MONTHS[currentMonth]} {currentYear}</h3>
                            <button onClick={nextMonth} className="cal-nav"><FaChevronRight /></button>
                        </div>

                        <div className="cal-days-header">
                            {DAYS.map(d => <div key={d} className="cal-day-label">{d}</div>)}
                        </div>

                        <div className="cal-grid">
                            {Array.from({ length: calendarData.firstDay }).map((_, i) => <div key={`empty-${i}`} className="cal-cell empty" />)}
                            {Array.from({ length: calendarData.daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const past = isDatePast(day);
                                const booked = isDateBooked(day);
                                const selected = isDateSelected(day);
                                return (
                                    <div
                                        key={day}
                                        className={`cal-cell${past ? ' past' : ''}${booked ? ' booked' : ''}${selected ? ' selected' : ''}${!past && !booked ? ' available' : ''}`}
                                        onClick={() => handleDateClick(day)}
                                    >
                                        <span>{day}</span>
                                        {booked && <div className="cal-dot" />}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="cal-legend">
                            <div className="legend-item"><span className="legend-swatch available" /> Available</div>
                            <div className="legend-item"><span className="legend-swatch booked" /> Booked</div>
                            <div className="legend-item"><span className="legend-swatch selected" /> Selected</div>
                            <div className="legend-item"><span className="legend-swatch past" /> Past</div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="booking-form-wrap glass-card">
                        <h3 style={{ marginBottom: 8, fontFamily: 'var(--font-heading)' }}>Booking Details</h3>
                        {selectedDate && (
                            <div className="selected-date-badge">
                                <FaCalendarAlt /> {MONTHS[selectedDate.month]} {selectedDate.day}, {selectedDate.year}
                            </div>
                        )}
                        {!selectedDate && <p style={{ color: 'var(--ink-3)', fontSize: 14, marginBottom: 20 }}>Select a date from the calendar first</p>}

                        <form onSubmit={handleSubmit}>
                            <div className="booking-field">
                                <label>Full Name *</label>
                                <div className="booking-input-wrap">
                                    <input required placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} />
                                    <FaUser className="booking-input-icon" />
                                </div>
                            </div>
                            <div className="booking-field">
                                <label>Email *</label>
                                <div className="booking-input-wrap">
                                    <input required type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
                                    <FaEnvelope className="booking-input-icon" />
                                </div>
                            </div>
                            <div className="booking-field">
                                <label>Phone *</label>
                                <div className="booking-input-wrap">
                                    <input required type="tel" placeholder="+94 XX XXX XXXX" value={form.phone} onChange={e => set('phone', e.target.value)} />
                                    <FaPhone className="booking-input-icon" />
                                </div>
                            </div>
                            <div className="booking-field">
                                <label>Package *</label>
                                <select required value={form.package_name} onChange={e => set('package_name', e.target.value)}>
                                    <option value="">Select a package</option>
                                    <option value="Essential">Essential Package</option>
                                    <option value="Premium">Premium Package</option>
                                    <option value="Luxury">Luxury Package</option>
                                    <option value="Custom">Custom Package</option>
                                </select>
                            </div>
                            <div className="booking-field">
                                <label>Venue</label>
                                <div className="booking-input-wrap">
                                    <input placeholder="Wedding venue (optional)" value={form.venue} onChange={e => set('venue', e.target.value)} />
                                    <FaMapMarkerAlt className="booking-input-icon" />
                                </div>
                            </div>
                            <div className="booking-field">
                                <label>Additional Notes</label>
                                <textarea rows={3} placeholder="Tell us about your special day..." value={form.message} onChange={e => set('message', e.target.value)} />
                            </div>

                            <button type="submit" className="btn-primary booking-submit" disabled={loading || !selectedDate}>
                                {loading ? 'Submitting...' : 'Request Booking'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
