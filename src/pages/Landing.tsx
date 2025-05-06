import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  CheckCircle2, 
  Shield, 
  Users, 
  FileText, 
  ArrowRight,
  CalendarCheck
} from 'lucide-react';

const Landing = () => {
/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Renders the landing page of the Loomra application.
 * This page includes a navigation header, a hero section highlighting the
 * app's capabilities, feature summaries, testimonials from users,
 * and a call-to-action section encouraging users to try the service.
 * It is designed to provide a comprehensive overview of Loomra's benefits
 * for professionals, using a combination of static content and animations
 * for an engaging user experience.
 */

/*******  4464409d-ed59-4ec0-9472-efd4c782b4fd  *******/
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-8 flex justify-between items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <h1 className="ml-3 text-2xl font-bold text-gray-800 dark:text-white">Loomra</h1>
        </div>
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link to="/features" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition">Features</Link>
          <Link to="/pricing" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition">Pricing</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition">About</Link>
          <Link to="/login" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition">Login</Link>
          <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Get Started
          </Link>
        </div>
        <div className="md:hidden">
          {/* Mobile menu button would go here */}
          <button className="text-gray-700 dark:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-grow flex flex-col justify-center items-center px-4 py-16 md:py-24 text-center">
        <motion.h2
          className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          The Modern CRM for
          <span className="text-blue-600 dark:text-blue-400 block mt-2">
            Professionals Who Deliver
          </span>
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Loomra brings together client management, task tracking, and meeting scheduling into one sleek dashboard. Streamline your workflow and focus on what matters most — your clients.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.6 }}
        >
          <Link to="/register" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition flex items-center justify-center">
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link to="/demo" className="border border-gray-300 dark:border-gray-600 px-6 py-3 rounded-lg text-lg font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            See Demo
          </Link>
        </motion.div>

        <motion.div
          className="w-full max-w-5xl mt-12 lg:mt-16 rounded-xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
        >
          <img
            src="/api/placeholder/1200/800"
            alt="Loomra dashboard preview"
            className="w-full h-auto object-cover"
          />
        </motion.div>
      </main>

      {/* Features */}
      <section id="features" className="py-16 lg:py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Everything You Need to Succeed
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Powerful features designed to streamline your workflow and boost productivity
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Client Management */}
            <motion.div 
              className="p-6 bg-blue-50 dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Client Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Store client details, notes, and interaction history in one centralized place. Tag and categorize clients for easy organization.
              </p>
            </motion.div>

            {/* Task Tracking */}
            <motion.div 
              className="p-6 bg-blue-50 dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Task Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create, assign, and prioritize tasks to stay on top of deadlines. Automate routine tasks with customizable workflows.
              </p>
            </motion.div>

            {/* Meeting Scheduling */}
            <motion.div 
              className="p-6 bg-blue-50 dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
                <CalendarCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Meeting Scheduling
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Plan and manage client meetings with intuitive calendar integration. Send automatic reminders and schedule follow-ups.
              </p>
            </motion.div>

            {/* Document Management */}
            <motion.div 
              className="p-6 bg-blue-50 dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Document Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Store and organize important documents securely in the cloud. Attach files to client profiles for easy reference.
              </p>
            </motion.div>

            {/* Analytics */}
            <motion.div 
              className="p-6 bg-blue-50 dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Analytics & Insights
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get actionable insights into your business performance, client retention, and productivity metrics with beautiful visual reports.
              </p>
            </motion.div>

            {/* Policy Tracking */}
            <motion.div 
              className="p-6 bg-blue-50 dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Policy Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor policy statuses and renewals with automated alerts. Never miss an important deadline or renewal opportunity.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Professionals
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Here's what our clients have to say
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-600">
                  JD
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Jane Doe</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Insurance Agent</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "Loomra has completely transformed how I manage my client relationships. The automated reminders for policy renewals have helped me retain more clients than ever before."
              </p>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-xl font-bold text-green-600">
                  MS
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Michael Smith</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Financial Advisor</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "The analytics dashboard gives me insights I never had before. I can see exactly which areas of my business are thriving and where I need to focus more attention."
              </p>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-xl font-bold text-purple-600">
                  SR
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Sarah Rodriguez</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Real Estate Agent</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "I love how Loomra lets me manage all my client communications in one place. The meeting scheduler has eliminated the back-and-forth emails completely!"
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 dark:bg-blue-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who trust Loomra to manage their client relationships
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link to="/register" className="inline-block bg-white text-blue-600 hover:bg-blue-50 text-lg font-medium px-8 py-3 rounded-lg shadow-lg transition">
                Start Your Free 14-Day Trial
                <ArrowRight className="inline-block ml-2 h-5 w-5" />
              </Link>
            </motion.div>
            <p className="text-blue-200 mt-4">No credit card required. Cancel anytime.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><Link to="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link to="/security" className="hover:text-white transition">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-white transition">About</Link></li>
                <li><Link to="/blog" className="hover:text-white transition">Blog</Link></li>
                <li><Link to="/careers" className="hover:text-white transition">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/docs" className="hover:text-white transition">Documentation</Link></li>
                <li><Link to="/help" className="hover:text-white transition">Help Center</Link></li>
                <li><Link to="/api" className="hover:text-white transition">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="hover:text-white transition">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition">Terms</Link></li>
                <li><Link to="/cookies" className="hover:text-white transition">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-white">Loomra</span>
            </div>
            <p className="text-sm">© {new Date().getFullYear()} Loomra. Built for doers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;