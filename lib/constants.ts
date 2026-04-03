export const siteConfig = {
  name: "Estate Kings Basketball Academy",
  description:
    "Estate Kings Basketball Academy is the home of elite basketball in Lagos and Nigeria’s number one academy for rising stars.",
  tagline: "Amongst men, we are kings!",
  url: "https://estatekingsbasketballacademy.vercel.app",
};

export const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Schedule", href: "/schedule" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

export const stats = [
  { value: 5, label: "Years of Excellence", suffix: "+" },
  { value: 200, label: "Players Trained", suffix: "+" },
];

export const programs = [
  {
    id: 1,
    title: "Basketball Development",
    ageGroup: "Ages 4–18",
    description:
      "A single, focused basketball development program for boys and girls from age 4 to 18, building fundamentals, game IQ, and confidence.",
    price: "₦35,000 registration · ₦3,000 monthly",
    features: [
      "Registration includes official academy jersey",
      "Skill development for beginners to advanced players",
      "Fundamentals, footwork, ball-handling, and shooting",
      "Team play, discipline, and basketball IQ",
    ],
    featured: true,
  },
];

export const coaches = [
  {
    id: 1,
    name: "Paparazzi Soulja",
    role: "Organizer",
    bio: "Organizer of Estate Kings Basketball Academy with a passion for creating opportunities and structure for young players.",
    image: "/paparazzi.jpg",
  },
  {
    id: 2,
    name: "Coach Olasunkanmi",
    role: "Head Coach",
    bio: "Head coach leading on-court development, focused on fundamentals, discipline, and building confident, skilled athletes.",
    image: "/sk.jpg",
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Mr. Charles Okoro",
    role: "Parent",
    content:
      "Estate Kings Basketball Academy has transformed my son's game completely. The coaches are dedicated and the training is top-notch.",
  },
  {
    id: 2,
    name: "Mrs. Oluwaseyi",
    role: "Parent",
    content:
      "Best decision we made for our daughter. She's gained confidence both on and off the court.",
  },
  {
    id: 3,
    name: "Adamu Issac",
    role: "Player Alumni",
    content:
      "The skills I learned here helped shape my life for good. Forever grateful to my coaches.",
  },
];

export const schedule = [
  {
    day: "Friday",
    sessions: [
      { time: "2:00 PM - 5:00 PM", program: "Basketball Development (Ages 4–18)" },
    ],
  },
  {
    day: "Saturday",
    sessions: [
      { time: "7:00 AM - 9:00 AM", program: "Basketball Development (Ages 4–18)" },
    ],
  },
];



export const sponsors = [
  { id: 1, name: "Giants of Africa", logo: "/goa.png" },
  { id: 2, name: "Hoopz Media", logo: "/hoopz media.png" },
];
