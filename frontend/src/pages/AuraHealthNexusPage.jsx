import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowLeft, ExternalLink,
  Database, Brain, Shield, Layers, Search,
  Terminal, Send, AlertCircle, RefreshCw,
  Lock, Cpu, ChevronRight, Zap,
} from 'lucide-react';

// ─── Production limits (matching actual app.py) ──────────────────────────────
const MAX_INPUT_LENGTH = 500;
const RATE_LIMIT = 25;
const CONTEXT_WINDOW = 5;

// ─── RAG knowledge base ──────────────────────────────────────────────────────
const KNOWLEDGE_BASE = [
  {
    keywords: ['sharma', 'doctor', 'consultation', 'hours', 'available', 'appointment', 'schedule', 'timing', 'when'],
    chunks: [
      'dr_sharma_profile.txt [chunk 2/4]: "Dr. Priya Sharma is available for consultations Monday through Friday, 9:00 AM to 1:00 PM IST, and Tuesday/Thursday 3:00 PM to 6:00 PM."',
      'aurahealth_scheduling.txt [chunk 1/3]: "All appointments must be pre-booked via the internal AuraHealth Nexus portal at least 24 hours in advance."',
    ],
    answer: "Dr. Priya Sharma is available Monday through Friday from 9:00 AM to 1:00 PM IST, and additionally on Tuesdays and Thursdays from 3:00 PM to 6:00 PM. All appointments must be booked at least 24 hours in advance via the internal portal.",
  },
  {
    keywords: ['neural', 'link', 'implant', 'recalibration', 'calibration', 'drift', 'signal', 'technician', 'nl-7'],
    chunks: [
      'neural_link_calibration_protocol.txt [chunk 1/3]: "Neural-Link implants must undergo mandatory recalibration every 72 hours to prevent signal drift. A missed session triggers a Level-2 alert in the AuraHealth monitoring dashboard."',
      'neural_link_calibration_protocol.txt [chunk 2/3]: "Recalibration must be performed by a certified AuraHealth Neural Technician. Self-calibration is strictly prohibited under Protocol NL-7."',
    ],
    answer: "Neural-Link implants require mandatory recalibration every 72 hours to prevent signal drift. This must be performed by a certified AuraHealth Neural Technician — self-calibration is strictly prohibited under Protocol NL-7. Missing a session triggers a Level-2 monitoring alert.",
  },
  {
    keywords: ['prosthetic', 'cybernetic', 'lubricant', 'biosynth', 'maintenance', 'servo', 'joint', 'overhaul', 'quarterly'],
    chunks: [
      'cybernetic_prosthetics_maintenance.txt [chunk 2/4]: "Only AuraHealth-approved BioSynth Lubricant Grade-3 must be used during quarterly joint maintenance. Third-party lubricants void the warranty and may cause servo degradation."',
      'cybernetic_prosthetics_maintenance.txt [chunk 3/4]: "Maintenance intervals: minor joint check every 30 days, full servo overhaul every 6 months."',
    ],
    answer: "Only AuraHealth-approved BioSynth Lubricant Grade-3 is permitted during maintenance. Third-party lubricants void the warranty and risk servo degradation. Minor joint checks are required every 30 days, with a full servo overhaul every 6 months.",
  },
  {
    keywords: ['protocol', 'medication', 'cardiac', 'metoprolol', 'aspirin', 'ecg', 'prescribed', 'treatment'],
    chunks: [
      'medical_protocol_a.txt [chunk 1/5]: "Protocol A (High-Priority Cardiac) — Prescribed: Metoprolol 50mg twice daily. Secondary: Aspirin 75mg daily."',
      'medical_protocol_a.txt [chunk 3/5]: "Protocol A patients must undergo ECG monitoring every 48 hours and report any chest discomfort immediately."',
    ],
    answer: "Protocol A (High-Priority Cardiac) prescribes Metoprolol 50mg twice daily as the primary medication, with Aspirin 75mg daily as secondary. Patients on this protocol must undergo ECG monitoring every 48 hours and report any chest discomfort immediately.",
  },
  {
    keywords: ['emergency', 'code', 'red', 'evacuation', 'alert', 'level', 'procedure', 'incident'],
    chunks: [
      'emergency_protocols.txt [chunk 1/3]: "Code Red (Medical Emergency) requires all non-essential staff to vacate within 3 minutes. Emergency Response Team must be paged via the AuraHealth internal paging system."',
      'emergency_protocols.txt [chunk 2/3]: "Level-1 Alert: Immediate threat. Level-2 Alert: Monitoring required. All alerts auto-escalate if unacknowledged for 15 minutes."',
    ],
    answer: "During a Code Red (Medical Emergency), all non-essential staff must vacate within 3 minutes. The Emergency Response Team is paged via the internal paging system. Alerts escalate to Level-1 (Immediate Threat) and auto-escalate if unacknowledged for 15 minutes.",
  },
  {
    keywords: ['who', 'are', 'you', 'what', 'identity', 'name', 'aurahealth', 'ai', 'system', 'hello', 'hi'],
    chunks: [
      'system_architecture.txt [chunk 1/1]: "AuraHealth Nexus AI is a highly classified secure internal system designed to assist authorized personnel with proprietary protocols."'
    ],
    answer: "I am AuraHealth Nexus AI, a secure internal system designed to assist authorized personnel with classified protocols. I only have access to authorized records.",
  },
  {
    keywords: ['wifi', 'password', 'network', 'internet', 'credentials', 'login', 'access', 'vpn', 'budget', 'salary', 'financial', 'revenue', 'profit'],
    chunks: [
      'it_policy.txt [chunk 1/2]: "IT systems and network credentials are managed exclusively by the IT department. Staff must submit a credentials request via the IT helpdesk portal."',
      'aurahealth_security.txt [chunk 2/4]: "Network access credentials are rotated every 30 days and are not stored in any accessible document system."',
    ],
    answer: "I don't have that information.",
  },
];

