import {Skill as SkillType, SkillGroup as SkillGroupType} from '../../../data/dataDef';

export function SkillGroup({skillGroup}: {skillGroup: SkillGroupType}) {
    const {name, skills} = skillGroup;
    return (
        <div className="flex flex-col gap-y-4">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-indigo-400/80">{name}</span>
            <div className="flex flex-col gap-y-3">
                {skills.map((skill, index) => (
                    <Skill key={`${skill.name}-${index}`} skill={skill} />
                ))}
            </div>
        </div>
    );
}

function Skill({skill}: {skill: SkillType}) {
    const {name, level, max = 10} = skill;
    const percentage = Math.round((level / max) * 100);

    return (
        <div className="flex flex-col gap-y-1.5">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-200">{name}</span>
                <span className="font-mono text-xs tabular-nums text-neutral-500">{percentage}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all"
                    style={{width: `${percentage}%`}}
                />
            </div>
        </div>
    );
}
