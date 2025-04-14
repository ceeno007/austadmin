import React from 'react';
import { Link } from 'react-router-dom';

interface ProgramCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  level: string;
}

const ProgramCard: React.FC<ProgramCardProps> = (program) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="relative h-48">
        <img
          src={program.image}
          alt={program.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
        <p className="text-gray-600 mb-4">{program.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{program.duration}</span>
          <span className="text-sm text-gray-500">{program.level}</span>
        </div>
        <Link
          to={`/programs/${program.id}`}
          className="mt-4 block text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
};

export default ProgramCard; 