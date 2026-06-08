"use client";

import { motion } from "framer-motion";
import { timeline } from "@/lib/wedding-data";

export function StoryTimeline() {
  return (
    <section className="section-pad" id="historia">
      <div className="container-premium">
        <div className="mx-auto max-w-3xl text-center">
          <p className="heading-eyebrow">Historia do casal</p>
          <h2 className="serif-title mt-4">Uma linha do tempo feita de escolhas bonitas.</h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-4">
          {timeline.map((item, index) => (
            <motion.article
              className="glass-panel rounded-[2rem] p-6"
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.08 }}
            >
              <span className="font-display text-5xl text-fuchsiaWedding">{item.year}</span>
              <h3 className="mt-5 text-xl font-bold text-rosewood">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-rosewood/70">{item.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
