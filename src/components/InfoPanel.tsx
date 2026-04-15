'use client';

const EXPERIENCE = [
  {
    company: 'Reacher Platforms',
    badge: 'YC S25',
    role: 'Software Engineer',
    location: 'San Francisco, USA',
    period: 'Jan 2026 – present',
    bullets: [
      'Built full-stack creative agent (React.js, Python, GCP) processing TikTok API data to surface top-performing products by GMV and generate revenue insights.',
      'Engineered content moderation platform analyzing 170K videos/week with Supadata + Sentry observability.',
    ],
  },
  {
    company: 'XNODE Inc',
    badge: 'Founding Eng',
    role: 'Founding Engineer',
    location: 'Remote, USA',
    period: 'Jan 2025 – Jan 2026',
    bullets: [
      'Built fullstack workflow system (TypeScript, FastAPI, SpringBoot) streaming chats into Jira/ADO, auto-generating specs — reduced PM effort by 80%.',
      'Implemented LLM-powered RAG pipeline (Azure Blob, PG Vector) for 6+ file formats with sub-second search via Redis.',
      'Introduced OpenTelemetry → Prometheus/Sentry, cutting incident triage time by 40%.',
    ],
  },
  {
    company: 'Blue Cross Blue Shield',
    badge: 'Florida Blue',
    role: 'Software Engineer',
    location: 'Florida, USA',
    period: 'Jul 2024 – Dec 2025',
    bullets: [
      'Designed Spring Boot + Apache Kafka service for real-time fraud detection, cutting failure rate by 73%.',
      'Automated PostgreSQL → AWS RDS migration, lowering storage costs by 30%.',
      'Migrated legacy apps to Java 17 microservices + Gradle 8.6, cutting infra costs by 20%.',
    ],
  },
  {
    company: 'Phenom',
    badge: null,
    role: 'Software Engineer',
    location: 'Hyderabad, India',
    period: 'Jul 2021 – Aug 2022',
    bullets: [
      'Shipped rule-based candidate profiling system (Spring Boot, MongoDB) streamlining 4K+ daily applicants, improving accuracy by 75%.',
      'Built REST microservice reducing customer onboarding from 3 days to minutes.',
    ],
  },
];

const SKILLS = [
  { label: 'Languages',    value: 'Java · Python · Go · JavaScript · SQL' },
  { label: 'Full Stack',   value: 'TypeScript · React.js · Spring Boot · FastAPI · Node.js · GraphQL · Kafka' },
  { label: 'Databases',    value: 'PostgreSQL · MySQL · MongoDB · DynamoDB · Redis · Elasticsearch' },
  { label: 'Cloud',        value: 'AWS · Azure · GCP · Docker · Kubernetes · Terraform · CI/CD' },
  { label: 'Observability',value: 'Prometheus · OpenTelemetry · Sentry · ELK · Grafana' },
  { label: 'AI & Tools',   value: 'LangChain · VectorDB · HuggingFace · LlamaIndex · Prompt Engineering' },
];

export default function InfoPanel() {
  return (
    <div className="panel-scroll h-full py-5 px-4 flex flex-col gap-5">

      {/* Header */}
      <div>
        <h2 className="gradient-text font-bold text-base tracking-tight">Indrani Inapakolla</h2>
        <p className="text-slate-500 text-xs mt-0.5">Software Engineer · 3+ years · San Francisco, CA</p>
        <div className="shimmer-line mt-3" />
      </div>

      {/* Summary */}
      <div>
        <SectionTitle emoji="📋" label="Summary" />
        <p className="text-xs text-slate-400 leading-relaxed mt-2">
          Software Engineer with 3 years across product and infrastructure, delivering scalable systems and cloud applications.
          Skilled in React, Spring Boot, Python, Kafka & Azure pipelines. Experienced with microservices, Docker/Kubernetes, and CI/CD.
        </p>
      </div>

      {/* Experience */}
      <div>
        <SectionTitle emoji="💼" label="Experience" />
        <div className="flex flex-col gap-2.5 mt-2">
          {EXPERIENCE.map((exp) => (
            <div key={exp.company} className="glass rounded-xl p-3.5" style={{ borderColor: 'rgba(255,0,128,0.1)' }}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-white">{exp.company}</span>
                    {exp.badge && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.25)' }}>
                        {exp.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-indigo-300/60 mt-0.5">{exp.role} · {exp.location}</p>
                </div>
                <span className="text-[9px] text-slate-600 shrink-0 mt-0.5">{exp.period}</span>
              </div>
              <ul className="space-y-1.5">
                {exp.bullets.map((b, i) => (
                  <li key={i} className="flex gap-1.5 text-[10px] text-slate-400 leading-relaxed">
                    <span className="text-indigo-400 shrink-0 mt-0.5">›</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div>
        <SectionTitle emoji="🎓" label="Education" />
        <div className="glass rounded-xl p-3 mt-2" style={{ borderColor: 'rgba(255,0,128,0.08)' }}>
          <p className="text-xs font-semibold text-slate-100">Arizona State University</p>
          <p className="text-[10px] text-slate-400 mt-0.5">M.S. Computer Science · GPA 4.0/4.0</p>
          <p className="text-[9px] text-slate-600 mt-0.5">Aug 2022 – May 2024 · Tempe, AZ</p>
          <p className="text-[9px] text-slate-500 mt-1 leading-relaxed">
            Adv. Data Structures, Distributed Systems, Operating Systems, Adv. DBMS, Data Science, NLP
          </p>
        </div>
      </div>

      {/* Skills */}
      <div>
        <SectionTitle emoji="🛠" label="Skills" />
        <div className="flex flex-col gap-1.5 mt-2">
          {SKILLS.map(({ label, value }) => (
            <div key={label}>
              <p className="text-[9px] text-indigo-400/60 uppercase tracking-widest font-semibold mb-0.5">{label}</p>
              <p className="text-[10px] text-slate-400 leading-relaxed">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Download CTA */}
      <a
        href="/Indrani_Inapakolla.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="neon-btn-pink rounded-xl py-2.5 text-center text-xs font-semibold text-white mt-1"
      >
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
