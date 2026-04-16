'use client';

const EXPERIENCE = [
  {
    company: 'Reacher Platforms',
    badge: 'YC S25',
    badgeColor: '#6366f1',
    role: 'Software Engineer',
    location: 'San Francisco, USA',
    period: 'Jan 2026 – Present',
    bullets: [
      'Built Creative Analytics feature — full-stack analytics platform ingesting TikTok performance data, ranking top-GMV products/videos, and generating AI-powered creative briefs so brands make faster content decisions.',
      'Built Creator Compliance pipeline — distributed transcript-processing system checking 170K+ videos/week against brand-defined rules and auto-triggering corrective AI briefs for non-compliant content.',
      'Built GMV Max / Campaign Boost Automation — backend decisioning engine evaluating eligibility rules, matching product-aligned creatives, and auto-applying boosts across 1,000+ brands with 90% test coverage.',
      'Optimized full stack: API caching, pagination, lazy loading, sharded Cloud Run jobs, partitioned BigQuery workloads, hash-based deduplication, Sentry observability.',
      'Built Retool dashboards for customer-facing teams — self-serve visibility into creator performance, moderation queues, and revenue metrics, eliminating 6+ hours/week of manual reporting.',
      'Resolved customer support tickets end-to-end within 24–28 hours, working directly with brand teams to debug issues and close the feedback loop fast.',
    ],
    tech: ['React.js', 'Python', 'GCP', 'BigQuery', 'Pub/Sub', 'Retool', 'SQL', 'Sentry', 'TikTok API', 'Supadata'],
  },
  {
    company: 'XNODE Inc',
    badge: 'Founding Eng',
    badgeColor: '#10b981',
    role: 'Founding Engineer',
    location: 'Remote, USA',
    period: 'Jan 2025 – Jan 2026',
    bullets: [
      'Architected LLM-powered workflow automation system (TypeScript, FastAPI, Spring Boot) streaming chat conversations into structured Jira/ADO tickets and auto-generated specs — cut PM manual effort by 80%.',
      'Built production RAG pipeline supporting 6+ file formats (PDF, DOCX, XLSX, CSV, MD, HTML) with Azure Blob, PG Vector embeddings, and Redis caching — achieved sub-second query latency.',
      'Introduced OpenTelemetry → Prometheus → Sentry observability from scratch — reduced incident triage by 40%, enabled SLO tracking; team was flying blind before this.',
      'Scaled to 200+ concurrent users via connection pooling, Celery + Redis async queues, and Kubernetes HPA.',
      'Contributed to $500K seed fundraise — built the live demo system and all investor-facing technical documentation.',
    ],
    tech: ['TypeScript', 'FastAPI', 'Spring Boot', 'LLM / RAG', 'Azure Blob', 'PG Vector', 'Redis', 'OpenTelemetry', 'Prometheus', 'Kubernetes', 'Celery'],
  },
  {
    company: 'Blue Cross Blue Shield',
    badge: 'Florida Blue',
    badgeColor: '#3b82f6',
    role: 'Software Engineer',
    location: 'Florida, USA',
    period: 'Jul 2024 – Dec 2024',
    bullets: [
      'Designed Spring Boot + Kafka real-time fraud detection pipeline across 50K+ daily transactions — cut failure rate 73%. Used consumer group tuning, async processing, and dead-letter queues.',
      'Automated zero-downtime PostgreSQL → AWS RDS migration (pg_dump + AWS DMS with continuous replication) — cut storage costs 30%, improved read performance 2×.',
      'Led Java 8 → Java 17 modernization of 4 legacy monoliths using strangler-fig pattern — reduced infra costs 20%, CI build times 35%.',
      'Implemented OAuth2 + JWT refresh across 8 internal APIs — eliminated 100% of session-related security incidents in Q4.',
    ],
    tech: ['Java 17', 'Spring Boot', 'Apache Kafka', 'PostgreSQL', 'AWS RDS', 'AWS DMS', 'OAuth2', 'JWT', 'Docker', 'Gradle'],
  },
  {
    company: 'Phenom',
    badge: null,
    badgeColor: '',
    role: 'Software Engineer',
    location: 'Hyderabad, India',
    period: 'Jul 2021 – Aug 2022',
    bullets: [
      'Built rule-based candidate profiling engine (Spring Boot + MongoDB) processing 4K+ daily applicants with configurable scoring per client — improved assessment accuracy 75%, cut recruiter review time in half.',
      'Built onboarding microservice replacing a 3-day manual setup process with a self-serve automated flow completing in under 5 minutes — unlocked scale for enterprise client acquisition.',
      'Built real-time recruiter dashboard (React + WebSockets) giving live pipeline visibility across 50+ enterprise clients — replaced manual refresh/reporting workflows.',
      'Achieved 85%+ test coverage (JUnit 5 + Mockito) across all owned services — significantly above team average.',
    ],
    tech: ['Spring Boot', 'MongoDB', 'React', 'WebSockets', 'REST APIs', 'JUnit 5', 'Mockito', 'Jenkins'],
  },
];

