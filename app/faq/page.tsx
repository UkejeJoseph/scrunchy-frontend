'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    category: 'General',
    items: [
      { question: 'What is Scrunchy?', answer: 'Scrunchy is a decentralized marketplace for game items built on Solana.' },
      { question: 'How does it work?', answer: 'Players can rent or buy game assets, creators can monetize their assets, and developers can integrate assets into their games.' },
    ],
  },
  {
    category: 'Rentals',
    items: [
      { question: 'How do rentals work?', answer: 'You can rent assets for a specified duration and use them in any integrated game during that time.' },
      { question: 'What happens when rental expires?', answer: 'The asset automatically returns to the owner after the rental period ends.' },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-display font-bold mb-8">Frequently Asked Questions</h1>
          
          {faqs.map((category) => (
            <GlassCard key={category.category} className="bg-white border-gray-200 p-8 mb-6">
              <h2 className="text-2xl font-semibold mb-4">{category.category}</h2>
              <Accordion type="single" collapsible>
                {category.items.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </GlassCard>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

