exports.TAX_SLABS = {

  India: [
    { limit: 300000, rate: 0 },
    { limit: 700000, rate: 0.05 },
    { limit: 1000000, rate: 0.10 },
    { limit: 1200000, rate: 0.15 },
    { limit: 1500000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 }
  ],

  "United States": [
    { limit: 11600, rate: 0.10 },
    { limit: 47150, rate: 0.12 },
    { limit: 100525, rate: 0.22 },
    { limit: 191950, rate: 0.24 },
    { limit: 243725, rate: 0.32 },
    { limit: 609350, rate: 0.35 },
    { limit: Infinity, rate: 0.37 }
  ],

  "United Kingdom": [
    { limit: 12570, rate: 0 },
    { limit: 50270, rate: 0.20 },
    { limit: 125140, rate: 0.40 },
    { limit: Infinity, rate: 0.45 }
  ],

  Australia: [
    { limit: 18200, rate: 0 },
    { limit: 45000, rate: 0.16 },
    { limit: 135000, rate: 0.30 },
    { limit: 190000, rate: 0.37 },
    { limit: Infinity, rate: 0.45 }
  ]

};