const SKILLS_GRID = [
  { label: 'Languages',      items: ['Java', 'Python', 'Go', 'TypeScript', 'JavaScript', 'SQL', 'Bash'] },
  { label: 'Frontend',       items: ['React.js', 'Next.js', 'GraphQL', 'WebSockets', 'Tailwind CSS', 'Ant Design'] },
  { label: 'Backend',        items: ['Spring Boot', 'FastAPI', 'Node.js', 'REST APIs', 'gRPC', 'Kafka', 'Celery'] },
  { label: 'Databases',      items: ['PostgreSQL', 'AlloyDB', 'MySQL', 'MongoDB', 'Redis', 'DynamoDB', 'Elasticsearch', 'PG Vector'] },
  { label: 'Cloud & DevOps', items: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'GitHub Actions', 'Postman'] },
  { label: 'AI / ML',        items: ['LangChain', 'LlamaIndex', 'HuggingFace', 'RAG Pipelines', 'Vector DBs', 'Prompt Engineering', 'OpenAI API'] },
  { label: 'Observability',  items: ['Prometheus', 'Grafana', 'OpenTelemetry', 'Sentry', 'ELK Stack', 'Datadog'] },
];

const PROJECTS = [
  {
    name: 'Real-Time Transaction Risk Scorer',
    desc: 'Flags & blocks risky financial transactions using rule-based logic + ML. Processes transactions in real-time for instant fraud prevention.',
    tech: ['Python', 'ML', 'Redis', 'REST API'],
    url: 'https://github.com/Indrani-19/real-time-risk-scorer',
  },
  {
    name: 'AI Code Review Tool',
    desc: 'AI-powered automated code review system with LLM-based suggestions, Flask backend, and PostgreSQL audit trail.',
    tech: ['Flask', 'PostgreSQL', 'LLM', 'Python'],
    url: 'https://github.com/Indrani-19/AI-Code-Review-Tool',
  },
  {
    name: 'Vulnerability Scanner',
    desc: 'Go-based security scanner with concurrent processing, SQLite storage, REST API, severity filtering. 85%+ test coverage.',
    tech: ['Go', 'SQLite', 'REST API', 'Security'],
    url: 'https://github.com/Indrani-19/vulnerability-scanner',
  },
  {
    name: 'High-Availability AWS Deployment',
    desc: 'Scalable PHP app on AWS with multi-AZ RDS, Auto Scaling Groups, ALB, and VPC — designed for 99.9% uptime.',
    tech: ['AWS', 'RDS', 'ALB', 'Auto Scaling'],
    url: 'https://github.com/Indrani-19/High-Availability-PHP-Application-Deployment-on-AWS',
  },
];

