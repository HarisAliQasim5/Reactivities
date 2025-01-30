import React, { useEffect } from 'react';

interface PageTitleProps {
  title: string; // Define the type of the `title` prop
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
};

export default PageTitle;
