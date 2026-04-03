'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Film, Video, Camera, Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const prevIndexRef = useRef<number>(0);

  // All available images from the media folder - 4x7 grid (28 images)
  const images = [
    {
      src: "/media/adarkorchestra_28188_Extreme_wide_shot_-_Corporate_towers_pie_62eb6736-33d3-464a-8e15-8ad85947a3a8_1 - Copy.png",
      alt: "Corporate towers extreme wide shot",
      category: "Sci-Fi"
    },
    {
      src: "/media/adarkorchestra_28188_Woman_with_severe_black_bob_haircut_walk_20ed3f18-0855-4f12-a894-b5cb123719af_3.png",
      alt: "Woman with severe black bob haircut",
      category: "Character Design"
    },
    {
      src: "/media/qycMi7fP4ZNojb7KVHI3E_b1fc47334fa643638dbecb9ee73fdc63.jpg",
      alt: "AI Generated Artwork",
      category: "AI Art"
    },
    {
      src: "/media/u3538638467_Close-up_of_synthetic_skin_application_micro-deta_02ba45bb-e638-4c70-a73f-09df0c24257e_0.png",
      alt: "Close-up of synthetic skin application",
      category: "Visual Effects"
    },
    {
      src: "/media/u3538638467_extreme_close_up_of_the_members_DC_comics_the_SUI_7b25d127-c97a-413e-b818-b973d6986be0_2.png",
      alt: "Extreme close-up of DC comics characters",
      category: "Character Design"
    },
    {
      src: "/media/u3538638467_httpss.mj.runSoO7WIhXebc_Massive_quantum_processi_3ccafacd-38f5-44cd-aa8b-be6c548bb071_0.png",
      alt: "Massive quantum processing visualization",
      category: "Sci-Fi"
    },
    {
      src: "/media/u3538638467_macro_shot_Womans_face_submerged_in_water_water_s_06064e9a-3e6d-4d72-a737-c3c41fa6d643_0.png",
      alt: "Woman's face submerged in water",
      category: "Cinematic"
    },
    {
      src: "/media/Z5kfD1LH1T6gOsgIxMzGq_dbe6a4c92aeb4d62a1b823a5d4e76f71.jpg",
      alt: "AI Generated Artwork",
      category: "AI Art"
    },
    {
      src: "/media/adarkorchestra_28188_The_interior_of_a_retro-futuristic_space_638ede4d-ca7f-45f3-9dc8-2fd97f905591_0.png",
      alt: "Retro-futuristic space interior",
      category: "Sci-Fi"
    },
    {
      src: "/media/adarkorchestra_28188_httpss.mj.runlTOVOrSvPVY_a_cinematic_sti_8f3e8e58-4eab-44f5-8f41-ea87e9eb12c2_2.png",
      alt: "Cinematic still",
      category: "Cinematic"
    },
    {
      src: "/media/Legend_34.jpg",
      alt: "Legend Artwork",
      category: "AI Art"
    },
    {
      src: "/media/adarkorchestra_28188_NO_RAIN_NO_WET_NO_WATER__Hyperrealistic__75057304-596a-4a17-b688-4082edc4f786_0.png",
      alt: "Hyperrealistic no rain scene",
      category: "Cinematic"
    },
    {
      src: "/media/adarkorchestra_28188_NO_RAIN_NO_WET_NO_WATER__Hyperrealistic__d0ce04c0-aeb4-4c6f-a8c1-db85da0897e8_3.png",
      alt: "Hyperrealistic water scene",
      category: "Cinematic"
    },
    {
      src: "/media/adarkorchestra_28188_a_model_staring_at_camera_on_white_backg_0df7bcc9-4bae-49b5-8f18-74f132d85695_0.png",
      alt: "Model staring at camera",
      category: "Portrait"
    },
    {
      src: "/media/adarkorchestra_28188_A_cinematic_still_of_an_ultra-futuristic_32a0d723-9704-4444-bc0b-a246a17fd886_3.png",
      alt: "Ultra-futuristic cinematic still",
      category: "Sci-Fi"
    },
    {
      src: "/media/adarkorchestra_28188_extreme_close_up_of_a_woman_The_styles_i_f05fe104-b28d-4c26-938e-2d315b0e42ee_0.png",
      alt: "Extreme close-up of a woman",
      category: "Portrait"
    },
    {
      src: "/media/adarkorchestra_28188_afrofuturism_--ar_21_--raw_--profile_a2u_97f8980f-a9d5-44f1-8647-391e4d42ce18_1.png",
      alt: "Afrofuturism profile",
      category: "Sci-Fi"
    },
    {
      src: "/media/adarkorchestra_28188_afrofuturism_--ar_21_--raw_--profile_a2u_57116427-bd11-47cd-839e-304e9e082148_3.png",
      alt: "Afrofuturism profile 2",
      category: "Sci-Fi"
    },
    {
      src: "/media/adarkorchestra_28188_Elena_in_a_battered_RIG_suit_steps_into__e4aca655-159d-407b-86e4-c2ee7e3951c7_1.png",
      alt: "Elena in battered RIG suit",
      category: "Sci-Fi"
    },
    {
      src: "/media/adarkorchestra_28188_httpss.mj.runEvZgJlnRik0_Elena_in_a_batt_6d6240db-9337-4cf8-83ce-c9c492588a86_1.png",
      alt: "Elena in battle suit",
      category: "Sci-Fi"
    },
    {
      src: "/media/Gen4vamp.png",
      alt: "Gen4 Vampire",
      category: "Character Design"
    },
    {
      src: "/media/Gen4 a extreme close up profile shot the group a-2, 4222190213.png",
      alt: "Gen4 extreme close-up profile",
      category: "Character Design"
    },
    {
      src: "/media/Gen4 a close up profile shot the group a-2, 4222190213.png",
      alt: "Gen4 close-up profile",
      category: "Character Design"
    },
    {
      src: "/media/adarkorchestra_28188_A_fanatical_cultist_with_wild_eyes_glowi_670cf795-62a5-45e4-97d2-e84a00d73a03_3 (1).png",
      alt: "Fanatical cultist with wild eyes",
      category: "Character Design"
    },
    {
      src: "/media/adarkorchestra_28188_A_fanatical_cultist_with_wild_eyes_glowi_16ca7b57-9099-4b51-8475-2680ecabe280_3.png",
      alt: "Fanatical cultist with glowing eyes",
      category: "Character Design"
    },
    {
      src: "/media/adarkorchestra_28188_the_evil_man_in_the_cowboy_hat_sees_ryan_f4e19930-38e6-48e3-9f29-338d3f5722df_1.png",
      alt: "Evil man in cowboy hat",
      category: "Character Design"
    },
    {
      src: "/media/adarkorchestra_28188_httpss.mj.runIYcEYo3uKuw_the_evil_man_pu_d4849402-3786-49a6-83c0-fe4022aab94c_1.png",
      alt: "Evil man pushing",
      category: "Character Design"
    },
    {
      src: "/media/adarkorchestra_28188_httpss.mj.runm6oG5OKiR7I_the_evil_man_pu_ddada7a8-9858-4b0d-b36e-501be18d702e_3.png",
      alt: "Evil man pushing 2",
      category: "Character Design"
    },
    {
      src: "/media/adarkorchestra_28188_the_sherrif_wih_a_totaly_surprised_expre_f4473883-9d81-45a9-b44c-5544d1c39f93_0.png",
      alt: "Sheriff with surprised expression",
      category: "Character Design"
    }
  ];

  // YouTube video gallery data — full A Dark Orchestra catalog
  const videos = [
    // ── A Dark Orchestra catalog ──
    { youtubeId: "tsQ1Stusfcc", title: "People Speakin", category: "AI Film" },
    { youtubeId: "9MJO6GuT5b0", title: "WUrd", category: "AI Film" },
    { youtubeId: "HgtDZbiS1aM", title: "Glory", category: "AI Film" },
    { youtubeId: "2pLbNZBnOXU", title: "pHArma", category: "AI Film" },
    { youtubeId: "1mPGmDVPgXY", title: "like it was", category: "AI Film" },
    { youtubeId: "qGJ5q4JncTg", title: "T H E  S P R A W L  S2 pt2 + pt3", category: "AI Film" },
    { youtubeId: "qmmGS7xbefo", title: "A DArk ANThoLogy", category: "AI Film" },
    { youtubeId: "ddjMtqDMcL4", title: "krem də lə ˈkrem", category: "AI Film" },
    { youtubeId: "boG0HRXlmrw", title: "boat", category: "AI Film" },
    { youtubeId: "HoWyrFbpQmc", title: "Sleepwalkerz", category: "AI Film" },
    { youtubeId: "SWslJcws7MY", title: "SWitch", category: "AI Film" },
    { youtubeId: "QbD8e8h7KU8", title: "Dreamin Big", category: "AI Film" },
    { youtubeId: "V5EUTsyIPFw", title: "OTD", category: "AI Film" },
    { youtubeId: "db8-XM4IfI0", title: "Liquid", category: "AI Film" },
    { youtubeId: "q-MAtVddHDs", title: "Criminal", category: "AI Film" },
    { youtubeId: "GI_oVVu_Nhk", title: "Fingerwaves", category: "AI Film" },
    { youtubeId: "vA9E202p2Bc", title: "N W O (NEW WORLD OVER)", category: "AI Film" },
    { youtubeId: "PAfe79u8T3U", title: "Kremlin (Return to The Wiz)", category: "AI Film" },
    // ── Music Videos ──
    { youtubeId: "0FdlEEQA_pw", title: "Swat Day", category: "Music Video" },
    { youtubeId: "18GWo28sMUI", title: "Cruel Favor", category: "Music Video" },
    { youtubeId: "2FJ90SfcVdc", title: "COMPOSITION", category: "Music Video" },
    { youtubeId: "3-vaVf3vLCA", title: "No Road", category: "Music Video" },
    { youtubeId: "6Bh2kbZC3Ew", title: "Dirty VICE", category: "Music Video" },
    { youtubeId: "6FTP_rzBPG4", title: "Garden", category: "Music Video" },
    { youtubeId: "6nS2s2b5Ezs", title: "No one Knows", category: "Music Video" },
    { youtubeId: "7vMxQ6NBkvw", title: "WIN MYNAMESHOW", category: "Music Video" },
    { youtubeId: "B7G2O7sSOOo", title: "Tiime", category: "Music Video" },
    { youtubeId: "C1vNqCDizrU", title: "Swimmin", category: "Music Video" },
    { youtubeId: "EEs48_AKRR4", title: "M A X E D  O U T", category: "Music Video" },
    { youtubeId: "EKADSUlGK2Y", title: "No stress Flexx", category: "Music Video" },
    { youtubeId: "EheweLIpGNE", title: "Collision", category: "Music Video" },
    { youtubeId: "EnOo_Q3-M7Y", title: "Casual (Purple Rain)", category: "Music Video" },
    { youtubeId: "F9rYinLSJ44", title: "Cupid sucks", category: "Music Video" },
    { youtubeId: "GNsfm-MrXbo", title: "Bagz N Rackz", category: "Music Video" },
    { youtubeId: "I0B8-V1_GyI", title: "Smalltown", category: "Music Video" },
    { youtubeId: "I0nFXJ61x28", title: "It Bends the Void", category: "Music Video" },
    { youtubeId: "IwSolzt0eIY", title: "Smoke", category: "Music Video" },
    { youtubeId: "MYJnqREjLKw", title: "Demons ans Angels", category: "Music Video" },
    { youtubeId: "NoqTLz9_MTE", title: "Dead Meat", category: "Music Video" },
    { youtubeId: "ODMhESU4r3U", title: "Slop", category: "Music Video" },
    { youtubeId: "Ok9CjuUvIT4", title: "France", category: "Music Video" },
    { youtubeId: "PRDWXpmEzWQ", title: "LEGEND", category: "Music Video" },
    { youtubeId: "RmOyLGVzfl0", title: "WET", category: "Music Video" },
    { youtubeId: "TjgzQ45veZM", title: "Sirens", category: "Music Video" },
    { youtubeId: "Tp5uHDfYR-Y", title: "Separation", category: "Music Video" },
    { youtubeId: "UHk3XyG5fGI", title: "Fever Dream", category: "Music Video" },
    { youtubeId: "UghbHwRiWEY", title: "Fade", category: "Music Video" },
    { youtubeId: "VPVMztPQGeM", title: "Twisted", category: "Music Video" },
    { youtubeId: "VpCMxguQ0ko", title: "Lemon Drop Dream", category: "Music Video" },
    { youtubeId: "W1ZIo7P3nNo", title: "The Algo (King Of Pop)", category: "Music Video" },
    { youtubeId: "Y2iH0xhLz-k", title: "The Shallow", category: "Music Video" },
    { youtubeId: "Z-nAnS588Mw", title: "The Art of the Hustle ft. Equipto", category: "Music Video" },
    { youtubeId: "ZIpUfcYDGdE", title: "Jimmy", category: "Music Video" },
    { youtubeId: "a-z8ArznQIk", title: "Frsh", category: "Music Video" },
    { youtubeId: "d7LVTG79spU", title: "Triumph", category: "Music Video" },
    { youtubeId: "dOCrzAoyfSM", title: "uNALIvE", category: "Music Video" },
    { youtubeId: "djp0bFZq6xE", title: "Heavy", category: "Music Video" },
    { youtubeId: "eSsEm24fdmg", title: "The Low End", category: "Music Video" },
    { youtubeId: "eTNc1xTC30Q", title: "Parallel", category: "Music Video" },
    { youtubeId: "f59jZldwh7o", title: "Mirage", category: "Music Video" },
    { youtubeId: "fh7-6cZ4ZQk", title: "City of ghost", category: "Music Video" },
    { youtubeId: "hFJU0b52dLs", title: "A Dark Orchestra", category: "Music Video" },
    { youtubeId: "iZa2GJQNkOo", title: "Icey Heart", category: "Music Video" },
    { youtubeId: "k81jUGX-Kuc", title: "Schemes", category: "Music Video" },
    { youtubeId: "mENq1C-KIOQ", title: "Dread", category: "Music Video" },
    { youtubeId: "mmsmUbx33Sc", title: "Chemical", category: "Music Video" },
    { youtubeId: "o_vwKYmyQco", title: "Shawty Lo", category: "Music Video" },
    { youtubeId: "oonEKJrtN5Y", title: "THEM", category: "Music Video" },
    { youtubeId: "pHMEaVJIehY", title: "Align", category: "Music Video" },
    { youtubeId: "rFMat_rLbfs", title: "Suicide Hearts", category: "Music Video" },
    { youtubeId: "rwcvojmw1oM", title: "Entropy", category: "Music Video" },
    { youtubeId: "rzwrUH_SEio", title: "Over & Over", category: "Music Video" },
    { youtubeId: "su0fTDIH2Ss", title: "LeftRight", category: "Music Video" },
    { youtubeId: "t4CHU8S5gjM", title: "Jellybeans", category: "Music Video" },
    { youtubeId: "uV1F-LLWHZU", title: "Murderbot", category: "Music Video" },
    { youtubeId: "vEM71Apij0Q", title: "2 Die 4", category: "Music Video" },
    { youtubeId: "w9jz8r8_eG8", title: "Twilight", category: "Music Video" },
    { youtubeId: "yLur3j2spNE", title: "No Sleep hustle (KANYE-I)", category: "Music Video" },
    { youtubeId: "yYXXB73BQc8", title: "iNFINITEHUSTLE", category: "Music Video" },
    { youtubeId: "yyT6SXtHzi4", title: "Pressure", category: "Music Video" },
    // ── Short Films ──
    { youtubeId: "FmqRZQwQV84", title: "Aliens THE WOMAN IN THE DARK", category: "Short Film" },
    { youtubeId: "MBY4pEk1gk8", title: "DEAD SPACE LOST", category: "Short Film" },
  ];

  // Handle keyboard navigation
  // Fade-slideshow auto-advance — 2 s crossfade, 8 s hold
  useEffect(() => {
    const FADE_MS = 2000;
    const HOLD_MS = 8000;

    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setSlideshowIndex((prev) => {
          prevIndexRef.current = prev;
          return (prev + 1) % images.length;
        });
        setFadeIn(true);
      }, FADE_MS);
    }, HOLD_MS + FADE_MS);

    return () => clearInterval(interval);
  }, [images.length]);

  const jumpTo = (i: number) => {
    setFadeIn(false);
    setTimeout(() => {
      prevIndexRef.current = slideshowIndex;
      setSlideshowIndex(i);
      setFadeIn(true);
    }, 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      
      switch (e.key) {
        case 'Escape':
          closeFullscreen();
          break;
        case 'ArrowLeft':
          navigateImage(-1);
          break;
        case 'ArrowRight':
          navigateImage(1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, selectedImage]);

  const openFullscreen = (index: number) => {
    setSelectedImage(index);
    setIsFullscreen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction: number) => {
    if (selectedImage === null) return;
    
    const newIndex = selectedImage + direction;
    if (newIndex >= 0 && newIndex < images.length) {
      setSelectedImage(newIndex);
    } else if (newIndex < 0) {
      setSelectedImage(images.length - 1);
    } else {
      setSelectedImage(0);
    }
  };

  return (
    <PageLayout>
      {/* ── Full-page crossfade slideshow background ── */}
      <div className="fixed inset-0 -z-10">
        {/* Previous image — always underneath so there's no black gap during fade */}
        <Image
          src={images[prevIndexRef.current].src}
          alt={images[prevIndexRef.current].alt}
          fill
          priority
          className="object-cover object-center"
          style={{ opacity: 1 }}
        />
        {/* Current image — fades in/out on top */}
        <Image
          key={slideshowIndex}
          src={images[slideshowIndex].src}
          alt={images[slideshowIndex].alt}
          fill
          priority
          className="object-cover object-center"
          style={{ opacity: fadeIn ? 1 : 0, transition: 'opacity 2s ease-in-out' }}
        />
        {/* Dark overlay so content stays readable */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Hero Section */}
      <section className="relative h-[40vh] sm:h-[50vh] text-white pt-16 sm:pt-0">
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-8 sm:pb-12">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-2 sm:mb-3" style={{ color: 'oklch(84.1% 0.238 128.85 / 0.7)' }}>A Dark Orchestra Films</p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold mb-3 sm:mb-4 text-white">
            Gallery
          </h1>
          <p className="font-body text-base sm:text-lg max-w-2xl text-white/60">
            AI-generated films, visual artwork, and cinematic production stills
          </p>
        </div>
      </section>

      {/* ── Slideshow indicator bar ── */}
      <section className="pt-6 pb-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* category + counter */}
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-manrope uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ background: 'oklch(84.1% 0.238 128.85 / 0.15)', color: 'oklch(84.1% 0.238 128.85)', border: '1px solid oklch(84.1% 0.238 128.85 / 0.3)' }}
            >
              {images[slideshowIndex].category}
            </span>
            <span className="text-white/40 text-xs font-manrope">{slideshowIndex + 1} / {images.length}</span>
          </div>
          {/* dot indicators */}
          <div className="flex items-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => jumpTo(i)}
                className="rounded-full transition-all duration-500"
                style={{
                  width: i === slideshowIndex ? '20px' : '6px',
                  height: '6px',
                  background: i === slideshowIndex ? 'oklch(84.1% 0.238 128.85)' : 'rgba(255,255,255,0.2)',
                }}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── About — A Dark Orchestra Films ── */}
      <section className="py-28 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

            {/* Left — text */}
            <div>
              <p className="text-xs uppercase tracking-[0.25em] mb-4 font-manrope" style={{ color: 'oklch(84.1% 0.238 128.85 / 0.7)' }}>
                The Media Arm
              </p>
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
                A Dark Orchestra<br />
                <span className="gradient-text">Films</span>
              </h2>
              <p className="font-body text-white/65 text-lg leading-relaxed mb-6">
                Since 2022, A Dark Orchestra Films has been at the forefront of AI-powered cinematic production — blending machine imagination with human craft to create work that feels genuinely unprecedented.
              </p>
              <p className="font-body text-white/50 text-base leading-relaxed mb-10">
                From intimate character studies and music videos to sprawling sci-fi narratives, every frame is a collaboration between director intent and generative intelligence. We treat AI not as a shortcut, but as a co-author — one with its own visual language.
              </p>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { stat: '70+', label: 'Original Productions' },
                  { stat: '5', label: 'Production Categories' },
                  { stat: '2022', label: 'Founded' },
                ].map(({ stat, label }) => (
                  <div key={label}>
                    <p className="font-heading text-3xl font-bold mb-1" style={{ color: 'oklch(84.1% 0.238 128.85)' }}>{stat}</p>
                    <p className="text-white/45 text-xs font-manrope uppercase tracking-wider">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — capability cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Film,     label: 'AI Films',          desc: 'Narrative short films built entirely with generative AI pipelines.' },
                { icon: Video,    label: 'Music Videos',      desc: 'Cinematic music video production from concept to final render.' },
                { icon: Camera,   label: 'Visual Artwork',    desc: 'High-resolution AI photography, concept art, and character design.' },
                { icon: Sparkles, label: 'Motion Graphics',   desc: 'Animated sequences and title design fused with AI aesthetics.' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="glass-effect rounded-xl p-5 flex flex-col gap-3">
                  <Icon className="w-5 h-5" style={{ color: 'oklch(84.1% 0.238 128.85 / 0.8)' }} />
                  <p className="font-manrope font-semibold text-white text-sm">{label}</p>
                  <p className="text-white/45 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Video Gallery Section */}
      <section className="py-24 bg-black/75 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">AI-Generated</span> Films
            </h2>
            <p className="font-body text-xl text-gray-400 max-w-2xl mx-auto">
              Experience our revolutionary AI-powered films and multimedia content that redefines storytelling.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {videos.map((video, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl sm:rounded-2xl card-hover">
                <div className="relative h-52 sm:h-80">
                  <iframe
                    className="w-full h-full rounded-2xl"
                    src={`https://www.youtube.com/embed/${video.youtubeId}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="flex items-center space-x-2 mb-2">
                    <Video className="w-4 h-4" style={{ color: 'oklch(84.1% 0.238 128.85)' }} />
                    <span className="font-body text-sm" style={{ color: 'oklch(84.1% 0.238 128.85 / 0.7)' }}>{video.category}</span>
                  </div>
                  <h3 className="font-heading text-lg font-semibold mb-2">{video.title}</h3>
                  <a
                    href={`https://youtu.be/${video.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 hover:text-white transition-colors duration-300"
                    style={{ color: 'oklch(84.1% 0.238 128.85 / 0.7)' }}
                  >
                    <span>Watch on YouTube</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Create Something Amazing?
            </h2>
            <p className="font-body text-xl text-white/80 mb-8">
              Let's collaborate on your next AI-powered multimedia project. 
              Bring your vision to life with cutting-edge technology.
            </p>
            <Link 
              href="/contact" 
              className="button-primary inline-flex items-center space-x-2"
            >
              <span>Start Your Project</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Fullscreen Image Modal */}
      {isFullscreen && selectedImage !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 z-10 p-2 text-white transition-colors duration-300"
              style={{ '--hover-color': 'oklch(84.1% 0.238 128.85)' } as React.CSSProperties}
              onMouseEnter={e => (e.currentTarget.style.color = 'oklch(84.1% 0.238 128.85)')}
              onMouseLeave={e => (e.currentTarget.style.color = '')}
              aria-label="Close fullscreen"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation Arrows — larger touch targets on mobile */}
            <button
              onClick={() => navigateImage(-1)}
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-10 p-4 sm:p-3 text-white transition-colors duration-300 glass-effect rounded-full"
              onMouseEnter={e => (e.currentTarget.style.color = 'oklch(84.1% 0.238 128.85)')}
              onMouseLeave={e => (e.currentTarget.style.color = '')}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            <button
              onClick={() => navigateImage(1)}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-10 p-4 sm:p-3 text-white transition-colors duration-300 glass-effect rounded-full"
              onMouseEnter={e => (e.currentTarget.style.color = 'oklch(84.1% 0.238 128.85)')}
              onMouseLeave={e => (e.currentTarget.style.color = '')}
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* Image */}
            <div className="relative max-w-7xl max-h-full">
              <Image
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                width={1200}
                height={800}
                className="max-w-full max-h-[90vh] object-contain"
                priority
              />
              
                             {/* Image Info */}
               <div className="absolute bottom-4 left-4 right-4 text-white">
                 <div className="glass-effect rounded-lg p-4">
                   <p className="font-body text-sm text-white/70">
                     {selectedImage + 1} of {images.length}
                   </p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
} 