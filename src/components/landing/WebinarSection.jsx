import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Radio, Calendar, ArrowRight, PlayCircle } from 'lucide-react';
import { getWebinarStatus, getYouTubeThumbnail, formatWebinarDate, getCountdown } from '@/lib/webinarUtils';
import { WEBINARS } from '@/config/site';

export default function WebinarSection() {
  // Webinars come from static config (src/config/site.js) — no backend call.
  const webinars = WEBINARS;
  const loading = false;

  const now = new Date();
  const upcoming = webinars
    .filter((w) => getWebinarStatus(w, now) === 'upcoming')
    .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date));
  const past = webinars.filter((w) => getWebinarStatus(w, now) === 'completed');
  const live = webinars.filter((w) => getWebinarStatus(w, now) === 'live');

  const featured = live[0] || upcoming[0];
  const recentRecordings = past.slice(0, 3);

  if (!loading && webinars.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-100">
      <div className="max-w-[1280px] mx-auto px-5 md:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 mb-4">
            <Radio className="w-3 h-3 text-rose-600" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-600">Live every month</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.03em] leading-[1.05] text-slate-900 text-balance">
            Monthly <span className="font-serif italic font-medium text-primary">webinars.</span>
          </h2>
          <p className="mt-3 text-[15px] md:text-base text-slate-600 max-w-xl mx-auto">
            Join us live each month for deep dives into capital planning, condition intelligence, and asset strategy — or catch up on past sessions.
          </p>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-slate-200 rounded-2xl" />
          </div>
        ) : (
          <div className="space-y-10">
            {/* Featured upcoming / live webinar */}
            {featured && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-2xl border border-slate-200 p-6 md:p-8 elevation-1"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={featured.thumbnail_url || getYouTubeThumbnail(featured.youtube_video_id)}
                    alt={featured.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = `https://img.youtube.com/vi/${featured.youtube_video_id}/hqdefault.jpg`; }}
                  />
                  {live.length > 0 && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Live Now
                    </div>
                  )}
                </div>
                <div>
                  {live.length === 0 && upcoming.length > 0 && (
                    <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatWebinarDate(featured.scheduled_date)}
                      {getCountdown(featured.scheduled_date, now) && (
                        <span className="ml-1 text-primary">· in {getCountdown(featured.scheduled_date, now)}</span>
                      )}
                    </div>
                  )}
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-2">{featured.title}</h3>
                  {featured.presenter && (
                    <p className="text-sm text-slate-500 mb-3">with {featured.presenter}</p>
                  )}
                  <p className="text-[15px] text-slate-600 leading-relaxed mb-5">{featured.description}</p>
                  <div className="flex flex-wrap gap-3">
                    {live.length > 0 ? (
                      <Link to="/Webinars">
                        <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-colors">
                          <PlayCircle className="w-4 h-4" />
                          Watch Live
                        </button>
                      </Link>
                    ) : (
                      <a
                        href={`https://www.youtube.com/watch?v=${featured.youtube_video_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                      >
                        <Calendar className="w-4 h-4" />
                        Set Reminder
                      </a>
                    )}
                    <Link
                      to="/Webinars"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                    >
                      View All
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Recent recordings */}
            {recentRecordings.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h4 className="text-lg font-bold tracking-tight text-slate-900">Past Recordings</h4>
                  <Link to="/Webinars" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
                    View all <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {recentRecordings.map((w) => (
                    <Link
                      key={w.id}
                      to="/Webinars"
                      className="group rounded-xl overflow-hidden bg-white border border-slate-200 hover-lift elevation-1"
                    >
                      <div className="relative aspect-video bg-slate-100 overflow-hidden">
                        <img
                          src={w.thumbnail_url || getYouTubeThumbnail(w.youtube_video_id)}
                          alt={w.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { e.target.src = `https://img.youtube.com/vi/${w.youtube_video_id}/hqdefault.jpg`; }}
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlayCircle className="w-12 h-12 text-white drop-shadow-lg" />
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-slate-400 mb-1">{formatWebinarDate(w.scheduled_date)}</p>
                        <h5 className="font-semibold text-sm text-slate-900 line-clamp-2 leading-snug">{w.title}</h5>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}