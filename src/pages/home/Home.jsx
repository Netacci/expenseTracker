/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  DollarSign,
  PieChart,
  BarChart2,
  Zap,
  ArrowRight,
  Menu,
  X,
  CheckCircle,
  Star,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { ROUTES } from '../../utils/routes';
import { Link } from 'react-router-dom';

const AnimatedCounter = ({ target, duration = 2, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now();
    const endTime = startTime + duration * 1000;
    const update = (currentTime) => {
      if (currentTime < endTime) {
        const progress = (currentTime - startTime) / (duration * 1000);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        requestAnimationFrame(update);
      } else {
        setCount(target);
      }
    };
    requestAnimationFrame(update);
  }, [target, duration, inView]);

  return (
    <span ref={ref} className='tabular-nums'>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

const FeatureCard = ({ icon: Icon, title, description, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className='group bg-white rounded-2xl p-6 shadow-card border border-slate-100 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300'
  >
    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-5`}>
      <Icon className='h-6 w-6 text-white' />
    </div>
    <h3 className='text-lg font-bold text-slate-900 mb-2'>{title}</h3>
    <p className='text-slate-500 text-sm leading-relaxed'>{description}</p>
  </motion.div>
);

const TestimonialCard = ({ name, role, content, rating, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className='bg-white rounded-2xl p-6 shadow-card border border-slate-100 hover:shadow-card-hover transition-all duration-300'
  >
    <div className='flex gap-1 mb-4'>
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} className='h-4 w-4 fill-amber-400 text-amber-400' />
      ))}
    </div>
    <p className='text-slate-600 text-sm leading-relaxed mb-5'>&quot;{content}&quot;</p>
    <div className='flex items-center gap-3'>
      <div className='w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0'>
        {name[0]}
      </div>
      <div>
        <p className='font-semibold text-slate-900 text-sm'>{name}</p>
        <p className='text-slate-400 text-xs'>{role}</p>
      </div>
    </div>
  </motion.div>
);

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: DollarSign,
      title: 'Monthly Plans',
      description: 'Set monthly plans with guided setup, categories, and spending limits that you can adjust anytime.',
      color: 'bg-emerald-500',
    },
    {
      icon: FileText,
      title: 'Invoicing',
      description: 'Create invoices, manage line items, send reminders, and track paid vs unpaid in one place.',
      color: 'bg-violet-500',
    },
    {
      icon: RefreshCw,
      title: 'Subscriptions',
      description: 'Track recurring services, renewal dates, and your monthly subscription commitment.',
      color: 'bg-blue-500',
    },
    {
      icon: PieChart,
      title: 'Visual Insights',
      description: 'Understand plans, invoices, and subscriptions with clean charts and at-a-glance summaries.',
      color: 'bg-amber-500',
    },
    {
      icon: BarChart2,
      title: 'Expense Tracking',
      description: 'Log expenses by category and see exactly where your money goes across each month.',
      color: 'bg-rose-500',
    },
    {
      icon: Zap,
      title: 'AI Reports',
      description: 'Generate one detailed AI report per monthly plan and revisit saved reports from Tabs.',
      color: 'bg-indigo-500',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Freelance Designer',
      content: "ExpenseTracker completely changed how I manage my finances. I've saved more in 3 months than I did all last year.",
      rating: 5,
    },
    {
      name: 'James K.',
      role: 'Small Business Owner',
      content: "The budget overview is incredible. I can see exactly where my money is going and make smarter decisions every week.",
      rating: 5,
    },
    {
      name: 'Priya L.',
      role: 'Marketing Manager',
      content: "Finally an app that makes budgeting simple. The charts are beautiful and the interface is so clean and easy to use.",
      rating: 5,
    },
  ];

  const stats = [
    { label: 'Active Users', value: 50000, suffix: '+' },
    { label: 'Budgets Created', value: 200000, suffix: '+' },
    { label: 'Saved by Users', prefix: '$', value: 2, suffix: 'M+' },
    { label: 'Countries', value: 40, suffix: '+' },
  ];

  return (
    <div className='min-h-screen bg-white'>
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100' : 'bg-transparent'
        }`}
      >
        <div className='max-w-7xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <Link to='/' className='flex items-center gap-2.5'>
              <div className='w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center'>
                <DollarSign className='h-5 w-5 text-white' />
              </div>
              <span className='text-lg font-bold text-white'>ExpenseTracker</span>
            </Link>

            <div className='hidden md:flex items-center gap-8'>
              <a href='#features' className='text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors'>Features</a>
              <a href='#testimonials' className='text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors'>Testimonials</a>
              <a href='#stats' className='text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors'>About</a>
            </div>

            <div className='hidden md:flex items-center gap-3'>
              <Link
                to={ROUTES.login}
                className='text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors px-4 py-2'
              >
                Log In
              </Link>
              <Link
                to={ROUTES.signup}
                className='text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md'
              >
                Get Started Free
              </Link>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors'
            >
              {isMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className='md:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-1'
          >
            <a href='#features' onClick={() => setIsMenuOpen(false)} className='block py-2.5 text-sm font-medium text-slate-700 hover:text-emerald-600'>Features</a>
            <a href='#testimonials' onClick={() => setIsMenuOpen(false)} className='block py-2.5 text-sm font-medium text-slate-700 hover:text-emerald-600'>Testimonials</a>
            <div className='pt-3 flex flex-col gap-2'>
              <Link to={ROUTES.login} className='w-full text-center py-2.5 text-sm font-medium border border-slate-200 rounded-xl text-slate-700'>Log In</Link>
              <Link to={ROUTES.signup} className='w-full text-center py-2.5 text-sm font-semibold bg-emerald-600 text-white rounded-xl'>Get Started</Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className='relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950'>
        <div className='absolute inset-0 hero-pattern opacity-30' />
        <div className='absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl' />
        <div className='absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-400/5 rounded-full blur-3xl' />

        <div className='relative max-w-7xl mx-auto px-6 pt-24 pb-16'>
          <div className='grid lg:grid-cols-2 gap-16 items-center'>
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='text-5xl lg:text-7xl font-bold text-white leading-tight mb-6'
              >
                Master Your
                <span className='block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300'>
                  Money Today
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className='text-slate-400 text-lg leading-relaxed mb-8 max-w-xl'
              >
                Plan monthly budgets, send invoices, and manage subscriptions — all in one simple app. Join <strong className='text-white'>50,000+</strong> people building better money habits.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className='flex flex-wrap gap-4 mb-10'
              >
                <Link
                  to={ROUTES.signup}
                  className='group inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-7 py-3.5 rounded-2xl transition-all duration-200 shadow-glow-emerald hover:shadow-lg'
                >
                  Start for Free
                  <ArrowRight className='h-4 w-4 group-hover:translate-x-1 transition-transform' />
                </Link>
                <a
                  href='https://www.loom.com/share/511643a103bf46e59038f67ca866081e'
                  target='_blank'
                  rel='noreferrer'
                  className='inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-2xl transition-all duration-200 backdrop-blur-sm'
                >
                  Watch Demo
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className='flex items-center gap-6'
              >
                {[
                  'No credit card required',
                  'Free forever plan',
                  'Set up in 2 minutes',
                ].map((item) => (
                  <div key={item} className='flex items-center gap-1.5'>
                    <CheckCircle className='h-4 w-4 text-emerald-400 flex-shrink-0' />
                    <span className='text-slate-400 text-xs font-medium'>{item}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Hero visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='relative hidden lg:block'
            >
              <div className='relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl'>
                <div className='flex items-center gap-2 mb-6'>
                  <div className='w-3 h-3 rounded-full bg-rose-400' />
                  <div className='w-3 h-3 rounded-full bg-amber-400' />
                  <div className='w-3 h-3 rounded-full bg-emerald-400' />
                  <div className='ml-auto text-slate-400 text-xs font-medium'>Dashboard Overview</div>
                </div>

                <div className='grid grid-cols-2 gap-3 mb-4'>
                  {[
                    { label: 'Total Income', value: '$8,420', color: 'text-emerald-400', bg: 'bg-emerald-500/10', change: '+12%' },
                    { label: 'Total Expenses', value: '$3,180', color: 'text-rose-400', bg: 'bg-rose-500/10', change: '-5%' },
                    { label: 'Invoices Paid', value: '18', color: 'text-blue-400', bg: 'bg-blue-500/10', change: '+6%' },
                    { label: 'Subscriptions', value: '9 Active', color: 'text-violet-400', bg: 'bg-violet-500/10', change: '' },
                  ].map((stat) => (
                    <div key={stat.label} className={`${stat.bg} rounded-2xl p-4`}>
                      <p className='text-slate-400 text-xs mb-1'>{stat.label}</p>
                      <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                      {stat.change && <p className='text-slate-500 text-xs mt-0.5'>{stat.change} this month</p>}
                    </div>
                  ))}
                </div>

                <div className='bg-white/5 rounded-2xl p-4'>
                  <p className='text-slate-400 text-xs mb-3'>Category Spend Overview</p>
                  <div className='space-y-2.5'>
                    {[
                      { category: 'Housing', percent: 78, color: 'bg-violet-500' },
                      { category: 'Food & Dining', percent: 52, color: 'bg-amber-500' },
                      { category: 'Transportation', percent: 34, color: 'bg-blue-500' },
                      { category: 'Entertainment', percent: 22, color: 'bg-rose-500' },
                    ].map((item) => (
                      <div key={item.category}>
                        <div className='flex justify-between text-xs text-slate-400 mb-1'>
                          <span>{item.category}</span>
                          <span>{item.percent}%</span>
                        </div>
                        <div className='h-1.5 bg-white/10 rounded-full overflow-hidden'>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percent}%` }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className={`h-full ${item.color} rounded-full`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className='absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-slate-100'
              >
                <p className='text-xs text-slate-500 mb-0.5'>Net Worth</p>
                <p className='text-xl font-bold text-emerald-600'>$24,530</p>
                <p className='text-xs text-emerald-500 mt-0.5'>↑ 18% this year</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className='absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-slate-100'
              >
                <p className='text-xs text-slate-500 mb-0.5'>Goal Progress</p>
                <p className='text-xl font-bold text-violet-600'>62%</p>
                <p className='text-xs text-slate-400 mt-0.5'>Emergency Fund</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id='stats' className='py-16 bg-slate-50 border-y border-slate-100'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-8'>
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className='text-center'
              >
                <p className='text-4xl font-bold text-slate-900 mb-1'>
                  <AnimatedCounter target={stat.value} prefix={stat.prefix || ''} suffix={stat.suffix || ''} />
                </p>
                <p className='text-sm text-slate-500 font-medium'>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='py-24'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='text-center mb-16'>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='text-emerald-600 text-sm font-semibold uppercase tracking-widest mb-3'
            >
              Everything you need
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className='text-4xl font-bold text-slate-900 mb-4'
            >
              Powerful features, <span className='text-emerald-600'>simple experience</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className='text-slate-500 text-lg max-w-2xl mx-auto'
            >
              Everything you need to take full control of your financial life — beautifully designed and incredibly easy to use.
            </motion.p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {features.map((feature, i) => (
              <FeatureCard key={feature.title} {...feature} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className='py-24 bg-gradient-to-br from-slate-900 to-emerald-950 relative overflow-hidden'>
        <div className='absolute inset-0 hero-pattern opacity-20' />
        <div className='max-w-7xl mx-auto px-6 relative'>
          <div className='text-center mb-16'>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='text-4xl font-bold text-white mb-4'
            >
              Get started in minutes
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className='text-slate-400 text-lg'
            >
              Three simple steps to run your money system
            </motion.p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            {[
              { step: '01', title: 'Create an Account', desc: 'Sign up for free in under 2 minutes. No credit card needed, no commitments.' },
              { step: '02', title: 'Set Up Plans, Invoices & Subs', desc: 'Create monthly plans, send invoices, and track recurring subscriptions in one dashboard.' },
              { step: '03', title: 'Track, Analyze & Improve', desc: 'Log expenses, review insights, and use AI reports to improve your decisions each month.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className='text-center'
              >
                <div className='text-7xl font-black text-emerald-500/20 mb-4 leading-none'>{item.step}</div>
                <h3 className='text-xl font-bold text-white mb-3'>{item.title}</h3>
                <p className='text-slate-400 leading-relaxed'>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id='testimonials' className='py-24 bg-slate-50'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='text-center mb-16'>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='text-emerald-600 text-sm font-semibold uppercase tracking-widest mb-3'
            >
              Loved by thousands
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className='text-4xl font-bold text-slate-900'
            >
              Real people, real results
            </motion.h2>
          </div>

          <div className='grid md:grid-cols-3 gap-6'>
            {testimonials.map((testimonial, i) => (
              <TestimonialCard key={testimonial.name} {...testimonial} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-24 bg-white'>
        <div className='max-w-4xl mx-auto px-6 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-12 shadow-xl'
          >
            <h2 className='text-4xl font-bold text-white mb-4'>
              Ready to transform your finances?
            </h2>
            <p className='text-emerald-100 text-lg mb-8 max-w-xl mx-auto'>
              Join 50,000+ users who have already taken control of their money. Start free today.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                to={ROUTES.signup}
                className='group inline-flex items-center justify-center gap-2 bg-white text-emerald-700 font-semibold px-8 py-4 rounded-2xl hover:bg-emerald-50 transition-all duration-200 shadow-lg hover:shadow-xl'
              >
                Get Started Free
                <ArrowRight className='h-4 w-4 group-hover:translate-x-1 transition-transform' />
              </Link>
              <Link
                to={ROUTES.login}
                className='inline-flex items-center justify-center gap-2 bg-emerald-500/30 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-emerald-500/40 border border-emerald-400/30 transition-all duration-200'
              >
                Log In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-slate-900 text-white py-12'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-10'>
            <div className='col-span-1 md:col-span-1'>
              <div className='flex items-center gap-2.5 mb-4'>
                <div className='w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center'>
                  <DollarSign className='h-5 w-5 text-white' />
                </div>
                <span className='text-lg font-bold'>ExpenseTracker</span>
              </div>
              <p className='text-slate-400 text-sm leading-relaxed'>
                Your path to financial freedom starts here. Simple, powerful, free.
              </p>
            </div>
            {[
              {
                title: 'Product',
                links: ['Features', 'Pricing', 'Testimonials', 'Changelog'],
              },
              {
                title: 'Company',
                links: ['About', 'Careers', 'Privacy Policy', 'Terms of Service'],
              },
              {
                title: 'Connect',
                links: ['Twitter', 'LinkedIn', 'Instagram', 'Support'],
              },
            ].map((col) => (
              <div key={col.title}>
                <h3 className='text-sm font-semibold text-white mb-4'>{col.title}</h3>
                <ul className='space-y-2.5'>
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href='#' className='text-sm text-slate-400 hover:text-white transition-colors'>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className='border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4'>
            <p className='text-slate-500 text-sm'>
              &copy; {new Date().getFullYear()} ExpenseTracker. All rights reserved.
            </p>
            <p className='text-slate-600 text-sm'>Made with ♥ for better finances</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
