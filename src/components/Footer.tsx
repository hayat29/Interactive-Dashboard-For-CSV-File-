import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-gray-900">
              Hayat Interactive EDA Dashboard
            </h3>
            <p className="text-sm text-gray-600">
              Professional CSV Data Analysis Tool
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Built with React, TypeScript, and Tailwind CSS
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end space-y-2">
            <div className="text-sm text-gray-600">
              Created by <span className="font-semibold text-gray-900">Faisal Hayat</span>
            </div>
            <div className="flex space-x-4">
              <a
                href="mailto:faisal@example.com"
                className="text-gray-400 hover:text-blue-600 transition-colors"
                title="Email Faisal Hayat"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/faisalhayat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors"
                title="LinkedIn Profile"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/faisalhayat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-900 transition-colors"
                title="GitHub Profile"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-6 pt-6 text-center">
          <p className="text-xs text-gray-500">
            © 2025 Faisal Hayat. All rights reserved. | 
            <span className="ml-1">
              Empowering data-driven decisions through interactive analysis
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};