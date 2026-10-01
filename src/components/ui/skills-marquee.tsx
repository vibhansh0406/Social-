"use client";

const skills = [
  "Python", "PyTorch", "TensorFlow", "Next.js", "React", "TypeScript",
  "Node.js", "Rust", "Go", "AWS", "Docker", "Kubernetes", "PostgreSQL",
  "MongoDB", "GraphQL", "WebSockets", "Redis", "CI/CD", "Git", "Linux"
];

export default function SkillsMarquee() {
  return (
    <div className="w-full overflow-hidden py-8 sm:py-12 border-y border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="flex w-[200%] animate-marquee">
        {[...skills, ...skills].map((skill, i) => (
          <div key={i} className="flex items-center shrink-0 px-4 sm:px-8">
            <span className="text-xl sm:text-2xl md:text-3xl font-serif text-white/60 hover:text-white transition-colors duration-300 whitespace-nowrap cursor-default">
              {skill}
            </span>
            <span className="ml-4 sm:ml-8 text-white/25 text-lg sm:text-xl select-none">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
