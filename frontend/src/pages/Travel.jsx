const TRAVEL_RECORDS = [
  // Add verified personal records here:
  // {
  //   id: "2026-example",
  //   date: "2026-01-01",
  //   location: "City, Country",
  //   title: "Entry title",
  //   excerpt: "A short note about the journey.",
  //   image: "/path-to-image.jpg",
  // },
];

function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

function groupByYear(records) {
  return records.reduce((groups, record) => {
    const year = new Date(record.date).getFullYear();
    if (!groups[year]) groups[year] = [];
    groups[year].push(record);
    return groups;
  }, {});
}

function Travel() {
  const records = [...TRAVEL_RECORDS].sort((left, right) => new Date(right.date) - new Date(left.date));
  const recordsByYear = groupByYear(records);
  const years = Object.keys(recordsByYear).sort((left, right) => Number(right) - Number(left));
  const places = [...new Set(records.map((record) => record.location))];

  return (
    <div className="travel-page">
      <header className="travel-masthead">
        <p className="travel-masthead__edition">FYUO863 / TRAVEL ARCHIVE</p>
        <h1>Field Notes.</h1>
        <p className="travel-masthead__lede">A growing record of routes, places, and the moments kept between them.</p>
      </header>

      <div className="travel-ledger">
        <section className="travel-timeline" aria-labelledby="travel-timeline-title">
          <header className="travel-section-head">
            <h2 id="travel-timeline-title">Timeline.</h2>
            <p>Journeys are kept in the order they happened.</p>
          </header>

          {years.length > 0 ? (
            <div className="travel-timeline__years">
              {years.map((year) => (
                <section className="travel-year" key={year} aria-labelledby={`travel-year-${year}`}>
                  <h3 id={`travel-year-${year}`}>{year}</h3>
                  <ol className="travel-year__entries">
                    {recordsByYear[year].map((record) => (
                      <li className="travel-entry" id={`travel-${record.id}`} key={record.id}>
                        <time dateTime={record.date}>{formatDate(record.date)}</time>
                        <div className="travel-entry__copy">
                          <p className="travel-entry__place">{record.location}</p>
                          <h4>{record.title}</h4>
                          {record.excerpt && <p>{record.excerpt}</p>}
                        </div>
                        {record.image && <img src={record.image} alt={`${record.title} — ${record.location}`} loading="lazy" />}
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          ) : (
            <p className="travel-empty" role="status">The first record is waiting for its coordinates.</p>
          )}
        </section>

        <aside className="travel-places" aria-labelledby="travel-places-title">
          <h2 id="travel-places-title">Places.</h2>
          {places.length > 0 ? (
            <ol>
              {places.map((place) => {
                const firstRecord = records.find((record) => record.location === place);
                return <li key={place}><a href={`#travel-${firstRecord.id}`}>{place}</a></li>;
              })}
            </ol>
          ) : (
            <p>No places indexed yet.</p>
          )}
        </aside>
      </div>
    </div>
  );
}

export default Travel;
