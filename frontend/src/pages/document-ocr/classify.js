// Guesses the document type from OCR text by keyword hits. Each inner array lists
// alternatives for one keyword; a rule's score is the share of its keywords found.
const RULES = {
  ktp: [['NIK'], ['PROVINSI'], ['KABUPATEN', 'KOTA'], ['TEMPAT/TGL LAHIR'], ['GOL. DARAH', 'GOL DARAH'], ['BERLAKU HINGGA']],
  certificate: [['IJAZAH', 'SERTIFIKAT', 'CERTIFICATE'], ['DIBERIKAN KEPADA', 'AWARDED TO', 'PRESENTED TO'], ['LULUS', 'GRADUATED', 'COMPLETED']],
  invoice: [['INVOICE', 'FAKTUR', 'STRUK', 'RECEIPT'], ['TOTAL'], ['SUBTOTAL'], ['PPN', 'TAX', 'PAJAK'], ['QTY', 'JUMLAH']],
  cv: [['CURRICULUM VITAE', 'RESUME', 'RIWAYAT HIDUP'], ['PENGALAMAN', 'EXPERIENCE'], ['PENDIDIKAN', 'EDUCATION'], ['SKILLS', 'KEAHLIAN', 'KETERAMPILAN']],
}

const THRESHOLD = 0.3

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')

// Whole words only, so NIK does not match TEKNIK and TOTAL does not match SUBTOTAL.
const has = (text, word) => new RegExp(`(^|[^A-Z0-9])${escape(word)}([^A-Z0-9]|$)`).test(text)

/** @returns {{ type: 'ktp' | 'certificate' | 'invoice' | 'cv' | null, score: number }} */
export function classifyDocument(lines) {
  const text = lines.join(' ').toUpperCase()
  let best = { type: null, score: 0 }
  for (const [type, keywords] of Object.entries(RULES)) {
    const score = keywords.filter((alts) => alts.some((w) => has(text, w))).length / keywords.length
    if (score > best.score) best = { type, score }
  }
  return best.score >= THRESHOLD ? best : { type: null, score: best.score }
}
