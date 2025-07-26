import React, { useEffect, useRef, useState } from 'react';
const STREAM_URL = "https://stream.wikimedia.org/v2/stream/revision-create"; 

function WikipediaReport({ mode = 1 }) {
  const eventBuffer = useRef([]); // will store incoming events i without causing re render
  const [reports, setReports] = useState({ domains: [], users: [], totalDomains: 0 }); // it will store our actual required  data 
  const [lastUpdated, setLastUpdated] = useState(null); // it will tell us when was the report last updated

  useEffect(() => {
    const source = new EventSource(STREAM_URL); //cponnecting to wikimedia stream

    source.onmessage = (event) => {
      const data = JSON.parse(event.data);
      data._receivedAt = Date.now(); // usinmg timestamp while pushing the events into eventBuffer
      eventBuffer.current.push(data);
    };
    // after that we will process the event buffer after every ( 1 or 5) minutes
    const interval = setInterval(() => {
      const now = Date.now();
      const windowMinutes = mode === 1 ? 1 : 5;
      const windowStart = now - windowMinutes * 60 * 1000;

      //filtering the events to keep only those who are within the time window
      eventBuffer.current = eventBuffer.current.filter(e => e._receivedAt >= windowStart);

      const domainMap = new Map(); // contains set of unique page titles (domains)
      const userMap = new Map(); // for edit counts on  en.wikipedia.org and are not bots

      for (const event of eventBuffer.current) {
        const domain = event?.meta?.domain;
        const title = event?.page_title;
        const performer = event?.performer;
        const isBot = performer?.user_is_bot;
        const user = performer?.user_text;
        const editCount = performer?.user_edit_count;

        if (domain && title) {
          if (!domainMap.has(domain)) domainMap.set(domain, new Set());
          domainMap.get(domain).add(title);
        }

        if (domain === "en.wikipedia.org" && user && !isBot) { // only for real users activity 
          if (!userMap.has(user) || userMap.get(user) < editCount) {
            userMap.set(user, editCount);
          }
        }
      }

      const domains = Array.from(domainMap.entries()) //sorting maps as per the task requirement
        .sort((a, b) => b[1].size - a[1].size)
        .map(([domain, pages]) => ({ domain, count: pages.size }));

      const users = Array.from(userMap.entries()) //
        .sort((a, b) => b[1] - a[1])
        .map(([user, count]) => ({ user, count }));

      setReports({ totalDomains: domainMap.size, domains, users });
      setLastUpdated(new Date().toLocaleTimeString());
    }, 60 * 1000); //it will hit Every 1 minute

    return () => { //cleanups
      source.close();
      clearInterval(interval);
    };
  }, [mode]);


  return (
    <div style={{ padding: '20px' }}>
      {lastUpdated && (
        <p className="text-xs text-gray-500 mb-3">
          Last updated: {lastUpdated}
        </p>
      )}
      <h2 className='font-semibold'>Wikipedia Report ({mode === 1 ? '1-min' : '5-min'} window)</h2>
      <p className='font-semibold'> Total Domains Updated: {reports.totalDomains}</p>

      <h3 className='font-semibold'>Domains:</h3>
      <ul>
        {reports.domains.map((d, i) => (
          <li key={i}>{d.domain}: {d.count} pages updated</li>
        ))}
      </ul>

      <h3 className='font-bold text-base sm:text-lg mt-4'>Users who edited en.wikipedia.org:</h3>
      <ul>
        {reports.users.map((u, i) => (
          <li key={i}>{u.user}: {u.count}</li>
        ))}
      </ul>
    </div>
  );
}

export default WikipediaReport;
