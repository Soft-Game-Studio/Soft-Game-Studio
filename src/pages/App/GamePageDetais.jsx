import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet";
import { FaWindows, FaAndroid } from "react-icons/fa";
import { gameService } from "./gameService";
import logo from "../../Assictes/23.png";

const DownloadButton = ({ icon, label, sub, link }) => (
  <a
    href={link}
    className="flex items-center gap-4 px-6 py-4 rounded-xl
    bg-neutral-900/80 backdrop-blur border border-neutral-700
    hover:border-purple-500 hover:shadow-glow transition"
  >
    <div className="text-3xl text-purple-500">{icon}</div>
    <div>
      <p className="text-sm text-neutral-400">{sub}</p>
      <p className="text-lg font-semibold text-white">{label}</p>
    </div>
  </a>
);

const GamePage = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    gameService.getGameById(id).then(setGame);
  }, [id]);

  if (!game) return null;

  const {
    gameName,
    description,
    bannerImageUrl,
    windowsExeLink,
    androidApkLink,
    gameFeatures = [],
    developerName,
    windowsRequirements = [],
    androidRequirements = [],
  } = game;

  return (
    <Layout>
      <Helmet>
        <title>{gameName} | Game Studio</title>
      </Helmet>

      <div className="bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-200">

        {/* ============ HERO 16:9 ============ */}
        <section className="relative w-full aspect-[16/9] overflow-hidden">
          <img
            src={bannerImageUrl}
            alt={gameName}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

          {/* content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16 text-white max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-7xl font-extrabold mb-6
              bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-600
              bg-clip-text text-transparent">
              {gameName}
            </h1>

            <p className="max-w-3xl text-lg md:text-xl text-neutral-300">
              {description}
            </p>

            <div className="flex flex-wrap gap-6 mt-10">
              {windowsExeLink && (
                <DownloadButton
                  icon={<FaWindows />}
                  label="Download for Windows"
                  sub="Installer (.exe)"
                  link={windowsExeLink}
                />
              )}
              {androidApkLink && (
                <DownloadButton
                  icon={<FaAndroid />}
                  label="Download for Android"
                  sub="APK file"
                  link={androidApkLink}
                />
              )}
            </div>
          </div>
        </section>

      {/* ============ FEATURES SHOWCASE ============ */}
{gameFeatures.length > 0 && (
  <section className="py-28 px-6 max-w-7xl mx-auto">
    <div className="text-center mb-20">
      <h2 className="text-5xl font-extrabold mb-4">Game Highlights</h2>
      <p className="text-neutral-500 dark:text-neutral-400 text-lg">
        Experience the key elements that make this game truly addictive
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-14">
      {gameFeatures.map((f, i) => (
        <div
          key={i}
          className="group relative rounded-3xl overflow-hidden
          border border-neutral-200 dark:border-neutral-800
          bg-white dark:bg-neutral-900 p-10
          hover:shadow-glow transition"
        >
          <div className="text-5xl text-purple-600 mb-8">
            {f.icon || "🎮"}
          </div>

          <h3 className="text-2xl font-bold mb-4">{f.title}</h3>

          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {f.description}
          </p>

          <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500 rounded-3xl pointer-events-none transition"></div>
        </div>
      ))}
    </div>
  </section>
)}

     {/* ============ STUDIO SECTION ============ */}
<section className="py-32 bg-neutral-100 dark:bg-neutral-900">
  <div className="max-w-6xl mx-auto px-6">

    <div className="grid md:grid-cols-2 gap-16 items-center">

      {/* LEFT: LOGO */}
      <div className="flex justify-center">
        <img
          src={logo}
          alt="SGS Logo"
          className="w-64 md:w-80 object-contain drop-shadow-xl rounded-full border-4 border-neutral-950 dark:border-white"
        />
      </div>

      {/* RIGHT: TEXT CONTENT */}
      <div>
        <h2 className="text-4xl font-extrabold mb-6">
          Developed By Soft Game Studio
        </h2>

        <div className="space-y-3 text-lg">
          <p className="text-neutral-600 dark:text-neutral-400">
            <strong>Professional Game Development Studio</strong>
          </p>

          <p className="text-neutral-600 dark:text-neutral-400">
            Game: <strong>{gameName}</strong>
          </p>

          <p className="text-neutral-600 dark:text-neutral-400">
            Developer: <strong>{developerName}</strong>
          </p>
        </div>

        <p className="mt-8 text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">
          We create immersive gaming experiences with cutting-edge graphics and
          addictive gameplay mechanics. <strong>{gameName}</strong> represents our
          commitment to quality mobile and PC gaming.
        </p>
      </div>

    </div>
  </div>
</section>


        {/* ============ REQUIREMENTS ============ */}
       {/* ============ SYSTEM REQUIREMENTS (PRO) ============ */}
{(windowsRequirements?.length > 1 || androidRequirements?.length > 1) && (
  <section className="py-32 px-6 max-w-7xl mx-auto">
    <div className="text-center mb-20">
      <h2 className="text-5xl font-extrabold mb-4">
        System Requirements
      </h2>
      <p className="text-neutral-500 dark:text-neutral-400 text-lg">
        Ensure your device is ready for the best gaming experience
      </p>
    </div>

    <div className="grid lg:grid-cols-2 gap-16">

      {/* WINDOWS */}
      {windowsRequirements?.length > 0 && (
        <div className="relative rounded-3xl overflow-hidden
          bg-gradient-to-br from-neutral-100 to-white
          dark:from-neutral-900 dark:to-neutral-950
          border border-neutral-200 dark:border-neutral-800
          p-10">

          <div className="flex items-center gap-4 mb-10">
            <div className="p-4 bg-purple-600/10 rounded-xl">
              <FaWindows className="text-3xl text-purple-600" />
            </div>
            <h3 className="text-3xl font-bold">Windows PC</h3>
          </div>

          <div className="space-y-5">
            {windowsRequirements.map((req, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-xl
                bg-white/60 dark:bg-neutral-900/60
                border border-neutral-200 dark:border-neutral-800"
              >
                <div className="w-2 h-2 mt-2 bg-purple-600 rounded-full"></div>
                <p className="text-neutral-700 dark:text-neutral-300">
                  {req}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ANDROID */}
      {androidRequirements?.length > 0 && (
        <div className="relative rounded-3xl overflow-hidden
          bg-gradient-to-br from-neutral-100 to-white
          dark:from-neutral-900 dark:to-neutral-950
          border border-neutral-200 dark:border-neutral-800
          p-10">

          <div className="flex items-center gap-4 mb-10">
            <div className="p-4 bg-purple-600/10 rounded-xl">
              <FaAndroid className="text-3xl text-purple-600" />
            </div>
            <h3 className="text-3xl font-bold">Android Device</h3>
          </div>

          <div className="space-y-5">
            {androidRequirements.map((req, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-xl
                bg-white/60 dark:bg-neutral-900/60
                border border-neutral-200 dark:border-neutral-800"
              >
                <div className="w-2 h-2 mt-2 bg-purple-600 rounded-full"></div>
                <p className="text-neutral-700 dark:text-neutral-300">
                  {req}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  </section>
)}


      </div>
    </Layout>
  );
};

export default GamePage;
