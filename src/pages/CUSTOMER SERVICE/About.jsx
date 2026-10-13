// src/pages/CUSTOMER SERVICE/About.jsx
import React, { useMemo } from 'react';
import { Timeline } from "../../UiComponents/timeline";
import Layout from '../../components/layout/Layout';
import { Helmet } from 'react-helmet';
import {
  BookOpen,
  Code,
  Layers,
  GraduationCap,
  Gamepad2,
  Users,
  FileCheck,
  ShieldCheck,
  Video,
  Award,
  Sparkles,
  Compass,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const structuredData = useMemo(() => {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "AboutPage",
          "@id": "https://softgamestudios.web.app/About-SGS#webpage",
          "url": "https://softgamestudios.web.app/About-SGS",
          "name": "About Soft Game Studio | Mission, Vision, and Education Platform",
          "description": "Learn more about Soft Game Studio, our engineering mission, vision, and team dedicated to providing free, high-quality computer science learning materials.",
          "isPartOf": {
            "@type": "WebSite",
            "@id": "https://softgamestudios.web.app/#website",
            "name": "Soft Game Studio",
            "url": "https://softgamestudios.web.app"
          }
        },
        {
          "@type": "Organization",
          "@id": "https://softgamestudios.web.app/#organization",
          "name": "Soft Game Studio",
          "url": "https://softgamestudios.web.app",
          "logo": "https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media",
          "email": "team.softgamestudio@gmail.com"
        }
      ]
    });
  }, []);

  const data = [
    {
      title: "Who We Are",
      content: (
        <div className="max-w-4xl mx-auto text-left text-sm md:text-base font-normal space-y-4 text-neutral-800 dark:text-neutral-200">
          <p className="text-base md:text-lg font-medium text-neutral-900 dark:text-neutral-100">
            Welcome to Soft Game Studio: your community resource for computer science and software development education.
          </p>
          <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">
            Founded with a focus on practical education, open software development, and student empowerment, Soft Game Studio provides a comprehensive collection of structured programming resources. Whether you are a beginner writing your first lines of code or an advanced candidate preparing for technical interviews, our platform is engineered to support your progress.
          </p>

          <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">
              Core Technical Specializations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <BookOpen className="w-4 h-4 text-[#00ACF0] shrink-0 mt-0.5" />
                <span>Structured notes on C, C++, Python, Java, JavaScript, and systems architecture</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <Code className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Tested source code for both modular exercises and production-ready projects</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <Layers className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>Practical mini-applications aligned with academic degree requirements</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <GraduationCap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Exam-focused conceptual breakdowns and algorithm analysis</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">
              Platform Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <Gamepad2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Interactive programming assessments and challenges</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <Users className="w-4 h-4 text-[#00ACF0] shrink-0 mt-0.5" />
                <span>Community workshops and engineering hackathons</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <FileCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Skill assessments and verifiable online certificates</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>Integrity-tested proctoring technology for fair evaluations</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Our Mission",
      content: (
        <div className="max-w-4xl mx-auto text-left space-y-4 text-xs sm:text-sm md:text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
          <p>
            At Soft Game Studio, our mission is founded on the conviction that technical education should be universally accessible, rigorous, and practical. We understand the hurdles novice programmers face when beginning their journey: ambiguous error messages, fragmented tutorials, and unverified code snippets.
          </p>
          <p>
            Through curated study notes, complete runnable repositories, and structured exercises, we strive to build a solid foundational knowledge base. Our platform is crafted with learners in mind: whether preparing for university examinations, developing a final semester project, or architecting a software service from scratch.
          </p>
          <p>
            We are actively expanding into interactive video lectures, step-by-step programming tasks, and peer code reviews, all designed to maintain an inspiring, community-driven atmosphere.
          </p>
        </div>
      ),
    },
    {
      title: "What We Offer",
      content: (
        <div className="max-w-4xl mx-auto text-left">
          <p className="mb-6 text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            We provide a comprehensive technical curriculum engineered to bridge the gap between classroom theory and industry production environments.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-2 font-semibold text-neutral-900 dark:text-neutral-100 text-sm sm:text-base">
                <BookOpen className="w-4 h-4 text-[#00ACF0]" />
                <span>Language Manuals & Notes</span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Concise documentation covering fundamentals and advanced paradigms across C, C++, Java, Python, and JavaScript.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-2 font-semibold text-neutral-900 dark:text-neutral-100 text-sm sm:text-base">
                <Code className="w-4 h-4 text-emerald-500" />
                <span>Tested Source Repositories</span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Tested short programs and long-form projects complete with build scripts, schemas, and runnable configurations.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-2 font-semibold text-neutral-900 dark:text-neutral-100 text-sm sm:text-base">
                <Layers className="w-4 h-4 text-indigo-500" />
                <span>Real-World Projects</span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Hands-on projects designed for college assignments, portfolio showcases, and engineering interviews.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-2 font-semibold text-neutral-900 dark:text-neutral-100 text-sm sm:text-base">
                <Video className="w-4 h-4 text-amber-500" />
                <span>Technical Video Walkthroughs</span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Video tutorials dissecting complex algorithmic patterns, database queries, and live application debugging.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-2 font-semibold text-neutral-900 dark:text-neutral-100 text-sm sm:text-base">
                <Compass className="w-4 h-4 text-sky-500" />
                <span>Curated Learning Paths</span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Organized roadmaps taking developers from foundational syntax through data structures, algorithms, and full-stack development.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-2 font-semibold text-neutral-900 dark:text-neutral-100 text-sm sm:text-base">
                <Award className="w-4 h-4 text-rose-500" />
                <span>Certification Assessments</span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Skill evaluations, programming contests, and verifiable digital certificates recognizing verified competence.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Our Vision",
      content: (
        <div className="max-w-4xl mx-auto text-left space-y-4 text-xs sm:text-sm md:text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
          <p>
            We envision a technical landscape where quality computer science education is democratized. Every student, regardless of background or financial means, deserves access to clean, professional tools that help them build meaningful technology.
          </p>
          <p>
            We aim to close the gap between theoretical textbook memorization and real-world system architecture, equipping learners with the analytical rigor required to solve hard engineering problems.
          </p>
        </div>
      ),
    },
    {
      title: "Join Our Community",
      content: (
        <div className="max-w-4xl mx-auto text-left space-y-4 text-xs sm:text-sm md:text-base text-neutral-700 dark:text-neutral-300">
          <p className="leading-relaxed">
            Whether you are taking your first steps into programming or refining your domain knowledge, Soft Game Studio welcomes you. Explore our open notes, clone our project repositories, participate in quizzes, and contribute back to open-source software.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/Notes&Books"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 transition-colors shadow-xs"
            >
              <span>Explore Free Notes & Books</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/OurCourse"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <span>View Courses</span>
            </Link>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <Helmet>
        <title>About Us | Soft Game Studio</title>
        <meta
          name="description"
          content="Learn more about Soft Game Studio, our engineering mission, vision, and educational platform dedicated to providing free, high-quality computer science resources."
        />
        <meta
          name="keywords"
          content="About Soft Game Studio, Computer Science Education, Programming Notes, Developer Studio, Free Study Materials, Engineering Platform"
        />
        <meta name="author" content="Soft Game Studio" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://softgamestudios.web.app/About-SGS" />

        <meta property="og:title" content="About Us | Soft Game Studio" />
        <meta
          property="og:description"
          content="Discover Soft Game Studio: our mission to democratize computer science education with structured notes, verified code, and developer tools."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://softgamestudios.web.app/About-SGS" />
        <meta property="og:image" content="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="About Us | Soft Game Studio" />
        <meta
          name="twitter:description"
          content="Discover Soft Game Studio: our mission to democratize computer science education."
        />
        <meta name="twitter:image" content="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media" />

        <script type="application/ld+json">
          {structuredData}
        </script>
      </Helmet>

      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
        <Timeline data={data} />
      </main>
    </Layout>
  );
}
