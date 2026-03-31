import React from 'react';
import Image from 'next/image';
import PageLayout from '@/components/PageLayout';
import ContactForm from '@/components/ContactForm';
import { FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

export default function Contact() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[50vh] bg-black text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/media/u3538638467_httpss.mj.runSoO7WIhXebc_Massive_quantum_processi_3ccafacd-38f5-44cd-aa8b-be6c548bb071_0.png"
            alt="Contact A Dark Orchestra Films"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-0" />
        <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-end pb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-400/70 mb-3">Get In Touch</p>
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-white leading-tight">
            Let&apos;s talk.
          </h1>
          <p className="text-white/50 text-lg mt-3 max-w-xl">
            Drop us a message and we&apos;ll get back to you.
          </p>
        </div>
      </section>

      {/* Form + Social */}
      <section className="bg-black text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16">

            {/* Contact form — takes up 3/5 */}
            <div className="lg:col-span-3">
              <h2 className="font-heading text-2xl font-semibold mb-8 text-white">Send a message</h2>
              <ContactForm />
            </div>

            {/* Sidebar — social links */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              <div>
                <h2 className="font-heading text-2xl font-semibold mb-2 text-white">Find us online</h2>
                <p className="text-white/40 text-sm leading-relaxed">
                  We&apos;re also reachable via social — fastest for quick questions and project previews.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <a
                  href="https://x.com/JusChadneo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:border-amber-400/30 hover:bg-white/5 transition-all group"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full group-hover:bg-amber-400/10 transition-colors">
                    <FaTwitter className="w-5 h-5 text-white/60 group-hover:text-amber-400 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Twitter / X</p>
                    <p className="text-xs text-white/40">@JusChadneo</p>
                  </div>
                </a>

                <a
                  href="https://www.facebook.com/profile.php?id=100093569451356"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:border-amber-400/30 hover:bg-white/5 transition-all group"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full group-hover:bg-amber-400/10 transition-colors">
                    <FaFacebook className="w-5 h-5 text-white/60 group-hover:text-amber-400 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Facebook</p>
                    <p className="text-xs text-white/40">A Dark Orchestra Films</p>
                  </div>
                </a>

                <a
                  href="https://www.instagram.com/a_dark_orchestra/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:border-amber-400/30 hover:bg-white/5 transition-all group"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full group-hover:bg-amber-400/10 transition-colors">
                    <FaInstagram className="w-5 h-5 text-white/60 group-hover:text-amber-400 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Instagram</p>
                    <p className="text-xs text-white/40">@a_dark_orchestra</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}