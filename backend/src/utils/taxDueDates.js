const TAX_DUE_DATES = {
  "United States": {
    Q1: (year) => ({ date: `${year}-04-15`, title: "Q1 Estimated Tax (US)" }),
    Q2: (year) => ({ date: `${year}-06-15`, title: "Q2 Estimated Tax (US)" }),
    Q3: (year) => ({ date: `${year}-09-15`, title: "Q3 Estimated Tax (US)" }),
    Q4: (year) => ({ date: `${year + 1}-01-15`, title: "Q4 Estimated Tax (US)" }),
  },
  "United Kingdom": {
    Q1: (year) => ({ date: `${year}-01-31`, title: "Q1 Payment on Account (UK)" }),
    Q2: (year) => ({ date: `${year}-07-31`, title: "Q2 Balancing Payment (UK)" }),
    Q3: (year) => ({ date: `${year}-10-31`, title: "Q3 Self Assessment (UK)" }),
    Q4: (year) => ({ date: `${year + 1}-01-31`, title: "Q4 Payment on Account (UK)" }),
  },
  Australia: {
    Q1: (year) => ({ date: `${year}-10-28`, title: "Q1 BAS Lodgement (AU)" }),
    Q2: (year) => ({ date: `${year + 1}-02-28`, title: "Q2 BAS Lodgement (AU)" }),
    Q3: (year) => ({ date: `${year + 1}-04-28`, title: "Q3 BAS Lodgement (AU)" }),
    Q4: (year) => ({ date: `${year + 1}-07-28`, title: "Q4 BAS Lodgement (AU)" }),
  },
  India: {
    Q1: (year) => ({ date: `${year}-06-15`, title: "Q1 Advance Tax (India)" }),
    Q2: (year) => ({ date: `${year}-09-15`, title: "Q2 Advance Tax (India)" }),
    Q3: (year) => ({ date: `${year}-12-15`, title: "Q3 Advance Tax (India)" }),
    Q4: (year) => ({ date: `${year + 1}-03-15`, title: "Q4 Advance Tax (India)" }),
  },
};

const getDueDateInfo = (country, quarter, year) => {
  const countryDates = TAX_DUE_DATES[country] || TAX_DUE_DATES["United States"];
  const fn = countryDates[quarter];
  return fn ? fn(Number(year)) : TAX_DUE_DATES["United States"][quarter](Number(year));
};

module.exports = { TAX_DUE_DATES, getDueDateInfo };