function matchKnowledge(query) {
  const normalizedQuery = query.toLowerCase().trim();
  const queryWords = normalizedQuery.replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2);
  
  let bestMatch = null;
  let bestScore = 0;
  
  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;
    const entryText = (entry.keywords.join(' ') + ' ' + entry.answer + ' ' + entry.chunks.join(' ')).toLowerCase();
    
    // Exact phrase match gives a massive boost
    if (normalizedQuery.length > 4 && entryText.includes(normalizedQuery)) {
      score += 15;
    }

    // Word overlap scoring
    for (const w of queryWords) {
      if (entryText.includes(w)) {
        score += 2;
      }
    }
    
    // Keyword specific matching
    for (const kw of entry.keywords) {
      if (normalizedQuery.includes(kw)) {
        score += 3;
      }
    }

    if (score > bestScore) { 
      bestScore = score; 
      bestMatch = entry; 
    }
  }

  // Threshold to act like cosine similarity distance cutoff
  if (bestScore < 3) {
    return {
      chunks: ['[No matching classified records found for this query — ChromaDB cosine similarity returned 0 results above threshold]'],
      answer: "I don't have that information.",
    };
  }
  return bestMatch;
}

const SUGGESTIONS = [
  { label: "Dr. Sharma's hours?", query: "What are Dr. Sharma's consultation hours?" },
  { label: "Neural-Link calibration?", query: "What is the recalibration interval for a Neural-Link implant?" },
  { label: "Prosthetics lubricant?", query: "What lubricant is approved for Cybernetic Prosthetics?" },
  { label: "Protocol A meds?", query: "What medication is prescribed for Protocol A?" },
  { label: "Emergency procedure?", query: "What is the Code Red emergency procedure?" },
  { label: "WiFi password?", query: "What is the hospital wifi password?" },
];

