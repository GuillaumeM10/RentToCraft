"use client";
import type React from "react";

import Image from "next/image";
import { useState } from "react";

import Landing from "../components/Sections/Landing";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    element: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [element.target.name]: element.target.value });
  };

  const handleSubmit = (element: React.FormEvent<HTMLFormElement>) => {
    element.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="layout-maxed contact-template">
      <Landing
        image="/images/communaute.png"
        title="Contactez-nous"
        description="Une question, une suggestion ou besoin d’aide ? Notre équipe est à votre écoute !"
        centered
      />
      <div className="flex flex-col md:flex-row gap-16 my-32 items-center">
        <div className="flex-1 w-full max-w-lg">
          <h2 className="mb-6 text-2xl font-bold">Formulaire de contact</h2>
          {submitted ? (
            <div className="p-6 bg-green-50 border border-green-200 rounded">
              <p className="text-green-700 font-semibold mb-2">
                Merci pour votre message !
              </p>
              <p>Nous reviendrons vers vous rapidement.</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="form-label">
                  Nom
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input w-full"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input w-full"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="form-input w-full min-h-[120px]"
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-full">
                Envoyer
              </button>
            </form>
          )}
        </div>
        <div className="flex-1 flex flex-col items-center">
          <Image
            src="/images/map-marker.svg"
            alt="Localisation RentToCraft"
            width={120}
            height={120}
            className="mb-6 brightness-0"
          />
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">Adresse</h3>
            <p>123 Avenue des Outils, 75000 Paris</p>
            <h3 className="font-semibold text-lg mt-6 mb-2">Email</h3>
            <p>
              <a href="mailto:contact@renttocraft.fr" className="text-primary">
                contact@renttocraft.fr
              </a>
            </p>
            <h3 className="font-semibold text-lg mt-6 mb-2">Téléphone</h3>
            <p>
              <a href="tel:+33123456789" className="text-primary">
                +33 1 23 45 67 89
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
