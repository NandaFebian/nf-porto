import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site-metadata';
import { Pending } from '@/components/pending';
import { profile } from '@/content/profile';
import { isPlaceholder } from '@/lib/shared';
import { ContactForm } from './contact-form';

export const metadata: Metadata = pageMetadata('contact');

export default function ContactPage() {
  const channels = [
    { label: 'email', href: `mailto:${profile.email}`, text: profile.email, pending: isPlaceholder(profile.email) },
    {
      label: 'github',
      href: profile.socials.github,
      text: 'GitHub',
      pending: isPlaceholder(profile.socials.github),
    },
    {
      label: 'linkedin',
      href: profile.socials.linkedin,
      text: 'LinkedIn',
      pending: isPlaceholder(profile.socials.linkedin),
    },
  ];

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-12 px-4 pt-10 pb-20 sm:px-6 md:pt-16 lg:grid-cols-[1fr_16rem] lg:gap-16">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Contact</h1>
        <p className="mt-3 mb-8 max-w-prose text-fd-muted-foreground">
          Write about a role, a freelance project, or a question on one of the projects. The message goes straight to my
          inbox.
        </p>
        <ContactForm />
      </div>

      <aside aria-labelledby="elsewhere" className="border-t pt-6 lg:mt-20 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
        <h2 id="elsewhere" className="text-sm font-semibold">
          Elsewhere
        </h2>
        <ul className="mt-3 flex flex-col">
          {channels.map((channel) => (
            <li key={channel.label} className="flex min-h-11 items-center gap-4">
              <span className="w-16 font-mono text-xs text-fd-muted-foreground">{channel.label}</span>
              {channel.pending ? (
                <Pending what={`${channel.label} address`} />
              ) : (
                <a
                  href={channel.href}
                  {...(channel.label !== 'email' && { target: '_blank', rel: 'noreferrer' })}
                  className="text-sm underline underline-offset-4 break-all"
                >
                  {channel.text}
                </a>
              )}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
