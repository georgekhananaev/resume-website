import {experience, SectionId, skills} from '../../../data/data';
import ResumeSection from './ResumeSection';
import {SkillGroup} from './Skills';
import TimelineItem from './TimelineItem';

/**
 * Dark editorial Resume section. Uses the same language as Services /
 * FavoriteTech / GithubStats: bg-neutral-900 (matches About), indigo radial
 * vignette, eyebrow + title header, and a monospace-labelled left column for
 * subsections. Work history is rendered as a proper vertical timeline rail.
 */
export default function Resume() {
    return (
        <section
            className="relative overflow-hidden border-t border-white/5 bg-neutral-900 px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32"
            id={SectionId.Resume}>
            {/* Indigo radial vignette — subtle, matches About */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.08) 0%, rgba(23, 23, 23, 0) 55%)',
                }}
            />

            <div className="relative z-10 mx-auto max-w-screen-lg">
                <div className="mb-16 max-w-2xl">
                    <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">Career</p>
                    <h2 className="mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                        Experience &amp; skills
                    </h2>
                    <p className="mt-6 text-base leading-relaxed text-neutral-400 sm:text-lg">
                        Ten years of building production software. Here&apos;s where I&apos;ve worked and the stack I bring
                        to the table.
                    </p>
                </div>

                <div className="space-y-16 sm:space-y-20">
                    <ResumeSection title="Work">
                        <ol className="relative border-l border-white/10 pl-8">
                            {experience.map((item, index) => (
                                <TimelineItem item={item} key={`${item.title}-${index}`} />
                            ))}
                        </ol>
                    </ResumeSection>

                    <ResumeSection title="Skills">
                        <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2">
                            {skills.map((skillgroup, index) => (
                                <SkillGroup key={`${skillgroup.name}-${index}`} skillGroup={skillgroup} />
                            ))}
                        </div>
                    </ResumeSection>
                </div>
            </div>
        </section>
    );
}
