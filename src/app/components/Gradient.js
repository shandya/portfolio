"use client"

import { useState, useEffect } from 'react';


export default function Gradient() {
  // const [position, setPosition] = useState({ x: 0, y: 0 });
  const [positionGradient1, setPositionGradient1] = useState(Math.random() * 100);
  const [positionGradient2, setPositionGradient2] = useState(Math.random() * 100);

  const speedGradient1 = Math.random() / 2;
  const speedGradient2 = Math.random() / 2;


  // useEffect(() => {
  //   const updateMousePosition = (e) => {
  //     setPosition({ x: e.clientX, y: e.clientY });
  //   };

  //   window.addEventListener('mousemove', updateMousePosition);
  //   return () => window.removeEventListener('mousemove', updateMousePosition);
  // }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositionGradient1((prevPosition) => (prevPosition + speedGradient1));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval2 = setInterval(() => {
      setPositionGradient2((prevPosition) => (prevPosition + speedGradient2));
    }, 100); 

    return () => clearInterval(interval2);
  }, []);

  return (
    <div className="w-full h-full z-0 pointer-events-none fixed top-0 left-0 bg-filter">
      {/* <div className="cursor" style={{ left: position.x, top: position.y }}></div> */}
      <div 
        className="gradient w-screen h-screen left-0 top-0 absolute mix-blend-multiply"
        style={{backgroundPosition: `0% -${positionGradient1}%`}}
      ></div>
      <div 
        className="gradient-2 w-screen h-screen left-0 top-0 absolute mix-blend-multiply"
        style={{backgroundPosition: `0% ${positionGradient2}%`}}
      ></div>
    </div>
  );
}
