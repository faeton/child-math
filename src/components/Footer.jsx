import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600">
          © {year} Kids Math Games. All rights reserved.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Fun educational games for children to learn math concepts.
        </p>
      </div>
    </footer>
  );
};

export default Footer;