export default function AuraHealthNexusPage() {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeInsight, setActiveInsight] = useState(0);
  const [hoveredNode, setHoveredNode] = useState(null);

  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showChunks, setShowChunks] = useState(null);
  const [queryCount, setQueryCount] = useState(0);
  const [rateLimited, setRateLimited] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  const scrollChat = useCallback(() => {
    if (chatContainerRef.current) {
      // Use setTimeout to ensure DOM has updated before scrolling
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 10);
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const t = setTimeout(() => setVisible(true), 60);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => { clearTimeout(t); window.removeEventListener('resize', handleResize); };
  }, []);

  useEffect(() => { scrollChat(); }, [chatMessages, isThinking, scrollChat]);

  const sendQuery = (overrideText) => {
    const text = (overrideText || userInput).trim().slice(0, MAX_INPUT_LENGTH);
    if (!text || isThinking || rateLimited) return;

    if (queryCount >= RATE_LIMIT) { setRateLimited(true); return; }

    setUserInput('');
    setIsThinking(true);
    setChatMessages(prev => [...prev, { role: 'user', content: text }]);

    const match = matchKnowledge(text);
    const thinkTime = 900 + Math.random() * 900;

    setTimeout(() => {
      setChatMessages(prev => {
        const updated = [...prev, {
          role: 'assistant',
          content: match.answer,
          chunks: match.chunks,
          id: Date.now(),
        }];
        return updated.slice(-CONTEXT_WINDOW * 2);
      });
      setIsThinking(false);
      setQueryCount(c => c + 1);
    }, thinkTime);
  };

  const resetChat = () => {
    setChatMessages([]);
    setUserInput('');
    setQueryCount(0);
    setRateLimited(false);
    setShowChunks(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendQuery(); }
  };

  const insights = [
    {
      label: 'Zero Hallucination',
      stat: '100%',
      statLabel: 'factual accuracy in testing',
      color: 'var(--accent-cyan)',
      desc: "By enforcing temperature=0 and a strict system prompt ('Answer ONLY from provided records'), the model returned 'I don't have that information' for every unanswerable query — never guessing or fabricating data.",
    },
    {
      label: 'Production Limits',
      stat: '5 / 500',
      statLabel: 'history turns / input char limit',
      color: 'var(--accent-blue)',
      desc: 'Hardcoded production safeguards prevent token overflow: MAX_HISTORY_TURNS=5 keeps the sliding context window lightweight, and MAX_INPUT_LENGTH=500 blocks malicious prompt injection attacks or large accidental pastes.',
    },
    {
      label: 'HIPAA Safe',
      stat: '0',
      statLabel: 'bytes sent to public LLMs',
      color: '#f472b6',
      desc: 'All embedding generation runs locally on CPU via HuggingFace in offline mode (HF_HUB_OFFLINE=1). Classified document contents never leave the local machine — only the sanitized user query reaches the Groq API.',
    },
  ];

  const phase1Nodes = [
    { Icon: Terminal, step: 'LOAD', title: 'Document Loading', desc: '12 classified .txt files parsed via LangChain DirectoryLoader — including Cybernetic Prosthetics and Neural-Link Calibration Protocols.' },
    { Icon: Layers, step: 'CHUNK', title: 'Semantic Chunking', desc: '1,000-char chunks with 200-char overlap to preserve sentence context across boundaries.' },
    { Icon: Cpu, step: 'EMBED', title: 'Vectorization', desc: 'HuggingFace all-MiniLM-L6-v2 converts text to dense float vectors locally on CPU — zero internet required.' },
    { Icon: Database, step: 'STORE', title: 'ChromaDB Storage', desc: 'Embeddings persisted in a local SQLite-backed ChromaDB vector store at ./chroma_db.' },
  ];

  const phase2Nodes = [
    { Icon: Search, step: 'QUERY', title: 'User Query', desc: 'Natural language question submitted by an authorized internal user — capped at 500 chars.' },
    { Icon: Brain, step: 'CONDENSE', title: 'Context Reformulation', desc: 'If chat history exists, a background LLM prompt resolves pronouns and creates a standalone question.' },
    { Icon: Zap, step: 'RETRIEVE', title: 'Cosine Similarity', desc: 'Query is embedded; top 4 most relevant chunks retrieved from ChromaDB via cosine similarity search.' },
    { Icon: Shield, step: 'GENERATE', title: 'Augmented Generation', desc: 'Retrieved chunks injected into a strict system prompt. Groq Llama-3 answers at temperature=0 — no guessing.' },
  ];

  const techStack = [
    { name: 'LangChain', role: 'Orchestration framework for the full RAG pipeline' },
    { name: 'ChromaDB', role: 'Local SQLite-backed vector database (./chroma_db)' },
    { name: 'HuggingFace', role: 'all-MiniLM-L6-v2 embeddings — runs 100% offline on CPU' },
    { name: 'Groq API', role: 'Llama-3.1-8b-instant LLM inference at temperature=0' },
    { name: 'Python 3.11', role: 'Core runtime environment with python-dotenv' },
    { name: 'LangChain Core', role: 'MessagesPlaceholder, ChatPromptTemplate, message history' },
  ];

  const PipelineSection = ({ nodes, phase, color }) => (
    <div style={{ marginBottom: isMobile ? 32 : 56 }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em',
        textTransform: 'uppercase', padding: '5px 14px', borderRadius: 6, marginBottom: 28,
        background: `color-mix(in srgb, ${color} 10%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
        color,
      }}>
        {phase}
      </div>
      <div className={isMobile ? 'flex flex-col gap-4' : 'flex flex-row items-stretch gap-3'}>
        {nodes.map((node, i) => (
          <div key={node.step} className={isMobile ? '' : 'flex flex-row items-center flex-1'}>
            <div
              className="glass-panel"
              onMouseEnter={() => setHoveredNode(`${phase}-${i}`)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{
                flex: 1, padding: isMobile ? '20px 18px 24px' : '24px 20px 28px',
                display: 'flex', flexDirection: 'column', gap: 12,
                position: 'relative', width: '100%',
                minHeight: isMobile ? 'unset' : 220,
                transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                boxShadow: hoveredNode === `${phase}-${i}` ? `0 0 24px color-mix(in srgb, ${color} 22%, transparent)` : 'none',
                borderColor: hoveredNode === `${phase}-${i}` ? color : 'var(--border-accent)',
              }}
            >
              <span style={{
                position: 'absolute', top: 14, right: 16,
                fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 800,
                color, opacity: hoveredNode === `${phase}-${i}` ? 0.35 : 0.1,
                lineHeight: 1, transition: 'opacity 0.3s ease',
              }}>{String(i + 1).padStart(2, '0')}</span>

              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: `color-mix(in srgb, ${color} 14%, transparent)`,
                border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color, transition: 'background 0.3s ease', flexShrink: 0,
              }}><node.Icon size={20} /></div>

              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>{node.step}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10, lineHeight: 1.3 }}>{node.title}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65 }}>{node.desc}</div>
              </div>
            </div>

            {i < nodes.length - 1 && (
              <div className="flex justify-center items-center py-0 px-2" style={{ color, opacity: 0.5, flexShrink: 0 }}>
                <svg width="28" height="14" viewBox="0 0 32 16" fill="none">
                  <line x1="0" y1="8" x2="23" y2="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
                  <polygon points="23,4 32,8 23,12" fill="currentColor" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className="project-page"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(18px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}
    >
      {/* ═══ CHAPTER 01 — HERO ═══ */}
      <section className="chapter-section" style={{ paddingTop: 160 }}>
        <div className="section-container">
          <nav style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: isMobile ? 28 : 48 }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px', opacity: 0.4 }}>/</span>
            <Link to="/projects" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Projects</Link>
            <span style={{ margin: '0 8px', opacity: 0.4 }}>/</span>
            <span style={{ color: 'var(--text-secondary)' }}>AURAHEALTH NEXUS</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start md:items-center w-full overflow-hidden min-w-0">
            <div className="mb-10 md:mb-0">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
                <span className="tag-pill-v2 tag-pill-v2--purple">RAG</span>
                <span className="tag-pill-v2">LANGCHAIN</span>
                <span className="tag-pill-v2">CHROMADB</span>
                <span className="tag-pill-v2">LLAMA-3</span>
              </div>

              <h1 style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, lineHeight: 1.05, margin: '0 0 24px' }} className="text-5xl md:text-7xl">
                <span style={{ color: 'var(--text-primary)' }}>AuraHealth</span>
                <br />
                <span style={{ color: 'var(--text-primary)' }}>Nexus</span>
                <span style={{ color: 'var(--accent-cyan)' }}>_</span>
              </h1>

              <p style={{ fontFamily: 'var(--font-sans)', fontSize: isMobile ? 15 : 17, lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: 480, marginBottom: 36 }}>
                A fully offline, HIPAA-safe Retrieval-Augmented Generation system that forces an LLM to answer exclusively from a private ChromaDB vector store — eliminating hallucinations and data leaks entirely.
              </p>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <a href="#chat-demo" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent-cyan) 12%, transparent), color-mix(in srgb, var(--accent-blue) 10%, transparent))',
                  border: '1px solid var(--border-accent)', borderRadius: 10, color: 'var(--accent-cyan)',
                  fontFamily: 'var(--font-mono)', fontSize: isMobile ? 12 : 13, fontWeight: 700,
                  letterSpacing: '0.06em', padding: isMobile ? '11px 20px' : '13px 28px', textDecoration: 'none',
                  textTransform: 'uppercase', transition: 'all 0.25s ease',
                  flex: isMobile ? 1 : undefined, justifyContent: isMobile ? 'center' : undefined,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'color-mix(in srgb, var(--accent-cyan) 18%, transparent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, color-mix(in srgb, var(--accent-cyan) 12%, transparent), color-mix(in srgb, var(--accent-blue) 10%, transparent))'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  Try Chat Demo
                </a>
                <a href="https://github.com/harrsh-here/aiml-crash-harrsh"
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: 'transparent', border: '1px solid var(--border)',
                    borderRadius: 10, color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)', fontSize: isMobile ? 12 : 13, fontWeight: 600,
                    letterSpacing: '0.06em', padding: isMobile ? '11px 20px' : '13px 28px', textDecoration: 'none',
                    textTransform: 'uppercase', transition: 'all 0.25s ease',
                    flex: isMobile ? 1 : undefined, justifyContent: isMobile ? 'center' : undefined,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-cyan)'; e.currentTarget.style.color = 'var(--accent-cyan)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  View Source <ArrowRight size={14} />
                </a>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div className="chapter-marker">01</div>
              <div style={{ marginBottom: 28 }}>
                <div className="status-badge" style={{ color: '#a78bfa', border: '1px solid rgba(167,139,250,0.15)', background: 'rgba(167,139,250,0.04)' }}>
                  <span className="status-badge__dot" />
                  CAPSTONE PROJECT — CODETRADE INTERNSHIP
                </div>
              </div>
              <div className="grid grid-cols-2 md:flex md:flex-col gap-x-4 gap-y-8 md:gap-y-5">
                <div className="stat-counter">
                  <div className="stat-counter__value">12</div>
                  <div className="stat-counter__label">CLASSIFIED DOCS</div>
                </div>
                <div className="stat-counter">
                  <div className="stat-counter__value">100%</div>
                  <div className="stat-counter__label">FACTUAL ACCURACY</div>
                </div>
                <div className="stat-counter">
                  <div className="stat-counter__value">0</div>
                  <div className="stat-counter__label">PUBLIC DATA LEAKS</div>
                </div>
                <div className="stat-counter">
                  <div className="stat-counter__value">k=4</div>
                  <div className="stat-counter__label">CONTEXT CHUNKS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CHAPTER 02 — INTERACTIVE CHAT ═══ */}
      <section className="chapter-section" id="chat-demo">
        <div className="section-container">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            02 // Interactive Demo
          </div>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: isMobile ? 28 : 36, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
            AuraHealth AI Console
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: isMobile ? 15 : 16, color: 'var(--text-muted)', marginBottom: 28, maxWidth: 580 }}>
            Type any query — the system simulates real RAG behavior: semantic retrieval, sliding memory, input sanitization and rate limits exactly as the production system enforces them.
          </p>

          {/* System Limits HUD */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
            {[
              {
                icon: <Brain size={16} />,
                label: 'Memory Window',
                value: `${Math.min(Math.ceil(chatMessages.length / 2), CONTEXT_WINDOW)} / ${CONTEXT_WINDOW} turns`,
                color: Math.ceil(chatMessages.length / 2) >= CONTEXT_WINDOW ? '#f472b6' : 'var(--accent-cyan)',
                note: 'MAX_HISTORY_TURNS = 5',
              },
              {
                icon: <Database size={16} />,
                label: 'Chunk Retrieval',
                value: 'k = 4 chunks',
                color: 'var(--accent-blue)',
                note: 'Cosine similarity',
              },
              {
                icon: <Terminal size={16} />,
                label: 'Input Length',
                value: `${userInput.length} / ${MAX_INPUT_LENGTH}`,
                color: userInput.length > 450 ? '#f59e0b' : 'var(--accent-cyan)',
                note: 'MAX_INPUT_LENGTH = 500',
              },
              {
                icon: <Cpu size={16} />,
                label: 'Rate Limit',
                value: `${queryCount} / ${RATE_LIMIT} queries`,
                color: queryCount >= RATE_LIMIT ? '#f472b6' : '#4ade80',
                note: queryCount >= RATE_LIMIT ? 'Quota exhausted' : 'Groq API quota sim',
              },
            ].map((item, i) => (
              <div key={i} className="glass-panel" style={{ padding: '16px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: `color-mix(in srgb, ${item.color} 14%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${item.color} 22%, transparent)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color,
                }}>{item.icon}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: isMobile ? 14 : 15, fontWeight: 700, color: item.color }}>{item.value}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)', marginTop: 4, opacity: 0.8 }}>{item.note}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Console */}
          <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>

            {/* Terminal titlebar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: isMobile ? '10px 14px' : '11px 18px',
              borderBottom: '1px solid var(--border-accent)',
              background: 'rgba(0,0,0,0.25)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  {['#f87171', '#fbbf24', '#4ade80'].map((c, i) => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.75 }} />
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: isMobile ? 9 : 11, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                  <Lock size={9} />
                  {isMobile ? 'AuraHealth — Secure Console' : 'AuraHealth Nexus — Secure Internal Console [RAG v2.1]'}
                </div>
              </div>
              <button onClick={resetChat} style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
                background: 'none', border: '1px solid var(--border)', borderRadius: 6,
                padding: '4px 10px', cursor: 'pointer', transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-cyan)'; e.currentTarget.style.color = 'var(--accent-cyan)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <RefreshCw size={10} /> Reset
              </button>
            </div>

            {/* Messages */}
            <div
              ref={chatContainerRef}
              style={{ minHeight: 240, maxHeight: isMobile ? 360 : 440, overflowY: 'auto', padding: isMobile ? '16px 14px' : '20px 22px 12px' }}
            >
              {chatMessages.length === 0 && !isThinking && (
                <div style={{ textAlign: 'center', padding: '36px 20px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  <Shield size={30} style={{ margin: '0 auto 14px', opacity: 0.25, display: 'block', color: 'var(--accent-cyan)' }} />
                  <div style={{ fontSize: 13, marginBottom: 6, color: 'var(--text-secondary)' }}>Awaiting authorized query...</div>
                  <div style={{ fontSize: 11, opacity: 0.5 }}>Type below or pick a suggestion to query the classified database</div>
                </div>
              )}

              {chatMessages.map((msg, i) => (
                <div key={i} style={{ marginBottom: 18 }}>
                  {msg.role === 'user' ? (
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                      <div style={{
                        maxWidth: isMobile ? '88%' : '72%',
                        background: 'color-mix(in srgb, var(--accent-cyan) 10%, transparent)',
                        border: '1px solid color-mix(in srgb, var(--accent-cyan) 20%, transparent)',
                        borderRadius: '12px 12px 4px 12px',
                        padding: isMobile ? '10px 13px' : '12px 16px',
                        fontFamily: 'var(--font-sans)', fontSize: isMobile ? 13 : 14,
                        color: 'var(--text-primary)', lineHeight: 1.6,
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: isMobile ? 8 : 10, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 30, height: 30, flexShrink: 0, borderRadius: 8,
                        background: 'color-mix(in srgb, var(--accent-blue) 14%, transparent)',
                        border: '1px solid color-mix(in srgb, var(--accent-blue) 22%, transparent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)',
                      }}><Brain size={14} /></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-blue)', letterSpacing: '0.08em', marginBottom: 5, textTransform: 'uppercase' }}>AuraHealth AI</div>
                        <div style={{
                          background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-accent)',
                          borderRadius: '4px 12px 12px 12px',
                          padding: isMobile ? '10px 13px' : '13px 17px',
                          fontFamily: 'var(--font-sans)', fontSize: isMobile ? 13 : 14,
                          color: 'var(--text-primary)', lineHeight: 1.7,
                        }}>
                          {msg.content}
                        </div>
                        {msg.chunks && (
                          <button onClick={() => setShowChunks(showChunks === msg.id ? null : msg.id)} style={{
                            display: 'flex', alignItems: 'center', gap: 4, marginTop: 7,
                            fontFamily: 'var(--font-mono)', fontSize: 10,
                            color: showChunks === msg.id ? 'var(--accent-cyan)' : 'var(--text-muted)',
                            background: 'none', border: 'none', cursor: 'pointer',
                            transition: 'color 0.2s ease', padding: 0,
                          }}>
                            <Database size={10} />
                            {showChunks === msg.id ? 'Hide' : 'View'} retrieved chunks (k={msg.chunks.length})
                            <ChevronRight size={10} style={{ transform: showChunks === msg.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }} />
                          </button>
                        )}
                        {showChunks === msg.id && msg.chunks && (
                          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
                            {msg.chunks.map((chunk, ci) => (
                              <div key={ci} style={{
                                background: 'rgba(0,0,0,0.35)',
                                border: '1px solid color-mix(in srgb, var(--accent-blue) 18%, transparent)',
                                borderLeft: '3px solid var(--accent-blue)', borderRadius: '0 6px 6px 0',
                                padding: '8px 12px',
                                fontFamily: 'var(--font-mono)', fontSize: isMobile ? 9 : 11,
                                color: 'var(--text-muted)', lineHeight: 1.65,
                              }}>
                                <span style={{ color: 'var(--accent-blue)', opacity: 0.8 }}>chunk_{ci + 1}: </span>{chunk}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isThinking && (
                <div style={{ display: 'flex', gap: isMobile ? 8 : 10, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 30, height: 30, flexShrink: 0, borderRadius: 8,
                    background: 'color-mix(in srgb, var(--accent-blue) 14%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--accent-blue) 22%, transparent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)',
                  }}><Brain size={14} /></div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-blue)', letterSpacing: '0.08em', marginBottom: 5, textTransform: 'uppercase' }}>AuraHealth AI</div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-accent)',
                      borderRadius: '4px 12px 12px 12px', padding: '11px 16px',
                      fontFamily: 'var(--font-mono)', fontSize: isMobile ? 10 : 11, color: 'var(--text-muted)',
                    }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {[0, 1, 2].map(j => (
                          <div key={j} style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: 'var(--accent-blue)',
                            animation: 'ragpulse 1.2s ease-in-out infinite',
                            animationDelay: `${j * 0.22}s`,
                          }} />
                        ))}
                      </div>
                      Searching classified database (k=4)...
                    </div>
                  </div>
                </div>
              )}

              {rateLimited && (
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  background: 'color-mix(in srgb, #ef4444 8%, transparent)',
                  border: '1px solid color-mix(in srgb, #ef4444 30%, transparent)',
                  borderRadius: 10, padding: '13px 16px', marginTop: 8,
                  fontFamily: 'var(--font-mono)', fontSize: isMobile ? 10 : 11, color: '#ef4444', lineHeight: 1.5,
                }}>
                  <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>
                    Rate limit reached ({RATE_LIMIT}/{RATE_LIMIT} queries).&nbsp;
                    <span style={{ opacity: 0.7 }}>Simulates Groq API quota exhaustion — a hard production constraint.</span>&nbsp;
                    <button onClick={resetChat} style={{ color: '#ef4444', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 'inherit', textDecoration: 'underline' }}>Reset to continue.</button>
                  </span>
                </div>
              )}
            </div>

            {/* Input area */}
            <div style={{ borderTop: '1px solid var(--border-accent)', padding: isMobile ? '12px 14px' : '14px 18px', background: 'rgba(0,0,0,0.12)' }}>

              {/* Suggestion chips */}
              {chatMessages.length === 0 && !rateLimited && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12, opacity: 0.7 }}>
                    Suggested queries:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {SUGGESTIONS.map((s, i) => (
                      <button key={i} onClick={() => sendQuery(s.query)}
                        disabled={isThinking || rateLimited}
                        style={{
                          fontFamily: 'var(--font-mono)', fontSize: isMobile ? 11 : 12, fontWeight: 600,
                          padding: '6px 14px', borderRadius: 20,
                          border: '1px solid var(--border-accent)',
                          background: 'color-mix(in srgb, var(--accent-cyan) 5%, transparent)',
                          color: 'var(--accent-cyan)', cursor: 'pointer',
                          transition: 'all 0.18s ease', letterSpacing: '0.04em',
                          opacity: isThinking ? 0.4 : 1,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'color-mix(in srgb, var(--accent-cyan) 14%, transparent)'; e.currentTarget.style.borderColor = 'var(--accent-cyan)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'color-mix(in srgb, var(--accent-cyan) 5%, transparent)'; e.currentTarget.style.borderColor = 'var(--border-accent)'; }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Text input */}
              <div style={{
                display: 'flex', alignItems: 'flex-end', gap: 10,
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${rateLimited ? 'color-mix(in srgb, #f472b6 30%, transparent)' : userInput.length > 450 ? 'color-mix(in srgb, #f59e0b 40%, transparent)' : 'var(--border-accent)'}`,
                borderRadius: 10, padding: '10px 12px',
                transition: 'border-color 0.2s ease',
              }}>
                <Terminal size={14} style={{ color: 'var(--text-muted)', flexShrink: 0, marginBottom: 2 }} />
                <textarea
                  ref={inputRef}
                  value={userInput}
                  onChange={e => setUserInput(e.target.value.slice(0, MAX_INPUT_LENGTH))}
                  onKeyDown={handleKeyDown}
                  disabled={isThinking || rateLimited}
                  placeholder={rateLimited ? '// Rate limit reached — reset to continue' : 'Ask anything about AuraHealth classified records...'}
                  rows={1}
                  style={{
                    flex: 1, background: 'none', border: 'none', outline: 'none', resize: 'none',
                    fontFamily: 'var(--font-mono)', fontSize: isMobile ? 12 : 13,
                    color: rateLimited ? '#f472b6' : 'var(--text-primary)',
                    lineHeight: 1.5, minHeight: 22, maxHeight: 80, overflowY: 'auto',
                    caretColor: 'var(--accent-cyan)',
                  }}
                  onInput={e => {
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px';
                  }}
                />
                <button onClick={() => sendQuery()}
                  disabled={isThinking || rateLimited || !userInput.trim()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
                    background: isThinking || rateLimited || !userInput.trim()
                      ? 'rgba(255,255,255,0.04)'
                      : 'color-mix(in srgb, var(--accent-cyan) 14%, transparent)',
                    border: `1px solid ${isThinking || rateLimited || !userInput.trim() ? 'var(--border)' : 'var(--border-accent)'}`,
                    borderRadius: 8, padding: isMobile ? '7px 10px' : '8px 14px',
                    fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                    color: isThinking || rateLimited || !userInput.trim() ? 'var(--text-muted)' : 'var(--accent-cyan)',
                    cursor: isThinking || rateLimited || !userInput.trim() ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease', textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}
                >
                  <Send size={12} />{isMobile ? '' : ' Send'}
                </button>
              </div>

              <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', opacity: 0.55, letterSpacing: '0.04em' }}>
                  Enter to send · Shift+Enter for newline · Sliding memory: last {CONTEXT_WINDOW} turns
                </span>
                {chatMessages.length >= CONTEXT_WINDOW * 2 && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#f472b6' }}>
                    Context window full — oldest turns evicted
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CHAPTER 03 — KEY FINDINGS ═══ */}
      <section className="chapter-section" id="findings">
        <div className="section-container">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            03 // Key Findings
          </div>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: isMobile ? 28 : 36, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 40 }}>
            What This System Proved
          </h2>

          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            {insights.map((ins, i) => (
              <button key={i} onClick={() => setActiveInsight(i)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: isMobile ? '8px 12px' : '10px 20px', borderRadius: 8,
                fontFamily: 'var(--font-mono)', fontSize: isMobile ? 10 : 12, fontWeight: 600,
                letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
                border: activeInsight === i ? `1px solid ${ins.color}` : '1px solid var(--border)',
                background: activeInsight === i ? `color-mix(in srgb, ${ins.color} 12%, transparent)` : 'transparent',
                color: activeInsight === i ? ins.color : 'var(--text-muted)',
                transition: 'all 0.2s ease',
              }}>
                {ins.label}
              </button>
            ))}
          </div>

          <div className="glass-panel" style={{ padding: isMobile ? '24px 20px' : '40px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 20 : 48, alignItems: isMobile ? 'flex-start' : 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: isMobile ? 'left' : 'center', minWidth: isMobile ? 'unset' : 140 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: isMobile ? 48 : 64, fontWeight: 900, color: insights[activeInsight].color, lineHeight: 1 }}>
                {insights[activeInsight].stat}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em', marginTop: 8, textTransform: 'uppercase' }}>
                {insights[activeInsight].statLabel}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: isMobile ? 'unset' : 260 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: isMobile ? 16 : 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
                {insights[activeInsight].label}
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: isMobile ? 14 : 16, lineHeight: 1.75, color: 'var(--text-secondary)' }}>
                {insights[activeInsight].desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CHAPTER 04 — PIPELINE ═══ */}
      <section className="chapter-section" id="pipeline">
        <div className="section-container">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            04 // Architecture
          </div>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: isMobile ? 28 : 36, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>
            The RAG Pipeline
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: isMobile ? 15 : 16, color: 'var(--text-muted)', marginBottom: 48, maxWidth: 560 }}>
            Two distinct phases: an offline ingestion phase that builds the vector database once, and a real-time retrieval-generation phase that answers every query.
          </p>

          <PipelineSection nodes={phase1Nodes} phase="Phase 1 — Ingestion and Vectorization" color="var(--accent-cyan)" />
          <PipelineSection nodes={phase2Nodes} phase="Phase 2 — Retrieval and Generation" color="var(--accent-blue)" />
        </div>
      </section>

      {/* ═══ CHAPTER 05 — TECH STACK ═══ */}
      <section className="chapter-section" id="stack">
        <div className="section-container">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            05 // Stack
          </div>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: isMobile ? 28 : 36, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 40 }}>
            Built With
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {techStack.map(item => (
              <div className="tech-card" key={item.name}>
                <div className="tech-card__name">{item.name}</div>
                <div className="tech-card__role">{item.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CHAPTER 06 — NAVIGATION ═══ */}
      <section className="chapter-section">
        <div className="section-container">
          <nav className="project-nav">
            <Link to="/projects" className="project-nav__link" id="nav-back-rag">
              <ArrowLeft size={16} /> Back to Projects
            </Link>
            <a href="https://github.com/harrsh-here/aiml-crash-harrsh" target="_blank" rel="noopener noreferrer" className="project-nav__link" id="nav-source-rag">
              <ExternalLink size={16} /> View on GitHub <ExternalLink size={12} />
            </a>
            <Link to="/projects/california-housing" className="project-nav__link" id="nav-next-rag">
              Next Project <ArrowRight size={16} />
            </Link>
          </nav>
        </div>
      </section>

      <style>{`
        @keyframes ragpulse {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1); }
        }
        .rag-textarea::placeholder { color: var(--text-muted); opacity: 0.5; }
      `}</style>
    </div>
  );
}
