/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  PieChart,
  Download,
  BarChart2,
  Menu,
  X,
} from 'lucide-react';
import { ROUTES } from '../../utils/routes';
import { Link } from 'react-router-dom';
import UserPhoto from '../../assets/user.jpg';
import Dashboardbg from '../../assets/bd.png';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    className='bg-white p-6 rounded-lg shadow-lg transform hover:-translate-y-2 transition-all duration-300 border-b-4 border-green-500'
    whileHover={{ scale: 1.05 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <Icon className='h-12 w-12 text-green-600 mb-4' />
    <h3 className='text-xl font-semibold mb-2'>{title}</h3>
    <p className='text-gray-600'>{description}</p>
  </motion.div>
);

const AnimatedCounter = ({ target, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    const element = countRef.current;
    if (!element) return;

    const startTime = performance.now();
    const endTime = startTime + duration * 1000;

    const updateCounter = (currentTime) => {
      if (currentTime < endTime) {
        const elapsedTime = currentTime - startTime;
        const progress = elapsedTime / (duration * 1000);
        const currentCount = Math.round(progress * target);
        setCount(currentCount);
        requestAnimationFrame(updateCounter);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [target, duration]);

  return (
    <span
      ref={countRef}
      className='tabular-nums inline-block min-w-[4ch] text-right'
    >
      {count.toLocaleString()}
    </span>
  );
};
const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100'>
      {/* Navigation */}
      <nav className='bg-white shadow-md'>
        <div className='container mx-auto px-6 py-3'>
          <div className='flex items-center justify-between'>
            <Link to='/' className='flex-shrink-0 flex items-center'>
              <div className='flex items-center'>
                <DollarSign className='h-8 w-8 text-green-600' />
                <span className='text-xl font-bold text-gray-800 ml-2'>
                  ExpenseTracker
                </span>
              </div>
            </Link>
            <div className='hidden md:flex space-x-4'>
              <a
                href='#features'
                className='text-gray-800 hover:text-green-600 transition duration-300'
              >
                Features
              </a>
              <a
                href='#testimonials'
                className='text-gray-800 hover:text-green-600 transition duration-300'
              >
                Testimonials
              </a>
              <a
                href='#pricing'
                className='text-gray-800 hover:text-green-600 transition duration-300'
              >
                About
              </a>
            </div>
            <div className='hidden md:flex space-x-4'>
              <a
                href={ROUTES.login}
                className='bg-green-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-700 transition duration-300'
              >
                Log In
              </a>
              <a
                href={ROUTES.signup}
                className='bg-gray-800 text-white px-4 py-2 rounded-full font-semibold hover:bg-gray-900 transition duration-300'
              >
                Sign Up
              </a>
            </div>
            <div className='md:hidden'>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? (
                  <X className='h-6 w-6' />
                ) : (
                  <Menu className='h-6 w-6' />
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='md:hidden bg-white shadow-lg rounded-b-lg'
          >
            <a
              href='#features'
              className='block py-2 px-4 text-sm hover:bg-gray-100'
            >
              Features
            </a>
            <a
              href='#testimonials'
              className='block py-2 px-4 text-sm hover:bg-gray-100'
            >
              Testimonials
            </a>
            {/* <a
              href='#pricing'
              className='block py-2 px-4 text-sm hover:bg-gray-100'
            >
              Pricing
            </a> */}
            <a
              href={ROUTES.login}
              className='block py-2 px-4 text-sm hover:bg-gray-100'
            >
              Log In
            </a>
            <a
              href={ROUTES.signup}
              className='block py-2 px-4 text-sm hover:bg-gray-100'
            >
              Sign Up
            </a>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <header className='relative overflow-hidden bg-green-600 text-white'>
        <div className='container mx-auto px-6 py-16 md:py-32'>
          <div className='flex flex-col md:flex-row items-center justify-between'>
            <div className='md:w-1/2 mb-12 md:mb-0 z-10'>
              <motion.h1
                className='text-4xl md:text-6xl font-bold mb-6'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Master Your Money, <br />
                Shape Your Future
              </motion.h1>
              <motion.p
                className='text-xl mb-8'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Join <AnimatedCounter target={50000} /> users who&apos;ve
                transformed their financial lives with ExpenseTracker.
              </motion.p>
              <motion.div
                className='space-x-4'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <a
                  href='/signup'
                  className='bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-green-100 transition duration-300 inline-block mb-4 md:mb-0'
                >
                  Register
                </a>
                <a
                  href='https://www.loom.com/share/511643a103bf46e59038f67ca866081e'
                  target='_blank'
                  className='bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-800 transition duration-300 inline-block'
                >
                  Watch Demo
                </a>
              </motion.div>
            </div>
            <motion.div
              className='md:w-1/2 relative z-10'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={Dashboardbg}
                alt='ExpenseTracker Dashboard'
                className='rounded-lg shadow-2xl'
              />
              <div className='absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg'>
                <p className='text-green-600 font-semibold'>Total Savings</p>
                <p className='text-3xl font-bold text-gray-800'>$1,234.56</p>
              </div>
            </motion.div>
          </div>
        </div>
        {/* Abstract background shapes */}
        <div className='absolute top-0 left-0 w-full h-full overflow-hidden z-0'>
          <div className='absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-green-500 rounded-full opacity-20'></div>
          <div className='absolute -bottom-1/4 -right-1/4 w-3/4 h-3/4 bg-green-700 rounded-full opacity-20'></div>
        </div>
      </header>

      {/* Features Section */}
      <section id='features' className='py-20'>
        <div className='container mx-auto px-6'>
          <h2 className='text-4xl font-bold text-center mb-16'>
            Powerful Features to Boost Your Finances
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            <FeatureCard
              icon={DollarSign}
              title='Smart Budgeting'
              description='Create intelligent budgets that adapt to your spending habits and financial goals.'
            />
            <FeatureCard
              icon={PieChart}
              title='Expense Insights'
              description='Gain deep insights into your spending patterns with interactive charts and reports.'
            />
            <FeatureCard
              icon={Download}
              title='Custom Reports'
              description='Generate and download detailed financial reports tailored to your needs.'
            />
            <FeatureCard
              icon={BarChart2}
              title='Goal Tracking'
              description='Set, visualize, and achieve your financial goals with our intuitive tracking system.'
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id='testimonials' className='bg-gray-100 py-20'>
        <div className='container mx-auto px-6'>
          <h2 className='text-4xl font-bold text-center mb-16'>
            What Our Users Say
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className='bg-white p-6 rounded-lg shadow-lg'
                whileHover={{ y: -10 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <p className='text-gray-600 mb-4'>
                  &quot;ExpenseTracker has completely changed how I manage my
                  finances. I&apos;ve never felt more in control of my
                  money.&quot;
                </p>
                <div className='flex items-center'>
                  <img
                    src={UserPhoto}
                    alt='Photo by Venrick Azcueta Unsplash'
                    className='rounded-full mr-4 w-11 h-12'
                  />
                  <div>
                    <p className='font-semibold'>John Doe</p>
                    <p className='text-sm text-gray-500'>
                      Small Business Owner
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='bg-green-600 text-white py-20'>
        <div className='container mx-auto px-6 text-center'>
          <h2 className='text-4xl font-bold mb-8'>
            Ready to Transform Your Finances?
          </h2>
          <p className='text-xl mb-12 max-w-2xl mx-auto'>
            Join thousands of users who have taken control of their financial
            future with ExpenseTracker. Start your journey to financial freedom
            today.
          </p>
          <a
            href='/signup'
            className='bg-white text-green-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-100 transition duration-300 inline-block'
          >
            Join now
          </a>
          {/* <p className='mt-4 text-sm'>Get on the right track</p> */}
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-800 text-white py-12'>
        <div className='container mx-auto px-6'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            <div>
              <div className='flex items-center mb-4'>
                <DollarSign className='h-8 w-8 mr-2' />
                <span className='text-2xl font-bold'>ExpenseTracker</span>
              </div>
              <p className='text-gray-400'>
                Your path to financial freedom starts here.
              </p>
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-4'>Product</h3>
              <ul className='space-y-2'>
                <li>
                  <a
                    href='#'
                    className='text-gray-400 hover:text-white transition duration-300'
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-gray-400 hover:text-white transition duration-300'
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-gray-400 hover:text-white transition duration-300'
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-gray-400 hover:text-white transition duration-300'
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-4'>Company</h3>
              <ul className='space-y-2'>
                <li>
                  <a
                    href='#'
                    className='text-gray-400 hover:text-white transition duration-300'
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-gray-400 hover:text-white transition duration-300'
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-gray-400 hover:text-white transition duration-300'
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-gray-400 hover:text-white transition duration-300'
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-4'>Connect</h3>
              <ul className='space-y-2'>
                <li>
                  <a
                    href='#'
                    className='text-gray-400 hover:text-white transition duration-300'
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-gray-400 hover:text-white transition duration-300'
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-gray-400 hover:text-white transition duration-300'
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-gray-400 hover:text-white transition duration-300'
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className='mt-12 text-center text-sm text-gray-400'>
            &copy; 2024 ExpenseTracker. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
