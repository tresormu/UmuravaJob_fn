export interface CandidateSignal {
  title: string;
  desc: string;
}

export interface CandidateProfile {
  rank: string;
  slug: string;
  name: string;
  role: string;
  matchScore: number;
  matchCategory: "Elite" | "High";
  location: string;
  experience: string;
  tags: string[];
  analysis: string;
  recommendation: string;
  culturalPulse: number;
  retentionRisk: string;
  strengths: CandidateSignal[];
  gaps: CandidateSignal[];
  shortlistStrengths: string[];
  shortlistGap: string;
  resumeId: string;
  passportId: string;
  email: string;
  phone: string;
  source: string;
  screeningStatus: "Ready" | "In Review" | "Needs follow-up";
  summary: string;
  passportPhoto: {
    initials: string;
    frameClassName: string;
    glowClassName: string;
  };
}

export const screeningCandidates: CandidateProfile[] = [
  {
    rank: "01",
    slug: "elena-rodriguez",
    name: "Elena Rodriguez",
    role: "Senior Software Architect",
    matchScore: 98,
    matchCategory: "Elite",
    location: "Madrid, Spain",
    experience: "12+ Years Exp",
    tags: ["SYSTEM DESIGN", "LEADERSHIP", "GO / RUST"],
    analysis:
      "Elena is a standout candidate with deep expertise in distributed systems and high-concurrency architectures. Her leadership role at her previous SaaS unicorn aligns perfectly with your scaling goals.",
    recommendation: "Strong fit for lead architecture scope and mentoring needs.",
    culturalPulse: 96,
    retentionRisk: "Ultra Low (0.01)",
    strengths: [
      {
        title: "Distributed Systems Design",
        desc: "Expert at building event-driven architectures with high availability.",
      },
      {
        title: "Polyglot Engineering",
        desc: "Native-level proficiency in Go, Rust, and C++ for performance-critical modules.",
      },
      {
        title: "Strategic Roadmap Lead",
        desc: "Led technical strategy for teams of 40+ engineers.",
      },
    ],
    gaps: [
      {
        title: "Legacy Frontend Migration",
        desc: "Less direct experience with older PHP and jQuery based frontends.",
      },
    ],
    shortlistStrengths: ["Distributed systems", "Technical leadership"],
    shortlistGap: "Limited direct frontend depth",
    resumeId: "URS-2026-001",
    passportId: "P-MD-482991",
    email: "elena.rodriguez@example.com",
    phone: "+34 600 113 440",
    source: "Direct application",
    screeningStatus: "Ready",
    summary: "Resume, passport photo, and government ID are fully verified and ready for AI screening.",
    passportPhoto: {
      initials: "ER",
      frameClassName: "bg-primary",
      glowClassName: "shadow-primary/20",
    },
  },
  {
    rank: "02",
    slug: "marcus-thorne",
    name: "Marcus Thorne",
    role: "Principal Engineer",
    matchScore: 95,
    matchCategory: "Elite",
    location: "Berlin, Germany",
    experience: "10+ Years Exp",
    tags: ["K8S / AWS", "SCALABILITY", "TYPESCRIPT"],
    analysis:
      "Marcus brings an impressive DevOps-first mindset to engineering. His background in infrastructure-as-code and cloud-native scaling makes him the ideal choice for a direct, hands-on implementation lead.",
    recommendation: "Reliable option for backend scale and implementation ownership.",
    culturalPulse: 89,
    retentionRisk: "Very Low (0.03)",
    strengths: [
      {
        title: "Cloud-Native Infrastructure",
        desc: "Advanced K8s orchestration and multi-cloud deployment strategies.",
      },
      {
        title: "Performance Optimization",
        desc: "Reduced infrastructure costs by 40% at his last role through better compute scaling.",
      },
    ],
    gaps: [
      {
        title: "Product Management Sync",
        desc: "Prefers technical depth over high-level product design meetings.",
      },
    ],
    shortlistStrengths: ["Cloud infrastructure", "Delivery ownership"],
    shortlistGap: "Less product-facing collaboration",
    resumeId: "URS-2026-002",
    passportId: "P-DE-113804",
    email: "marcus.thorne@example.com",
    phone: "+49 171 440 9002",
    source: "LinkedIn sourcing",
    screeningStatus: "Ready",
    summary: "Resume and passport image are present, with one previous role still waiting on manual reference notes.",
    passportPhoto: {
      initials: "MT",
      frameClassName: "bg-primary",
      glowClassName: "shadow-primary/20",
    },
  },
  {
    rank: "03",
    slug: "sarah-chen",
    name: "Sarah Chen",
    role: "Full Stack Developer",
    matchScore: 89,
    matchCategory: "High",
    location: "San Francisco, USA",
    experience: "6+ Years Exp",
    tags: ["REACT / NODE", "API DEV", "PYTHON"],
    analysis:
      "Sarah is a highly versatile engineer. While her technical match score is slightly lower than the architects, her specific fintech experience aligns perfectly with your Q3 expansion goals.",
    recommendation: "Balanced candidate with strong domain relevance and execution speed.",
    culturalPulse: 94,
    retentionRisk: "Low (0.05)",
    strengths: [
      {
        title: "Fintech API Specialist",
        desc: "Deep knowledge of payment processing pipelines and security compliance.",
      },
      {
        title: "Rapid Prototyping",
        desc: "Excellent at moving from idea to MVP in record time using modern JS stacks.",
      },
    ],
    gaps: [
      {
        title: "Platform Architecture",
        desc: "Strong on features, but has less experience in high-level systemic design.",
      },
    ],
    shortlistStrengths: ["React and Node", "Fintech domain context"],
    shortlistGap: "Less platform architecture breadth",
    resumeId: "URS-2026-003",
    passportId: "P-US-804220",
    email: "sarah.chen@example.com",
    phone: "+1 415 555 0192",
    source: "Referral",
    screeningStatus: "In Review",
    summary: "Resume and identity documents are uploaded; AI can score immediately while the recruiter reviews architecture depth.",
    passportPhoto: {
      initials: "SC",
      frameClassName: "bg-primary",
      glowClassName: "shadow-primary/20",
    },
  },
  {
    rank: "04",
    slug: "david-okello",
    name: "David Okello",
    role: "Backend Platform Engineer",
    matchScore: 84,
    matchCategory: "High",
    location: "Kampala, Uganda",
    experience: "7+ Years Exp",
    tags: ["JAVA / SPRING", "MICROSERVICES", "MENTORSHIP"],
    analysis:
      "David has built reliable internal platforms for high-volume transaction systems and shows strong ownership across API reliability, observability, and team enablement.",
    recommendation: "Solid shortlist backup with dependable backend depth and mentoring capacity.",
    culturalPulse: 90,
    retentionRisk: "Low (0.06)",
    strengths: [
      {
        title: "Service Reliability",
        desc: "Designed resilient internal APIs with incident response ownership and observability dashboards.",
      },
      {
        title: "Mentorship",
        desc: "Regularly coached junior backend engineers and documented platform standards.",
      },
    ],
    gaps: [
      {
        title: "Frontend Breadth",
        desc: "Minimal direct UI delivery history compared with other finalists.",
      },
    ],
    shortlistStrengths: ["Microservices", "Mentorship"],
    shortlistGap: "Limited user-facing interface work",
    resumeId: "URS-2026-004",
    passportId: "P-UG-771255",
    email: "david.okello@example.com",
    phone: "+256 701 440 880",
    source: "Umurava talent pool",
    screeningStatus: "Ready",
    summary: "All documents are complete and the profile is ready to compare against backend-heavy screening prompts.",
    passportPhoto: {
      initials: "DO",
      frameClassName: "bg-primary",
      glowClassName: "shadow-primary/20",
    },
  },
  {
    rank: "05",
    slug: "amina-hassan",
    name: "Amina Hassan",
    role: "Product Designer",
    matchScore: 81,
    matchCategory: "High",
    location: "Nairobi, Kenya",
    experience: "5+ Years Exp",
    tags: ["UX RESEARCH", "FIGMA", "DESIGN SYSTEMS"],
    analysis:
      "Amina offers strong customer research discipline and sharp interface thinking. She is better aligned to design hiring than the engineering opening, but the record is complete for cross-role screening.",
    recommendation: "Best suited for design roles, though still useful for mixed product team pipelines.",
    culturalPulse: 87,
    retentionRisk: "Moderate (0.10)",
    strengths: [
      {
        title: "Research to Interface Flow",
        desc: "Strong track record of converting user insight into clean interface direction.",
      },
      {
        title: "Design System Stewardship",
        desc: "Scaled component libraries across product squads and handed off production-ready specs.",
      },
    ],
    gaps: [
      {
        title: "Engineering Match",
        desc: "Role alignment is weaker for an engineering-first screening queue.",
      },
    ],
    shortlistStrengths: ["UX research", "Design systems"],
    shortlistGap: "Lower match for engineering screening",
    resumeId: "URS-2026-005",
    passportId: "P-KE-660518",
    email: "amina.hassan@example.com",
    phone: "+254 722 550 118",
    source: "Behance outreach",
    screeningStatus: "Needs follow-up",
    summary: "Documents are complete, but the recruiter should retarget the prompt toward design screening before ranking.",
    passportPhoto: {
      initials: "AH",
      frameClassName: "bg-primary",
      glowClassName: "shadow-primary/20",
    },
  },
];

export const shortlistCandidates = screeningCandidates.slice(0, 3);

export const candidatesData = screeningCandidates.reduce<Record<string, CandidateProfile>>(
  (accumulator, candidate) => {
    accumulator[candidate.slug] = candidate;
    return accumulator;
  },
  {},
);
