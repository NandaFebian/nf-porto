import { profileSchema } from '@/lib/content-schema';

// TODO: replace placeholder values (marked TODO) with real data.
export const profile = profileSchema.parse({
  name: 'Nanda Febian',
  role: 'Backend Developer · IT Support · Data Administration',
  tagline:
    'Information Technology graduate with practical experience in backend development, IT support, and data administration.',
  summary:
    'Information Technology graduate with practical experience in backend development, IT support, and data administration. Developed a NestJS, TypeScript, and MongoDB backend service with JWT authentication, role-based access control, and Swagger documentation as an undergraduate thesis project, and deployed a village website using Laravel. Experienced in hardware and software troubleshooting, operating system installation, network and audiovisual setup, and end-user training. Proficient in Microsoft Excel and Microsoft Word for data management, reporting, and administrative documentation, with leadership experience coordinating 17 committee divisions for a national technology competition.',
  location: 'Denpasar, Bali, Indonesia',
  email: 'nandafbian@gmail.com',
  cv: '/cv/nanda-febian-cv.pdf',
  socials: {
    github: 'https://github.com/NandaFebian',
    linkedin: 'https://www.linkedin.com/in/nandafebian/',
  },
  education: [
    {
      school: 'Universitas Udayana',
      degree: 'Bachelor of Information Technology (GPA 3.72 / 4.00)',
      period: 'Aug 2022 – Aug 2026',
    },
  ],
  // Sections on /about stay hidden while these are empty.
  experience: [
    {
      role: 'Vice Chairperson',
      organization: 'ITCC 2024',
      period: 'Apr 2024 – Nov 2024',
      highlights: [
        'Co-led and coordinated 17 committee divisions over a 7-month preparation period for a national-scale technology competition.',
        'Prepared and maintained the competition’s technical setup, including computers, local network and internet connectivity, and projectors, and resolved technical issues during the event.',
        'Managed event administration, including participant data, schedules, and committee documents.',
      ],
    },
    {
      role: 'Team Member',
      organization: 'PPK Ormawa 2024, Nationally Funded Community Empowerment Program',
      period: 'Jun 2024 – Oct 2024',
      highlights: [
        'Developed and deployed a village website (Laravel) and mobile application (Flutter) to digitize information, public services, and community activities, contributing across backend, frontend, and mobile development.',
        'Set up web hosting and domain, installed devices, and trained village staff to use the new system.',
        'Prepared program documentation, including the proposal, activity reports, and accountability report (LPJ).',
      ],
    },
    {
      role: 'Head of Facilities & Infrastructure',
      organization: 'Maestro FT, Faculty of Engineering Student Journalism Group',
      period: 'Dec 2023 – Jul 2024',
      highlights: [
        'Managed and maintained cameras, laptops, and audio devices, ensuring equipment was ready for activities.',
        'Maintained an Excel-based inventory of the organization’s equipment and managed equipment borrowing records.',
      ],
    },
    {
      role: 'Algorithm Programming Teaching Assistant',
      organization: 'Information Technology, Universitas Udayana',
      period: 'Aug 2023 – Nov 2023',
      highlights: [
        'Assisted students in C programming practicums, including Calculator, Tower of Hanoi, and geometry calculation programs, helping them debug errors and understand algorithm logic.',
        'Explained technical concepts step by step to students with varying levels of experience.',
        'Prepared and checked lab computers and software before each practicum session.',
        'Recorded and recapped student attendance and practicum grades in Microsoft Excel.',
      ],
    },
  ],
  publications: [],
  certifications: [],
});
