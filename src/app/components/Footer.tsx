import React from 'react';
import { PRODUCT_NAME } from "@/utils/constants";
import GitHubButton from "react-github-btn";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-4 mt-auto border-t border-[#121212]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          © {currentYear} {PRODUCT_NAME}. All rights reserved.
        </p>
        <GitHubButton
          href={`https://github.com/heyAyushh/${PRODUCT_NAME}`}
          data-color-scheme="no-preference: dark; light: dark; dark: dark;"
          data-icon="octicon-star"
          data-size="large"
          aria-label={`Star heyAyushh/${PRODUCT_NAME} on GitHub`}
        >
          Star
        </GitHubButton>
      </div>
    </footer>
  );
};
