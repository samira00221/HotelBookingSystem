import React from "react";
import { Typewriter } from "react-simple-typewriter";
import { useNavigate } from "react-router-dom";
import { FiPhone, FiMail } from "react-icons/fi";
import { FaInstagram, FaXTwitter } from "react-icons/fa6"; 


const Hero = ({ aboutSectionRef, contactSectionRef }) => {
  const navigate = useNavigate();

  return (
    <div className="text-gray-200 bg-black min-h-screen flex flex-col">
      {/* Hero Top Section */}
      <div className="max-w-[800px] mt-8 w-full flex-1 mx-auto text-center flex flex-col justify-center">
        <div className="mt-8"> {/* Subtle vertical spacing */}
          <p className="text-[#00df9a] font-bold p-0.5">FIND YOUR PERFECT STAY</p>
          <h1 className="md:text-5.5xl sm:text-5xl text-4xl font-bold md:py-4">
            Reserve in seconds.
          </h1>
          <div>
            <p className="md:text-4.5xl sm:text-4xl text-xl font-bold py-4">
              Seamless hotel booking in{" "}
              <span className="md:text-4.5xl sm:text-4xl text-xl font-bold md:pl-4 pl-2">
                <Typewriter
                  words={["KIGALI", "MUSANZE", "RUBAVU", "NYAGATARE"]}
                  loop={0}
                  cursor
                  cursorStyle="_"
                  typeSpeed={100}
                  deleteSpeed={180}
                  delaySpeed={600}
                />
              </span>
            </p>
          </div>
          <p className="md:text-2xl text-xl font-bold text-gray-400">
            Discover family-friendly stays where comfort and memories come together.
          </p>
        </div>
        <button
          className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black"
          onClick={() => navigate("/login")}
        >
          Get Started
        </button>
      </div>

      {/* Bottom Section: About (right) and Contact (left) */}
      <div className="w-full bg-black py-10 mt-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:justify-between gap-8 px-4">
          {/* Contact Section */}
          <div ref={contactSectionRef} className="md:w-1/2 w-full mb-8 md:mb-0">
            <h2 className="text-2xl font-bold text-[#00df9a] mb-4">Contact Us</h2>
            <p className="mb-4 text-gray-300">Have questions or need help? Reach out to us:</p>
            <div className="flex flex-col items-start space-y-4 text-lg">
              <div className="flex items-center space-x-3">
                <FiPhone className="text-[#00df9a] text-2xl" />
                <span className="text-gray-300 font-semibold">+250780000000</span>
              </div>
              <div className="flex items-center space-x-3">
                <FiMail className="text-[#00df9a] text-2xl" />
                <span className="text-gray-300 font-semibold">travella@info.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaInstagram className="text-[#00df9a] text-2xl" />
                <a
                  href="https://instagram.com/travella_rw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 font-semibold hover:underline"
                >
                  @travella_rw
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FaXTwitter className="text-[#00df9a] text-2xl" />
                <span className="text-gray-300 font-semibold">@travellaRwanda</span>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div ref={aboutSectionRef} className="md:w-1/2 w-full mt-10 md:mt-0">
            <h2 className="text-2xl font-bold text-[#00df9a] mb-4">About Travella</h2>
            <p className="text-gray-300 text-lg">
              Travella is your gateway to discovering and booking the best hotels across Rwanda.
              Explore top destinations like Kigali, Rubavu, Musanze, and Nyagatare, compare
              amenities and prices, and enjoy a seamless booking and payment experience — all in
              one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

