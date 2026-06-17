/* ============================================================
   Shared quote-form logic for the city landing pages.
   Mirrors the main site's "Request a Pickup" form exactly and
   routes submissions to the same Supabase `lead_requests` table
   (plus the Google Apps Script backup log) the field app reads.
   Each city page sets window.LEAD_SOURCE / window.CITY_NAME before
   loading this file.
============================================================ */
var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz2DaIHe99b6ehPPlMTVb4bHZ8wIEm6Q_tW0tHPs7sL69C6V9n208ik8iKcTshK0o2P/exec';
var SB_URL = 'https://lfvuehgzomqjptcondbq.supabase.co';
var SB_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmdnVlaGd6b21xanB0Y29uZGJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MzQ4MjksImV4cCI6MjA5NjAxMDgyOX0.c5MXBtXZs8DR4L-AtuuC4u8qcITizxKI3LxFEMzRjRo';
var sb = window.supabase ? window.supabase.createClient(SB_URL, SB_ANON_KEY) : null;

/* ---- Volume picker ---- */
var selectedVolume = '';
function pickVolume(card) {
  selectedVolume = card.dataset.volume;
  document.querySelectorAll('#volumePicker .volume-card').forEach(c => c.classList.toggle('selected', c === card));
}

/* ---- ZIP -> city autofill (Utah County service area; always editable) ---- */
var ZIP_CITIES = {
  '84601': 'Provo', '84602': 'Provo', '84604': 'Provo', '84606': 'Provo',
  '84057': 'Orem', '84058': 'Orem', '84059': 'Vineyard', '84097': 'Orem',
  '84043': 'Lehi', '84045': 'Saratoga Springs', '84005': 'Eagle Mountain',
  '84003': 'American Fork', '84004': 'Alpine', '84042': 'Lindon',
  '84062': 'Pleasant Grove', '84660': 'Spanish Fork', '84663': 'Springville',
  '84664': 'Mapleton', '84651': 'Payson', '84653': 'Salem', '84655': 'Santaquin',
  '84013': 'Cedar Fort', '84633': 'Goshen', '84626': 'Elberta', '84020': 'Draper'
};
function zipAutofill(zip) {
  const city = ZIP_CITIES[String(zip).trim()];
  if (city) document.getElementById('qfCity').value = city;
}

/* ---- Custom service type when "Other" is picked ---- */
function serviceTypeChanged(sel) {
  const isOther = sel.value.indexOf('Other') === 0;
  document.getElementById('customServiceField').style.display = isOther ? 'block' : 'none';
  const custom = document.getElementById('qfCustomService');
  custom.required = isOther;
  if (!isOther) custom.value = '';
}