export default function InfoPanel() {
  return (
    <div className="panel-scroll h-full py-5 px-4 flex flex-col gap-6">

      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <h2 className="gradient-text font-bold text-base tracking-tight">Indrani Inapakolla</h2>
        <p className="text-slate-400 text-xs mt-0.5">Full Stack Engineer · AI · 3+ years · San Francisco, CA</p>
        <div className="flex gap-2 mt-2 flex-wrap" style={{ justifyContent: 'center' }}>
          {['Open to opportunities', 'GPA 4.0/4.0'].map(tag => (
            <span key={tag} style={{ fontSize: 9, padding: '2px 8px', borderRadius: 999, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc' }}>{tag}</span>
          ))}
        </div>
        <div className="shimmer-line mt-3" />
      </div>

      {/* Summary */}
      <div>
        <SectionTitle emoji="📋" label="Summary" />
        <p className="text-xs text-slate-400 leading-relaxed mt-2">
          Full Stack Engineer with 3+ years shipping production systems across startups (YC-backed) and enterprise.
          Specializes in distributed systems, LLM-powered pipelines, and scalable cloud infrastructure.
          Passionate about AI integration, observability, and building systems that handle real-world load.
          M.S. Computer Science (GPA 4.0) from Arizona State University.
        </p>
      </div>

      {/* Experience */}
      <div>
        <SectionTitle emoji="💼" label="Experience" />
        <div className="flex flex-col gap-3 mt-2">
          {EXPERIENCE.map((exp) => (
            <div key={exp.company} className="glass rounded-xl p-3.5" style={{ borderColor: 'rgba(99,102,241,0.12)' }}>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-white">{exp.company}</span>
                    {exp.badge && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: `${exp.badgeColor}18`, color: exp.badgeColor, border: `1px solid ${exp.badgeColor}40` }}>
                        {exp.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-indigo-300/60 mt-0.5">{exp.role} · {exp.location}</p>
                </div>
                <span className="text-[9px] text-slate-500 shrink-0 mt-0.5">{exp.period}</span>
              </div>
              <ul className="space-y-1.5 mb-2">
                {exp.bullets.map((b, i) => (
                  <li key={i} className="flex gap-1.5 text-[10px] text-slate-400 leading-relaxed">
                    <span className="text-indigo-400 shrink-0 mt-0.5">›</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-1 mt-2">
                {exp.tech.map(t => (
                  <span key={t} style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: 'rgba(99,102,241,0.08)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.15)' }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div>
        <SectionTitle emoji="🎓" label="Education" />
        <div className="glass rounded-xl p-3.5 mt-2" style={{ borderColor: 'rgba(99,102,241,0.12)' }}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-slate-100">Arizona State University</p>
              <p className="text-[10px] text-indigo-300/70 mt-0.5">M.S. Computer Science</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' }}>GPA 4.0 / 4.0</span>
              <p className="text-[9px] text-slate-500 mt-1">Aug 2022 – May 2024</p>
            </div>
          </div>
          <p className="text-[9px] text-slate-500 mt-2 leading-relaxed">
            Coursework: Adv. Data Structures · Distributed Systems · Operating Systems · Adv. DBMS · Data Science · NLP · Cloud Computing
          </p>
        </div>
      </div>

      {/* Certifications & Publication */}
      <div id="cert-section">
        <SectionTitle emoji="🏅" label="Certifications & Publication" />
        <div className="flex flex-col gap-2 mt-2">
          <a href="https://www.credly.com/badges/759a0ea8-a39c-463b-8a07-7b10c5e39e51/public_url" target="_blank" rel="noopener noreferrer"
            className="glass rounded-xl p-3 flex items-center gap-3"
            style={{ borderColor: 'rgba(99,102,241,0.12)', textDecoration: 'none' }}>
            <span style={{ fontSize: 20 }}>🟣</span>
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-slate-200">HashiCorp Terraform Associate</p>
              <p className="text-[9px] text-slate-500 mt-0.5">HashiCorp · 2025 · Credly verified</p>
            </div>
            <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 999, background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}>View ↗</span>
          </a>

          <a href="https://www.credly.com/badges/ab0fb8e1-fe67-4d40-9eb8-1cec792bce52/linked_in_profile" target="_blank" rel="noopener noreferrer"
            className="glass rounded-xl p-3 flex items-center gap-3"
            style={{ borderColor: 'rgba(99,102,241,0.12)', textDecoration: 'none' }}>
            <span style={{ fontSize: 20 }}>🟠</span>
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-slate-200">AWS Certified Solutions Architect</p>
              <p className="text-[9px] text-slate-500 mt-0.5">Amazon Web Services · 2023 · Associate</p>
            </div>
            <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 999, background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}>View ↗</span>
          </a>

          <a href="https://doi.org/10.1515/9783110732573-005" target="_blank" rel="noopener noreferrer"
            className="glass rounded-xl p-3 flex items-start gap-3"
            style={{ borderColor: 'rgba(99,102,241,0.12)', textDecoration: 'none' }}>
            <span style={{ fontSize: 20 }}>📄</span>
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-slate-200 leading-snug">"Internet of Cloud: Secure and Privacy Preserving Cloud Model with IoT Enabled Service"</p>
              <p className="text-[9px] text-slate-500 mt-0.5">Published in <span className="text-indigo-300/70">Cloud Security</span>, De Gruyter · 2021</p>
            </div>
            <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 999, background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)', flexShrink: 0 }}>DOI ↗</span>
          </a>
        </div>
      </div>

      {/* Skills */}
      <div>
        <SectionTitle emoji="🛠" label="Skills" />
        <div className="flex flex-col gap-2.5 mt-2">
          {SKILLS_GRID.map(({ label, items }) => (
            <div key={label}>
              <p className="text-[9px] text-indigo-400/60 uppercase tracking-widest font-semibold mb-1">{label}</p>
              <div className="flex flex-wrap gap-1">
                {items.map(item => (
                  <span key={item} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div>
        <SectionTitle emoji="🚀" label="Projects" />
        <div className="flex flex-col gap-2 mt-2">
          {PROJECTS.map((p) => (
            <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
              className="glass rounded-xl p-3 block"
              style={{ borderColor: 'rgba(99,102,241,0.1)', textDecoration: 'none' }}>
              <p className="text-[10px] font-semibold text-slate-200">{p.name}</p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{p.desc}</p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {p.tech.map(t => (
                  <span key={t} style={{ fontSize: 9, padding: '1px 6px', borderRadius: 4, background: 'rgba(99,102,241,0.08)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.15)' }}>{t}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <SectionTitle emoji="🏆" label="Achievements & Stats" />
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            { label: 'LeetCode Solved', value: '429 problems', sub: '155 Easy · 228 Med · 46 Hard' },
            { label: 'MS GPA', value: '4.0 / 4.0', sub: 'Arizona State University' },
            { label: 'Incident Reduction', value: '40% faster', sub: 'via OpenTelemetry at XNODE' },
            { label: 'PM Effort Saved', value: '80% reduction', sub: 'Workflow automation at XNODE' },
            { label: 'Fraud Detection', value: '73% fewer failures', sub: 'Kafka pipeline at BCBS' },
            { label: 'Videos Moderated', value: '170K / week', sub: 'Content platform at Reacher' },
          ].map(({ label, value, sub }) => (
            <div key={label} className="glass rounded-xl p-2.5" style={{ borderColor: 'rgba(99,102,241,0.1)' }}>
              <p className="text-[9px] text-indigo-400/60 uppercase tracking-widest font-semibold">{label}</p>
              <p className="text-xs font-bold text-white mt-0.5">{value}</p>
              <p className="text-[9px] text-slate-500 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Writing */}
      <div>
        <SectionTitle emoji="✍️" label="Technical Writing" />
        <div className="flex flex-col gap-1.5 mt-2">
          {[
            { title: 'How Distributed Systems Communicate', sub: 'Choosing patterns for real-time and scale', url: 'https://medium.com/@indhuinapakolla' },
            { title: 'How ChatGPT Carries a Conversation', sub: 'Memory, context windows, and LLM internals', url: 'https://medium.com/@indhuinapakolla' },
            { title: 'Google Spanner: A Database That Breaks the Rules', sub: 'Globally distributed SQL at scale', url: 'https://medium.com/@indhuinapakolla' },
          ].map(({ title, sub, url }) => (
            <a key={title} href={url} target="_blank" rel="noopener noreferrer"
              className="flex gap-2 items-start" style={{ textDecoration: 'none' }}>
              <span style={{ color: '#6366f1', marginTop: 2, fontSize: 10 }}>›</span>
              <div>
                <p className="text-[10px] text-slate-300 font-medium">{title}</p>
                <p className="text-[9px] text-slate-500">{sub}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Download CTA */}
      <a href="/Indrani_Inapakolla.pdf" target="_blank" rel="noopener noreferrer"
        className="neon-btn-pink rounded-xl py-2.5 text-center text-xs font-semibold text-white mt-1"
        style={{ textDecoration: 'none' }}>
        📄 Download Resume
      </a>

    </div>
  );
}

function SectionTitle({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{emoji}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400/70">{label}</span>
    </div>
  );
}
