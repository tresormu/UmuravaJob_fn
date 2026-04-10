interface SkillMatrixProps {
  skills: {
    label: string;
    score: number;
    benchmark: number;
  }[];
}

export function SkillMatrix({ skills }: SkillMatrixProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-primary">Skill Matrix vs. Benchmark</h4>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Candidate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-secondary"></div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Target Benchmark</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {skills.map((skill, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-primary italic">
              <span>{skill.label}</span>
              <span>{skill.score} / 10</span>
            </div>
            <div className="h-2 bg-secondary rounded-full relative overflow-hidden">
               {/* Benchmark indicator */}
               <div 
                 className="absolute top-0 bottom-0 border-r-2 border-primary/20 bg-primary/5 transition-all" 
                 style={{ width: `${skill.benchmark * 10}%` }}
               />
               {/* Candidate Score */}
               <div 
                 className="h-full bg-primary rounded-full transition-all duration-1000 delay-300" 
                 style={{ width: `${skill.score * 10}%` }}
               />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
