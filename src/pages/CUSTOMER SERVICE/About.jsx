import React from 'react'
import { Timeline } from "../../UiComponents/timeline";
import Layout from '../../components/layout/Layout';
import { Helmet } from 'react-helmet';

export default function page() {
  const data = [
    {
      title: "About Us",
      content: (

        <div className="max-w-5xl mx-auto text-left text-lg font-normal  ">
          <p className="">
            <strong>Welcome to SOFT GAME STUDIO</strong> — your go-to platform for everything programming!
          </p>
          <p className="">
            Founded with a deep passion for <strong>education, development, and innovation</strong>, SOFT GAME STUDIO is dedicated to empowering students, developers, and tech enthusiasts by offering a growing collection of high-quality programming resources.
          </p>
          <p className="">
            Whether you're a beginner just starting out or an advanced learner preparing for exams or interviews, we’re here to support your journey.
          </p>
          <div className="text-left mt-6">
            <h3 className="text-2xl font-semibold  mb-2">We specialize in:</h3>
            <ul className="list-disc list-inside  space-y-1">
              <li>📚 Detailed notes on programming languages like C, C++, Python, Java, JavaScript, and more</li>
              <li>💡 Source code for both <strong>short programs</strong> and <strong>long-form projects</strong></li>
              <li>🛠️ Practical projects and mini-apps aligned with real academic syllabi</li>
              <li>🎓 Exam-focused content and concept breakdowns</li>
            </ul>
          </div>
          <p className=" mt-6">
            Our goal is to make programming <strong>simple, structured, and student-friendly</strong>.
          </p>



          <div className="text-left mt-8">
            <h3 className="text-2xl font-semibold  mb-2">What we offer beyond code:</h3>
            <ul className="list-disc list-inside  space-y-1">
              <li>🎮 Interactive programming challenges</li>
              <li>🧑‍🏫 Online seminars and workshops</li>
              <li>📄 Certification-based quizzes</li>
              <li>🔐 Anti-cheating tech for fair exams</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Our Mission",
      content: (
        <div className="max-w-5xl mx-auto text-left">
          <p className="mb-8 text-xs font-normal  md:text-sm ">
            At <strong>SOFT GAME STUDIO</strong>, our mission is rooted in the belief that education should be
            accessible, practical, and inspiring. We understand the challenges students and self-learners face
            when diving into the world of programming — from confusing syntax to overwhelming concepts. That’s
            why we strive to simplify complex ideas and deliver them in a way that feels both logical and exciting.
          </p>
          <p className="mb-8 text-xs font-normal  md:text-sm ">
            Through our curated notes, real-world examples, and hands-on coding projects, we aim to build a
            foundation that not only helps learners pass exams but also prepares them to solve real-world problems.
            Our platform is designed with the student in mind — whether you're preparing for a semester test,
            developing a final year project, or simply curious about how to build your first app.
          </p>
          <p className="mb-8 text-xs font-normal  md:text-sm ">
            In addition to written tutorials, we’re expanding into <strong>interactive video lectures</strong>,
            step-by-step programming challenges, and personalized guidance — all with the goal of keeping the
            learning process engaging and community-driven.
          </p>
          <p className="mb-8 text-xs font-normal  md:text-sm ">
            Our long-term mission is to create a space where learning to code doesn’t feel like a task — it feels
            like a journey worth taking. One where every student, regardless of background, has the tools and
            support to succeed in technology and beyond.
          </p>
        </div>
      ),
    },
    {
      title: "What We Offer",
      content: (

        <div className="max-w-5xl mx-auto text-left">
          <p className="mb-8 text-xs font-normal  md:text-sm  ">
            At <strong>SOFT GAME STUDIO</strong>, we are committed to providing a comprehensive learning experience
            for students, beginners, and developers. Whether you're brushing up on basics or diving into advanced
            topics, we’ve got you covered with a wide range of educational resources designed to make learning
            both effective and enjoyable.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            <div className=" dark:border-white border border-black rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold t mb-2">📘 Programming Language Notes</h3>
              <p className="0">
                Clear and concise notes covering fundamentals and advanced concepts in C, C++, Java, Python, JavaScript, and more.
              </p>
            </div>

            <div className=" dark:border-white border border-black rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold  mb-2">💻 Source Code</h3>
              <p className="">
                Access a wide range of tested short and long programs with complete source code to boost your coding confidence.
              </p>
            </div>

            <div className="  dark:border-white border border-black rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold  mb-2">🛠️ Projects</h3>
              <p className="">
                Build real-world short and long projects ideal for college assignments, portfolios, and self-learning.
              </p>
            </div>

            <div className="dark:border-white border border-black rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold  mb-2">🎥 Video Lectures</h3>
              <p className="">
                Learn by watching! Our video tutorials break down complex topics and walk you through live coding sessions.
              </p>
            </div>

            <div className="dark:border-white border border-black rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold  mb-2">🔗 Examples & Links</h3>
              <p className="">
                Practice through real examples and curated external resources that help deepen your understanding.
              </p>
            </div>

            <div className="dark:border-white border border-black rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold  mb-2">🏆 Competitions & Quizzes</h3>
              <p className="">
                Take part in our online/offline coding competitions and quiz contests to test and prove your skills.
              </p>
            </div>
          </div>
        </div>


      ),
    },
    {
      title: "Our Vision",
      content: (

        <div className="max-w-5xl mx-auto text-left">
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            At <strong>SOFT GAME STUDIO</strong>, we envision a future where learning to code is not a privilege but a basic right.
            We believe that every student, regardless of their background, academic stream, or financial situation, should
            have access to high-quality programming education that empowers them to shape their own digital future.
          </p>

          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            In a world increasingly driven by technology, we recognize the growing gap between theoretical knowledge taught
            in classrooms and the practical skills required in real-world scenarios. Our vision is to close this gap by
            offering a platform that not only teaches but also inspires, guides, and motivates learners to build and innovate.
          </p>

          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            We aim to create a space where budding developers can find everything they need — from beginner-friendly notes,
            source code, and interactive projects, to in-depth video tutorials and real-time support. We want learners to
            move beyond memorizing syntax and start solving meaningful problems, experimenting with ideas, and contributing
            to real-world solutions.
          </p>

          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Our platform isn’t just for coders — it’s for creators, thinkers, and dreamers who want to use code as a tool
            to bring their imagination to life. Whether you're preparing for a university exam, working on a portfolio project,
            or gearing up for your first hackathon, <strong>SOFT GAME STUDIO</strong> will be your trusted companion on that journey.
          </p>

          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            We look ahead to a world where our content helps build the next generation of software engineers, tech entrepreneurs,
            and problem-solvers. Our vision is simple yet powerful — <strong>to democratize coding education</strong>
            and make it so engaging and effective that learners don’t just understand the code — they live it.
          </p>
        </div>

      ),
    },
    {
      title: "Join Us",
      content: (

        <div className="max-w-4xl mx-auto text-left">


          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Whether you're a beginner just starting your programming journey or an experienced developer
            eager to sharpen your skills, <strong>SOFT GAME STUDIO</strong> is here to support you every step of the way.
          </p>

          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Our growing community is built on collaboration, curiosity, and a shared passion for coding.
            We provide all the tools, resources, and guidance you need to explore new technologies, build projects,
            and grow your knowledge — at your own pace, and in your own style.
          </p>

          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Whether you're preparing for university exams, creating your portfolio, joining hackathons,
            or simply experimenting with new ideas, you'll find a place here.
            <strong> Join us today and take the next step in your coding adventure!</strong>
          </p>
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
          content="Learn more about Soft Game Studio, our mission, vision, and the team dedicated to providing the best online exam and gaming experiences."
        />
        <meta
          name="keywords"
          content="About Soft Game Studio, Company Info, Mission, Vision, Team, Online Exams, Gaming Studio"
        />
        <meta name="author" content="Soft Game Studio" />
        <meta name="robots" content="index, follow" />

        <meta property="og:title" content="About Us | Soft Game Studio" />
        <meta
          property="og:description"
          content="Discover Soft Game Studio’s story, values, and team behind our innovative online exam and gaming solutions."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://softgamestudios.web.app/AboutUs" />
        <meta property="og:image" content="https://softgamestudios.web.app/logo-preview.jpg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | Soft Game Studio" />
        <meta
          name="twitter:description"
          content="Meet the team and learn about Soft Game Studio’s commitment to quality online exams and gaming experiences."
        />
        <meta name="twitter:image" content="https://softgamestudios.web.app/logo-preview.jpg" />

        <link rel="canonical" href="https://softgamestudios.web.app/AboutUs" />
      </Helmet>

      <Timeline data={data} />
    </Layout>


  )
}