/* ---- Availability-aware scheduling ---- */
var HOURS_BY_DAY = { 0: null, 1: [9, 18], 2: [9, 18], 3: [9, 18], 4: [9, 18], 5: [9, 18], 6: [9, 16] };
var selectedSlot = '';
function localDateStr(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function fmtSlot(mins) {
  let h = Math.floor(mins / 60), m = mins % 60;
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return h + ':' + String(m).padStart(2, '0') + ' ' + ap;
}
function timeToMins(t) {
  if (!t) return null;
  const p = String(t).split(':');
  return Number(p[0]) * 60 + Number(p[1] || 0);
}
async function dateChanged(input) {
  const note = document.getElementById('dateNote');
  const timeField = document.getElementById('timeField');
  selectedSlot = '';
  note.style.display = 'none';
  if (!input.value) { timeField.style.display = 'none'; return; }
  const [y, m, d] = input.value.split('-').map(Number);
  const day = new Date(y, m - 1, d).getDay();
  if (day === 0) {
    input.value = '';
    timeField.style.display = 'none';
    note.textContent = "We're closed Sundays — pick any other day and we'll be there.";
    note.className = 'closed-note warn';
    note.style.display = 'block';
    return;
  }
  timeField.style.display = 'block';
  const grid = document.getElementById('slotGrid');
  grid.innerHTML = '<div style="grid-column:1/-1;font-size:13px;color:var(--ink-light);">Checking our schedule…</div>';
  let booked = [];
  try {
    if (sb) {
      const { data } = await sb.from('booked_slots').select('start_time,end_time').eq('date', input.value);
      booked = data || [];
    }
  } catch (err) { /* can't read schedule — show all business hours */ }
  renderSlots(input.value, day, booked);
}
function renderSlots(dateStr, day, booked) {
  const grid = document.getElementById('slotGrid');
  const slotNote = document.getElementById('slotNote');
  const [open, close] = HOURS_BY_DAY[day];
  const windows = booked
    .map(b => ({ start: timeToMins(b.start_time), end: timeToMins(b.end_time) }))
    .filter(w => w.start != null)
    .map(w => ({ start: w.start, end: w.end != null ? w.end : w.start + 120 }));
  const today = localDateStr(new Date()) === dateStr;
  const nowMins = new Date().getHours() * 60 + new Date().getMinutes();
  let html = '';
  let anyOpen = false;
  for (let t = open * 60; t <= (close - 1) * 60; t += 30) {
    const isBooked = windows.some(w => t >= w.start && t < w.end);
    const tooSoon = today && t < nowMins + 60;
    const disabled = isBooked || tooSoon;
    if (!disabled) anyOpen = true;
    html += '<button type="button" class="slot-chip" ' + (disabled ? 'disabled' : '') +
      ' data-slot="' + fmtSlot(t) + '" onclick="pickSlot(this)">' + fmtSlot(t) + '</button>';
  }
  grid.innerHTML = html;
  slotNote.className = 'closed-note';
  if (!anyOpen) {
    slotNote.textContent = today
      ? "Nothing left today — pick another day, or request a special time below and we'll make it work."
      : "We're fully booked that day — pick another day, or request a special time below and we'll make it work.";
    slotNote.className = 'closed-note warn';
    slotNote.style.display = 'block';
  } else {
    slotNote.style.display = 'none';
  }
}
function pickSlot(chip) {
  selectedSlot = chip.dataset.slot;
  document.querySelectorAll('#slotGrid .slot-chip').forEach(c => c.classList.toggle('selected', c === chip));
}
function toggleSpecialTime() {
  const f = document.getElementById('specialTimeField');
  const show = f.style.display === 'none';
  f.style.display = show ? 'block' : 'none';
  if (show) document.getElementById('qfSpecialTime').focus();
}

/* ---- Photo upload (max 5, compressed client-side) ---- */
var leadPhotos = [];
async function compressImage(file, maxSizeKB = 400) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const maxDim = 1600;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        let quality = 0.85;
        const tryCompress = () => {
          canvas.toBlob((blob) => {
            if (blob.size <= maxSizeKB * 1024 || quality < 0.3) {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            } else { quality -= 0.1; tryCompress(); }
          }, 'image/jpeg', quality);
        };
        tryCompress();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
function addLeadPhotos(input) {
  const files = Array.from(input.files || []);
  for (const f of files) { if (leadPhotos.length >= 5) break; leadPhotos.push({ file: f, url: URL.createObjectURL(f) }); }
  input.value = '';
  renderPhotoPreviews();
}
function removeLeadPhoto(i) {
  URL.revokeObjectURL(leadPhotos[i].url);
  leadPhotos.splice(i, 1);
  renderPhotoPreviews();
}
function renderPhotoPreviews() {
  const wrap = document.getElementById('photoPreviews');
  wrap.innerHTML = leadPhotos.map((p, i) =>
    '<div class="photo-thumb"><img src="' + p.url + '" alt="Photo ' + (i + 1) + '">' +
    '<button type="button" aria-label="Remove photo" onclick="removeLeadPhoto(' + i + ')">×</button></div>'
  ).join('');
}

/* ---- Main quote form: compress -> upload -> insert ---- */
var DUP_KEY = 'ejs.leadSubmittedAt';
var lastSubmitAttempt = 0;
async function submitQuoteForm(e) {
  e.preventDefault();
  const now = Date.now();
  if (now - lastSubmitAttempt < 5000) return;
  lastSubmitAttempt = now;
  try {
    const prev = Number(localStorage.getItem(DUP_KEY) || 0);
    if (prev && now - prev < 30 * 60 * 1000) {
      const ok = document.getElementById('quoteFormSuccess');
      ok.innerHTML = '✅ <strong>We already have your request!</strong> We\'ll call you soon.<br>' +
        '<span style="font-size:13px;margin-top:6px;display:block;">Need us now? <a href="tel:3854415090" style="color:var(--navy-500);font-weight:700;">(385) 441-5090</a></span>';
      ok.style.display = 'block';
      document.getElementById('mainQuoteForm').style.display = 'none';
      return;
    }
  } catch (err) { /* private mode — continue */ }

  const form = document.getElementById('mainQuoteForm');
  const btn = document.getElementById('quoteSubmitBtn');
  const errBox = document.getElementById('quoteFormError');
  errBox.style.display = 'none';
  const val = (id) => (document.getElementById(id)?.value || '').trim();

  if (!selectedVolume) {
    errBox.innerHTML = '👆 <strong>Almost there!</strong> Please choose a load size — Small, Medium, or Large.';
    errBox.style.display = 'block';
    document.getElementById('volumePicker').scrollIntoView({ behavior: 'smooth', block: 'center' });
    lastSubmitAttempt = 0;
    return;
  }

  btn.disabled = true;
  btn.textContent = leadPhotos.length ? 'Uploading photos…' : 'Sending…';

  let service = val('qfService');
  if (service.indexOf('Other') === 0 && val('qfCustomService')) service = val('qfCustomService');
  const special = val('qfSpecialTime');
  const source = window.LEAD_SOURCE || 'city-page';
  const notes = [val('qfNotes'), 'Submitted via ' + (window.CITY_NAME || '') + ' landing page'].filter(Boolean).join(' — ');

  const lead = {
    name:    (val('qfFirstName') + ' ' + val('qfLastName')).trim(),
    phone:   val('qfPhone'),
    email:   val('qfEmail'),
    address: [val('qfStreet'), val('qfCity'), 'UT ' + val('qfZip')].filter(Boolean).join(', '),
    service: service,
    items:   val('qfItems'),
    date:    val('qfDate'),
    time:    special ? 'Special request: ' + special : selectedSlot,
    notes:   notes
  };

  fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: new URLSearchParams({ formType: source, ...lead, volume: selectedVolume }) });

  try {
    if (!sb) throw new Error('Supabase unavailable');
    const folder = crypto.randomUUID();
    const photoPaths = await Promise.all(leadPhotos.map(async (p, i) => {
      const compressed = await compressImage(p.file);
      const path = folder + '/photo-' + (i + 1) + '.jpg';
      const { error } = await sb.storage.from('lead-photos').upload(path, compressed, { contentType: 'image/jpeg' });
      if (error) throw error;
      return path;
    }));
    const { error: insertError } = await sb.from('lead_requests').insert({
      name: lead.name,
      phone: lead.phone,
      email: lead.email || null,
      service_address: lead.address || null,
      service_type: lead.service || null,
      volume_estimate: selectedVolume || null,
      items_description: lead.items || null,
      preferred_date: lead.date || null,
      preferred_time: lead.time || null,
      notes: lead.notes || null,
      photo_urls: photoPaths
    });
    if (insertError) throw insertError;
    try { localStorage.setItem(DUP_KEY, String(Date.now())); } catch (err) { /* ignore */ }
    document.getElementById('quoteFormSuccess').style.display = 'block';
    form.style.display = 'none';
  } catch (err) {
    console.error('Lead submission failed:', err);
    btn.disabled = false;
    btn.textContent = 'Submit Quote Request →';
    errBox.style.display = 'block';
  }
}

/* earliest selectable date = today; prefill city */
document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('qfDate');
  if (dateInput) dateInput.min = localDateStr(new Date());
  const cityInput = document.getElementById('qfCity');
  if (cityInput && window.CITY_NAME && !cityInput.value) cityInput.value = window.CITY_NAME;
});
