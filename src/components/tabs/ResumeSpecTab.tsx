import React, { useState } from "react";
import { 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone,
  CheckCircle2,
  Layers,
  Sparkles
} from "lucide-react";
import { CandidateSession } from "../../types";

interface ResumeSpecTabProps {
  session: CandidateSession;
}

export const ResumeSpecTab: React.FC<ResumeSpecTabProps> = ({ session }) => {
  const [viewRaw, setViewRaw] = useState(false);
  const resume = session.parsedResume;
  const job = session.jobSpec;

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#111827]">Resume & Job Specification Breakdown</h3>
        <button
          onClick={() => setViewRaw(!viewRaw)}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors"
        >
          {viewRaw ? "View Structured Entities" : "View Raw Texts"}
        </button>
      </div>

      {viewRaw ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Raw Job Description</h4>
            <pre className="text-xs text-gray-700 font-mono bg-[#F9FAFB] p-4 rounded-xl whitespace-pre-wrap max-h-[600px] overflow-y-auto border border-[#E5E7EB]">
              {job.rawText || JSON.stringify(job, null, 2)}
            </pre>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Raw Resume Text</h4>
            <pre className="text-xs text-gray-700 font-mono bg-[#F9FAFB] p-4 rounded-xl whitespace-pre-wrap max-h-[600px] overflow-y-auto border border-[#E5E7EB]">
              {resume.rawText || JSON.stringify(resume, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Parsed Resume (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Candidate Header */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#111827]">{resume.candidateName}</h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-3 flex-wrap">
                    {resume.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        {resume.email}
                      </span>
                    )}
                    {resume.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        {resume.phone}
                      </span>
                    )}
                    {resume.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {resume.location}
                      </span>
                    )}
                  </p>
                </div>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200">
                  {resume.yearsOfExperience}+ Years Experience
                </span>
              </div>

              {resume.summary && (
                <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-xs text-gray-700 leading-relaxed">
                  <span className="font-semibold text-[#111827] block mb-1">Executive Summary</span>
                  {resume.summary}
                </div>
              )}

              {/* Skills Chips */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-indigo-600" />
                  Extracted Skills & Technologies ({resume.skills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {resume.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-[#111827] border border-[#E5E7EB]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Work Experience Timeline */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                Work History & Track Record
              </h4>

              <div className="space-y-6 relative pl-4 border-l-2 border-gray-200">
                {(resume.workHistory || []).map((work, idx) => (
                  <div key={idx} className="relative space-y-2">
                    {/* Circle on timeline */}
                    <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white" />
                    
                    <div className="flex items-start justify-between flex-wrap gap-1">
                      <div>
                        <h5 className="text-sm font-bold text-[#111827]">{work.role}</h5>
                        <p className="text-xs font-medium text-indigo-600">{work.company}</p>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">{work.period}</span>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed">{work.description}</p>

                    {work.highlights && work.highlights.length > 0 && (
                      <ul className="space-y-1.5 pt-1">
                        {work.highlights.map((item, hIdx) => (
                          <li key={hIdx} className="text-xs text-gray-600 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Education & Certs */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                Education & Credentials
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(resume.education || []).map((edu, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1">
                    <p className="text-xs font-bold text-[#111827]">{edu.degree}</p>
                    <p className="text-xs text-gray-600">{edu.institution}</p>
                    {edu.year && <p className="text-[11px] text-gray-400">Class of {edu.year}</p>}
                  </div>
                ))}
              </div>

              {resume.certifications && resume.certifications.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs font-bold text-[#111827] mb-2 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    Certifications
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {resume.certifications.map((cert, cIdx) => (
                      <span key={cIdx} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Job Specification (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-5 sticky top-24">
              <div className="space-y-1.5 border-b border-[#E5E7EB] pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Target Role Specification</span>
                <h3 className="text-lg font-bold text-[#111827]">{job.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {job.department && <span>{job.department}</span>}
                  {job.seniority && (
                    <>
                      <span>•</span>
                      <span>{job.seniority}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#111827]">Role Summary</h4>
                <p className="text-xs text-gray-600 leading-relaxed bg-[#F9FAFB] p-3.5 rounded-xl border border-[#E5E7EB]">
                  {job.summary}
                </p>
              </div>

              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-[#111827]">Must-Have Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(job.requiredSkills || []).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200/80"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {job.niceToHaveSkills && job.niceToHaveSkills.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-[#111827]">Nice-to-Have Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {job.niceToHaveSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-[#E5E7EB]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#111827]">Core Responsibilities</h4>
                <ul className="space-y-2">
                  {(job.responsibilities || []).map((resp, idx) => (
                    <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
